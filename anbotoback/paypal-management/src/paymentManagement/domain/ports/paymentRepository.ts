export interface PaymentRepository {
    isUserSubscribed(userId: string): Promise<boolean | null>;
    saveOrder(order: { id: string, amount: number, currencyCode: string }): Promise<void>;
    savePrmiumSucription(suscrption: {id: string, userId: string, orderId: string, transactionId: string, startDate: Date, endDate: Date }): Promise<void>
}