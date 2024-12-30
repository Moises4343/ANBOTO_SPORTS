import { Request, RequestHandler, Response } from "express";
import { InviteJoinTeamUseCase } from "../../application/inviteJoinTeamUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class InviteJointTeamController {
    constructor(readonly useCase: InviteJoinTeamUseCase, readonly service: TokenService) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            this.service.validateToken(token);

            const { playerUUID, teamUUID } = req.body;
            if (!playerUUID || !teamUUID) throw new CustomError(400, "Envia los datos correctamente");

            await this.useCase.execute(playerUUID, teamUUID);

            res.status(200).json({ message: 'Invitacion enviada correctamente' });
        } catch (error: any) {
            logger.error(error.message, {
                metadata: {
                    route: req.originalUrl,
                    method: req.method,
                    params: req.params,
                    body: req.body,
                    headers: req.headers,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"] || "No disponible",
                    stack: error.stack,
                },
            });
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}