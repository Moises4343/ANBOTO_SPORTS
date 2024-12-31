import { Request, RequestHandler, Response } from "express";
import { CleanPlayersTeamUUIDUseCase } from "../../application/cleanPlayersTeamUUIDUseCase";
import logger from "../logs/logger";

export class CleanPlayersTeamUUIDController {
    constructor(private readonly useCase: CleanPlayersTeamUUIDUseCase) {}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            await this.useCase.execute();
            res.status(200).json({ message: "teamUUID de los jugadores limpiado correctamente." });
        } catch (error: any) {
            console.error("Error al limpiar teamUUID:", error);
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
            res.status(500).json({ error: error.message || "Error interno al limpiar teamUUID." });
        }
    };
}
