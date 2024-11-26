import { PaymentRepository } from "../domain/ports/paymentRepository";

export class IsUserSuscribedUseCase {
    constructor(readonly repository: PaymentRepository){}

    async execute(userId: string): Promise<{ isPremium: boolean, message: string }> {
        const isUserSuscribed = await this.repository.isUserSubscribed(userId);
        console.log(isUserSuscribed);
        if(isUserSuscribed == null || !isUserSuscribed) return {
            "isPremium": false, 
            "message": "El usuario no tiene ninguna suscripcion activa"
        };

        return {"isPremium": true, "message": "El usuario tiene una suscripcion activa"};
    }
}