import { Request, RequestHandler, Response } from "express";
import { CreateTournamentUseCase } from "../../application/createTournamentUseCase";
import { TokenService } from "../../application/tokenService";
import { Tournament } from "../../domain/entities/Tournament";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class CreateTournamentController {
    constructor(readonly useCase: CreateTournamentUseCase, readonly service: TokenService) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            if (!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const { name, type, startDate, endDate, teams } = req.body;

            if (!name || !type || !startDate || !endDate) {
                throw new CustomError(400, 'Todos los campos son obligatorios');
            }

            const tournament = new Tournament(name, type, new Date(startDate), new Date(endDate), 'Proceso', teams || []);
            await this.useCase.execute(tournament);
            res.status(201).json({ message: 'Torneo Creado Correctamente' });
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