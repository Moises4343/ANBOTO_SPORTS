import { GetNotificationsUseCase } from "../../application/getNotificationsUseCase";
import { Request, RequestHandler, Response } from "express";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/customError";

export class GetNotificationsController {
    constructor(readonly useCase: GetNotificationsUseCase, readonly service: TokenService) {}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            this.service.validateToken(token);
            
            const { playerUUID } = req.params;

            if (!playerUUID) {
                res.status(400).json({ error: "El playerUUID es requerido en la ruta." });
                return;
            }

            const notifications = await this.useCase.execute(playerUUID);

            res.status(200).json({data: notifications});
        } catch (error: any) {
            console.error("Error al obtener las notificaciones:", error.message);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    };
}
