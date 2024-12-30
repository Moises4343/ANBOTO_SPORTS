import { Request, RequestHandler, Response } from "express";
import { CreateTeamUseCase } from "../../application/createTeamUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class CreateTeamController {
    constructor(readonly useCase: CreateTeamUseCase, readonly service: TokenService) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            const data: any = this.service.getTokenData(token);

            const { name } = req.body;
            if (!name) throw new CustomError(400, 'No se esta enviando el nombre de equipo');

            await this.useCase.execute(data.uuid, name);
            res.status(200).json({ message: 'Equipo creado correctamente' });
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