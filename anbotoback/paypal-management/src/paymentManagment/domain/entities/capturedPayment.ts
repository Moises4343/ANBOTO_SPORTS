export class CapturedPayment {
    transactionId: string;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    payerEmail: string;
    captureDate: Date;

    constructor(
        transactionId: string,
        orderId: string,
        status: string,
        amount: number,
        currency: string,
        payerEmail: string,
        captureDate: Date
    ) {
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.status = status;
        this.amount = amount;
        this.currency = currency;
        this.payerEmail = payerEmail;
        this.captureDate = captureDate;
    }
}