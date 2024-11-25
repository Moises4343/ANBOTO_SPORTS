import { Request, RequestHandler, Response } from "express";
import { IsUserSuscribedUseCase } from "../../application/isUserSuscribedUseCase";

export class IsUserSuscribedController {
    constructor(readonly useCase: IsUserSuscribedUseCase){}

    execute: RequestHandler = async(req: Request, res: Response) => {
        try {
            const userID = req.params.userID;
            if(userID == undefined) {
                res.status(400).json({ message: "No se esta enviando todos los datos correctamente" });
                return;
            }

            const response: { isPremium: boolean, message: string} = await this.useCase.execute(userID);
            res.status(200).json({ ...response });
            return;
        } catch (error) {
            console.error("Error inesperado:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}