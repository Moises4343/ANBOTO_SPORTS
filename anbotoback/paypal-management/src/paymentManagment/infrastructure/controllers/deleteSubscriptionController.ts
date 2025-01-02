import { Request, RequestHandler, Response } from "express";
import { DeleteSubscriptionUseCase } from "../../application/deleteSubscriptionUseCase";
import { HttpError } from "../errors/error";

export class DeleteSubscriptionController {
    constructor(private readonly useCase: DeleteSubscriptionUseCase) {}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params; 

            console.log("userId recibido:", userId); 

            if (!userId) {
                throw new HttpError("El userId es obligatorio.", 400);
            }

            const result = await this.useCase.execute(userId);

            res.status(200).json(result);
        } catch (error: any) {
            console.error("Error al eliminar suscripción:", error.message);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    };
}
