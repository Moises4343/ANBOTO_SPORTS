import { Request, RequestHandler, Response } from "express";
import { GetDetailsTournamentUseCase } from "../../application/getDetailsTournamentUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class GetDetailsTournamentController {
    constructor(readonly useCase: GetDetailsTournamentUseCase, readonly service: TokenService) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            if (!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const uuid = req.params.uuid;
            const data = await this.useCase.execute(uuid);
            res.status(200).json(data);
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