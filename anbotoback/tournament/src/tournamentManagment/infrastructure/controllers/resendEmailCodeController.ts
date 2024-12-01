import { Request, RequestHandler, Response } from "express";
import { ResendEmailCodeUseCase } from "../../application/resendEmailCodeUseCase";
import { CustomError } from "../error/error";

export class ResendEmailCodeController {
    constructor(readonly useCase: ResendEmailCodeUseCase){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if(!email) throw new CustomError(400, 'Envia el email');

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!emailRegex.test(email)) throw new CustomError(400, 'Envia un email valido');

            await this.useCase.execute(email, this.generateTimeBasedCode());
            res.status(200).json({ message: "Codigo correctamente reenviado" });
        } catch (error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    };

    private generateTimeBasedCode = (): string => {
        const timestamp = Date.now().toString();
        return timestamp.slice(-6);
    };
}
