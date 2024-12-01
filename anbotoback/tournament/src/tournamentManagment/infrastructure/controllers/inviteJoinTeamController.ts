import { Request, RequestHandler, Response } from "express";
import { InviteJoinTeamUseCase } from "../../application/inviteJoinTeamUseCase";
import { CustomError } from "../error/error";
import { TokenService } from "../../application/tokenService";

export class InviteJointTeamController {
    constructor(readonly useCase: InviteJoinTeamUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");

            const token = authHeader.split(" ")[1];
            this.service.validateToken(token);

            const { playerUUID, teamUUID } = req.body;
            if(!playerUUID || !teamUUID) throw new CustomError(400, "Envia los datos correctamente");

            await this.useCase.execute(playerUUID, teamUUID);

            res.status(200).json({message: 'Invitacion enviada correctamente'});
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}