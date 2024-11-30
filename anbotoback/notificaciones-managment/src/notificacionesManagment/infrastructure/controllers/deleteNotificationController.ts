import { Request, RequestHandler, Response } from "express";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/customError";
import { DeleteNotificationUseCase } from "../../application/deleteNotificacionUseCase";

export class DeleteNotificationController {
    constructor(readonly useCase: DeleteNotificationUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            this.service.validateToken(token);
            
            const { uuid } = req.params;

            if (!uuid) {
                res.status(400).json({ error: "El uuid es requerido en la ruta." });
                return;
            }

            await this.useCase.execute(uuid);
            res.status(200).json({message: 'Notificacion borrada correctamente'});
        } catch (error: any) {
            console.error("Error al obtener las notificaciones:", error.message);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}