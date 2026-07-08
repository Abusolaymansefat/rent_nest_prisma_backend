import { PaymentProvider, PaymentStatus, PropertyAvailability, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { IConfirmPayment, ICreatePayment } from "./payment.interface";
import httpStatus from "http-status";


const createPaymentIntent = async (
      tenantId: string,
      payload: ICreatePayment
) => {
      const rentalRequest = await prisma.rentalRequest.findUnique({
            where: {
                  id: payload.rentalRequestId,
            },
            include: {
                  property: true,
                  payment: true,
            },
      });

      if (!rentalRequest) {
            throw {
                  statusCode: httpStatus.NOT_FOUND,
                  message: "Rental request not found",
            };
      }

      if (rentalRequest.tenantId !== tenantId) {
            throw {
                  statusCode: httpStatus.FORBIDDEN,
                  message: "You are not allowed to pay for this rental request",
            };
      }

      if (rentalRequest.status !== RentalStatus.APPROVED) {
            throw {
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Rental request is not approved yet",
            };
      }

      if (rentalRequest.payment) {
            throw {
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Payment already exists for this rental request",
            };
      }

      const amount = Math.round(rentalRequest.property.price * 100);

      const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: {
                  enabled: true,
            },
            metadata: {
                  rentalRequestId: rentalRequest.id,
                  tenantId,
                  propertyId: rentalRequest.property.id,
            },
      });

      const payment = await prisma.payment.create({
            data: {
                  transactionId: paymentIntent.id,
                  rentalRequestId: rentalRequest.id,
                  tenantId,
                  amount: rentalRequest.property.price,
                  provider: PaymentProvider.STRIPE,
                  status: PaymentStatus.PENDING,
            },
      });

      return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            payment,
      };
};

const confirmPayment = async (
      tenantId: string,
      payload: IConfirmPayment
) => {
      const { paymentIntentId } = payload;

      if (!paymentIntentId) {
            throw {
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Payment Intent ID is required",
            };
      }

      // Verify payment from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (!paymentIntent) {
            throw {
                  statusCode: httpStatus.NOT_FOUND,
                  message: "Payment not found in Stripe",
            };
      }

      const payment = await prisma.payment.findUnique({
            where: {
                  transactionId: paymentIntent.id,
            },
            include: {
                  rentalRequest: true,
            },
      });

      if (!payment) {
            throw {
                  statusCode: httpStatus.NOT_FOUND,
                  message: "Payment record not found",
            };
      }

      if (payment.tenantId !== tenantId) {
            throw {
                  statusCode: httpStatus.FORBIDDEN,
                  message: "You are not authorized to confirm this payment",
            };
      }

      if (payment.status === PaymentStatus.COMPLETED) {
            return payment;
      }

      if (paymentIntent.status !== "succeeded") {
            throw {
                  statusCode: httpStatus.BAD_REQUEST,
                  message: "Payment has not been completed",
            };
      }

      const result = await prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                  where: {
                        id: payment.id,
                  },
                  data: {
                        status: PaymentStatus.COMPLETED,
                        paidAt: new Date(),
                  },
            });

            await tx.rentalRequest.update({
                  where: {
                        id: payment.rentalRequestId,
                  },
                  data: {
                        status: RentalStatus.ACTIVE,
                  },
            });

            await tx.property.update({
                  where: {
                        id: payment.rentalRequest.propertyId,
                  },
                  data: {
                        availability: PropertyAvailability.RENTED,
                  },
            });

            return updatedPayment;
      });

      return result;
};

const getMyPayments = async (tenantId: string) => {
      const payments = await prisma.payment.findMany({
            where: {
                  tenantId,
            },
            include: {
                  rentalRequest: {
                        include: {
                              property: {
                                    include: {
                                          category: true,
                                    },
                              },
                        },
                  },
            },
            orderBy: {
                  createdAt: "desc",
            },
      });

      return payments;
};
const getSinglePayment = async (
      paymentId: string,
      tenantId: string
) => {
      const payment = await prisma.payment.findFirst({
            where: {
                  id: paymentId,
                  tenantId,
            },
            include: {
                  tenant: {
                        select: {
                              id: true,
                              name: true,
                              email: true,
                              phone: true,
                        },
                  },
                  rentalRequest: {
                        include: {
                              property: {
                                    include: {
                                          landlord: {
                                                select: {
                                                      id: true,
                                                      name: true,
                                                      email: true,
                                                      phone: true,
                                                },
                                          },
                                          category: true,
                                    },
                              },
                        },
                  },
            },
      });

      if (!payment) {
            throw {
                  statusCode: httpStatus.NOT_FOUND,
                  message: "Payment not found",
            };
      }

      return payment;
};

export const PaymentService = {
      createPaymentIntent,
      confirmPayment,
      getMyPayments,
      getSinglePayment,
};