import { Request, RequestHandler, Response } from "express";
import { GetMembersByTeamUseCase } from "../../application/getMemberByTeamUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class GetMembersByTeamController {
    constructor(readonly useCase: GetMembersByTeamUseCase, readonly service: TokenService) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            if (!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const uuid = req.params.uuid;
            if (!uuid) throw new CustomError(400, "Todo el cuerpo es obligatorio");

            const {name, players} = await this.useCase.execute(uuid);
            
            res.status(200).json({ teamName: name, players });
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