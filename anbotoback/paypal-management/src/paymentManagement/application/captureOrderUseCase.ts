import { v4 as uuidv4 } from "uuid";
import { CapturedPayment } from "../domain/entities/CapturedPayment";
import { PaymentsGateway } from "../domain/ports/paymentGateway";
import { PaymentRepository } from "../domain/ports/paymentRepository";
import { HttpError } from "../infrastructure/errors/error";

export class CaptureOrderUseCase {
    constructor(readonly gateway: PaymentsGateway, readonly repository: PaymentRepository){}

    async execute(id: string, userId: string) {
        const isUserSuscribed = await this.repository.isUserSubscribed(userId);
        if(isUserSuscribed) throw new HttpError("El usuario ya tiene una suscripcion activa", 409);
        const data: CapturedPayment = await this.gateway.captureOrder(id);
        await this.repository.savePrmiumSucription({
            id: uuidv4(),userId: userId, orderId: data.orderId, transactionId: data.transactionId, 
            startDate: new Date(Date.now()), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return data;
    }
}