import { Request, RequestHandler, Response } from "express";
import { CustomError } from "../error/error";
import { TokenService } from "../../application/tokenService";
import { AdvanceRoundUseCase } from "../../application/advancedRoundUseCase";

export class AdvanceRoundController {
    constructor(readonly useCase: AdvanceRoundUseCase, readonly service: TokenService) {}

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
            await this.useCase.execute(uuid);
            res.status(200).json({ message: "Ronda avanzada correctamente." });
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}
