import { PaymentRepository } from "../domain/ports/paymentRepository";
import { HttpError } from "../infrastructure/errors/error";

export class DeleteSubscriptionUseCase {
    constructor(private readonly repository: PaymentRepository) {}

    async execute(userId: string): Promise<{ message: string }> {
        const isUserSubscribed = await this.repository.isUserSubscribed(userId);

        if (!isUserSubscribed) {
            throw new HttpError("El usuario no tiene una suscripción activa.", 400);
        }

        await this.repository.deleteSubscriptionByUserId(userId);

        return {
            message: "La suscripción premium ha sido eliminada correctamente."
        };
    }
}
