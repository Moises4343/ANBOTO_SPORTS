import { Request, RequestHandler, Response } from "express";
import { GetMembersByTeamUseCase } from "../../application/getMemberByTeamUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";

export class GetMembersByTeamController {
    constructor(readonly useCase: GetMembersByTeamUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            
            const token = authHeader.split(" ")[1];
            if(!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const uuid = req.params.uuid;
            if(!uuid) throw new CustomError(400, "Todo el cuerpo es obligatorio");
            
            const players = await this.useCase.execute(uuid);

            res.status(200).json({players});
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}