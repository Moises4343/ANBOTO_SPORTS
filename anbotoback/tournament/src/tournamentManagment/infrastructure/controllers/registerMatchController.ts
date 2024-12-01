import { Request, RequestHandler, Response } from "express";
import { CustomError } from "../error/error";
import { TokenService } from "../../application/tokenService";
import { RegisterMatchResultsUseCase } from "../../application/registerMatchUseCase";

export class RegisterMatchResultsController {
    constructor(readonly useCase: RegisterMatchResultsUseCase, readonly service: TokenService) {}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            }

            const token = authHeader.split(" ")[1];
            if (!this.service.validateToken(token)) {
                throw new CustomError(401, "El token no es válido");
            }

            const uuid = req.params.uuid;

            const { roundName, results } = req.body;
            if (!uuid || !roundName || !Array.isArray(results)) {
                throw new CustomError(400, "Faltan datos en la solicitud.");
            }

            await this.useCase.execute(uuid, roundName, results);
            res.status(200).json({ message: "Resultados registrados correctamente." });
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}