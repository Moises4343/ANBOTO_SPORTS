import { Request, RequestHandler, Response } from "express";
import { GetAllTeamsUseCase } from "../../application/getAllTeamsUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";


export class GetAllTeamsController {
    constructor(private readonly useCase: GetAllTeamsUseCase, readonly service: TokenService) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            }

            const token = authHeader.split(" ")[1];
            if (!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");
            const teams = await this.useCase.execute();
            res.status(200).json({ data: teams, message: "Equipos obtenidos correctamente." });
        } catch (error: any) {
            console.error("Error al obtener equipos:", error);
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
    };
}
