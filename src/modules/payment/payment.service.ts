import { PaymentProvider, PaymentStatus, PropertyAvailability, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { IConfirmPayment, ICreatePayment } from "./payment.interface";
import httpStatus from "http-status";


const createPaymentIntent = async (
      tenantId: string,
      payload: ICreatePayment
) => {
      const rentalRequest = await prisma.rentalRequest.findUnique({
            where: { id: payload.rentalRequestId },
            include: { property: true, payment: true },
      });

      if (!rentalRequest) {
            throw { statusCode: httpStatus.NOT_FOUND, message: "Rental request not found" };
      }

      if (rentalRequest.tenantId !== tenantId) {
            throw { statusCode: httpStatus.FORBIDDEN, message: "You are not allowed to pay for this rental request" };
      }

      if (rentalRequest.status !== RentalStatus.APPROVED) {
            throw { statusCode: httpStatus.BAD_REQUEST, message: "Rental request is not approved yet" };
      }

      if (rentalRequest.payment) {
            throw { statusCode: httpStatus.BAD_REQUEST, message: "Payment already exists for this rental request" };
      }
      

      const amount = Math.round(rentalRequest.property.price * 100);

      const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                  {
                        price_data: {
                              currency: "usd",
                              product_data: {
                                    name: rentalRequest.property.title ?? "Rental Payment",
                              },
                              unit_amount: amount,
                        },
                        quantity: 1,
                  },
            ],
            metadata: {
                  rentalRequestId: rentalRequest.id,
                  tenantId,
                  propertyId: rentalRequest.property.id,
            },
            success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.app_url}/payment/cancel`,
      });

      const payment = await prisma.payment.create({
            data: {
                  transactionId: session.id,
                  rentalRequestId: rentalRequest.id,
                  tenantId,
                  amount: rentalRequest.property.price,
                  provider: PaymentProvider.STRIPE,
                  status: PaymentStatus.PENDING,
            },
      });

      return {
            url: session.url,
            sessionId: session.id,
            payment,
      };
};


// const createPaymentIntent = async (
//       tenantId: string,
//       payload: ICreatePayment
// ) => {
//       const rentalRequest = await prisma.rentalRequest.findUnique({
//             where: { id: payload.rentalRequestId },
//             include: { property: true, payment: true },
//       });

//       if (!rentalRequest) {
//             throw { statusCode: httpStatus.NOT_FOUND, message: "Rental request not found" };
//       }

//       if (rentalRequest.tenantId !== tenantId) {
//             throw { statusCode: httpStatus.FORBIDDEN, message: "You are not allowed to pay for this rental request" };
//       }

//       if (rentalRequest.status !== RentalStatus.APPROVED) {
//             throw { statusCode: httpStatus.BAD_REQUEST, message: "Rental request is not approved yet" };
//       }

//       if (rentalRequest.payment) {
//             throw { statusCode: httpStatus.BAD_REQUEST, message: "Payment already exists for this rental request" };
//       }

//       const amount = Math.round(rentalRequest.property.price * 100);

//       const session = await stripe.checkout.sessions.create({
//             mode: "payment",
//             payment_method_types: ["card"],
//             line_items: [
//                   {
//                         price_data: {
//                               currency: "usd",
//                               product_data: {
//                                     name: rentalRequest.property.title ?? "Rental Payment",
//                               },
//                               unit_amount: amount,
//                         },
//                         quantity: 1,
//                   },
//             ],
//             metadata: {
//                   rentalRequestId: rentalRequest.id,
//                   tenantId,
//                   propertyId: rentalRequest.property.id,
//             },
//             success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${config.app_url}/payment/cancel`,
//       });

//       const payment = await prisma.payment.create({
//             data: {
//                   transactionId: session.id,
//                   rentalRequestId: rentalRequest.id,
//                   tenantId,
//                   amount: rentalRequest.property.price,
//                   provider: PaymentProvider.STRIPE,
//                   status: PaymentStatus.PENDING,
//             },
//       });

//       return {
//             url: session.url,
//             sessionId: session.id,
//             payment,
//       };
// };

const confirmPayment = async (
      tenantId: string,
      payload: IConfirmPayment
) => {
      if (!payload) {
            throw { statusCode: httpStatus.BAD_REQUEST, message: "Request body is required" };
      }

      const { sessionId } = payload;

      if (!sessionId) {
            throw { statusCode: httpStatus.BAD_REQUEST, message: "Session ID is required" };
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session) {
            throw { statusCode: httpStatus.NOT_FOUND, message: "Session not found in Stripe" };
      }

      const payment = await prisma.payment.findUnique({
            where: { transactionId: session.id },
            include: { rentalRequest: true },
      });

      if (!payment) {
            throw { statusCode: httpStatus.NOT_FOUND, message: "Payment record not found" };
      }

      if (payment.tenantId !== tenantId) {
            throw { statusCode: httpStatus.FORBIDDEN, message: "You are not authorized to confirm this payment" };
      }

      if (payment.status === PaymentStatus.COMPLETED) {
            return payment;
      }

      if (session.payment_status !== "paid") {
            throw { statusCode: httpStatus.BAD_REQUEST, message: "Payment has not been completed" };
      }

      const result = await prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                  where: { id: payment.id },
                  data: { status: PaymentStatus.COMPLETED, paidAt: new Date() },
            });

            await tx.rentalRequest.update({
                  where: { id: payment.rentalRequestId },
                  data: { status: RentalStatus.ACTIVE },
            });

            await tx.property.update({
                  where: { id: payment.rentalRequest.propertyId },
                  data: { availability: PropertyAvailability.RENTED },
            });

            return updatedPayment;
      });

      return result;
};



const markPaymentCompleted = async (sessionId: string) => {
      const payment = await prisma.payment.findUnique({
            where: { transactionId: sessionId },
            include: { rentalRequest: true },
      });

      if (!payment || payment.status === PaymentStatus.COMPLETED) {
            return;
      }

      await prisma.$transaction(async (tx) => {
            await tx.payment.update({
                  where: { id: payment.id },
                  data: { status: PaymentStatus.COMPLETED, paidAt: new Date() },
            });

            await tx.rentalRequest.update({
                  where: { id: payment.rentalRequestId },
                  data: { status: RentalStatus.ACTIVE },
            });

            await tx.property.update({
                  where: { id: payment.rentalRequest.propertyId },
                  data: { availability: PropertyAvailability.RENTED },
            });
      });
};

const getMyPayments = async (tenantId: string) => {
      const payments = await prisma.payment.findMany({
            where: { tenantId },
            include: {
                  rentalRequest: {
                        include: {
                              property: { include: { category: true } },
                        },
                  },
            },
            orderBy: { createdAt: "desc" },
      });

      return payments;
};

const getSinglePayment = async (paymentId: string, tenantId: string) => {
      const payment = await prisma.payment.findFirst({
            where: { id: paymentId, tenantId },
            include: {
                  tenant: {
                        select: { id: true, name: true, email: true, phone: true },
                  },
                  rentalRequest: {
                        include: {
                              property: {
                                    include: {
                                          landlord: {
                                                select: { id: true, name: true, email: true, phone: true },
                                          },
                                          category: true,
                                    },
                              },
                        },
                  },
            },
      });

      if (!payment) {
            throw { statusCode: httpStatus.NOT_FOUND, message: "Payment not found" };
      }

      return payment;
};

export const PaymentService = {
      createPaymentIntent,
      confirmPayment,
      markPaymentCompleted,
      getMyPayments,
      getSinglePayment,
};