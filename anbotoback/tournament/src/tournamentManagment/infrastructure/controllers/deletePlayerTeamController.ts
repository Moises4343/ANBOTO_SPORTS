import { Request, RequestHandler, Response } from "express";
import { DeletePlayerTeamUseCase } from "../../application/deletePlayerTeamUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";

export class DeletePlayerTeamController {
    constructor(readonly useCase: DeletePlayerTeamUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const teamUUID = req.params.teamUUID;
            if(!teamUUID) throw new CustomError(400, "Falta información");

            const data: {uuid: string, email: string} = this.service.getTokenData(authHeader);
            await this.useCase.execute(data.uuid, teamUUID);
            res.status(200).json({message: 'Has salido del equipo correctamente'});
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}