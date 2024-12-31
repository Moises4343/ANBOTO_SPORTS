import { Request, RequestHandler, Response } from "express";
import { DeleteTeamAdminUseCase } from "../../application/deleteTeamAdminUseCase";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class DeleteTeamAdminController {
    constructor(private readonly useCase: DeleteTeamAdminUseCase) {}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const teamUUID = req.params.teamUUID;
            if (!teamUUID) {
                throw new CustomError(400, "UUID del equipo es obligatorio.");
            }

            await this.useCase.execute(teamUUID);

            res.status(200).json({
                message: "Equipo eliminado correctamente (Admin).",
            });
        } catch (error: any) {
            console.error("Error inesperado al eliminar equipo (Admin):", error);
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
            res.status(error.statusCode || 500).json({
                error: error.message || "Error interno del servidor",
            });
        }
    };
}
