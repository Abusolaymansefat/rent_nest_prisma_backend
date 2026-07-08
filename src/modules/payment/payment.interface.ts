export interface ICreatePayment {
  rentalRequestId: string;
}

export interface IConfirmPayment {
  paymentIntentId: string;
}

export interface IPaymentResponse {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
}