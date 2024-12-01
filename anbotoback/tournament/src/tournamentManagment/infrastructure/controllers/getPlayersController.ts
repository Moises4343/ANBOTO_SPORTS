import { Request, RequestHandler, Response } from "express";
import { GetPlayersUseCase } from "../../application/getPlayersUseCase";
import { CustomError } from "../error/error";
import { TokenService } from "../../application/tokenService";

export class GetPlayersController {
    constructor(readonly useCase: GetPlayersUseCase, readonly service: TokenService){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
            }

            const token = authHeader.split(" ")[1];
            if(!this.service.validateToken(token)) throw new CustomError(401, "El token no es valido");

            const search = req.params.search;
            if(!search) throw new CustomError(400, "No se esta enviando correctamente la información");
            const data = await this.useCase.execute(search);
            res.status(200).json({data});
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }   
}