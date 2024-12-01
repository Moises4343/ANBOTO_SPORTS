import { Request, RequestHandler, Response } from "express";
import { AcceptInvitationUseCase } from "../../application/accepteInvitationUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";

export class AcceptInvitationController {
    constructor(readonly useCase: AcceptInvitationUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            
            const token = authHeader.split(" ")[1];
            if(!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const { uuid, teamUUID, notificationUUID } = req.body;
            if(!uuid || !teamUUID || !notificationUUID) throw new CustomError(400, "Todo el cuerpo es obligatorio");
            
            await this.useCase.execute(uuid, teamUUID, notificationUUID);

            res.status(201).json({message: 'Invitación aceptada correctamente'});
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}