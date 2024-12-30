import { Request, RequestHandler, Response } from "express";
import { DeletePlayerTeamUseCase } from "../../application/deletePlayerTeamUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class DeletePlayerTeamController {
    constructor(readonly useCase: DeletePlayerTeamUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            }

            const token = authHeader.split(" ")[1];
            if (!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");
            const teamUUID = req.params.teamUUID;
            if(!teamUUID) throw new CustomError(400, "Falta información");

            const data: {uuid: string, email: string} = this.service.getTokenData(token);
            await this.useCase.execute(data.uuid, teamUUID);
            res.status(200).json({message: 'Has salido del equipo correctamente'});
        } catch (error: any) {
            console.error("Error inesperado:", error);
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