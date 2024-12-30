import { Request, RequestHandler, Response } from "express";
import { LoginPlayerUseCase } from "../../application/loginPlayerUseCase";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class LoginPlayerController {
    constructor(readonly useCase: LoginPlayerUseCase) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) throw new CustomError(400, 'Todos los campos son obligatorios.');

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) throw new CustomError(400, 'Envia un email valido');

            if (password.length < 8 || password.length > 20) throw new CustomError(400, 'Envia una contraseña valida');

            res.status(200).json(await this.useCase.execute(email, password));
        } catch (error: any) {
            console.error("Error inesperado:", error);
            logger.error(error.message, {
                metadata: {
                    route: req.originalUrl,
                    method: req.method,
                    params: req.params,
                    body: {
                        ...req.body,
                        password: req.body?.password ? '[HIDDEN]' : undefined, 
                    },
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