import { Request, RequestHandler, Response } from "express";
import { CustomError } from "../error/error";
import { RegisterTeamTournamentUseCase } from "../../application/registerTeamTournamentUseCase";
import { TokenService } from "../../application/tokenService";

export class RegisterTeamTournamentController {
    constructor(readonly useCase: RegisterTeamTournamentUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            
            const token = authHeader.split(" ")[1];
            if(!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const uuid = req.params.uuid;
            const teamUUID = req.params.teamUUID
            await this.useCase.execute(teamUUID, uuid);
            res.status(200).json({message: 'Felicidades, has inscrito a tu equipo Correctamente'});
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}