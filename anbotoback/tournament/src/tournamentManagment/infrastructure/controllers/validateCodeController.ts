import { Request, RequestHandler, Response } from "express";
import { ValidateCodeUseCase } from "../../application/validateCodeUseCase";
import { CustomError } from "../error/error";

export class ValidateCodeController {
    constructor(readonly useCase: ValidateCodeUseCase){}

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, code} = req.body;
            if(!email || !code) throw new CustomError(400, 'Envia todos los datos'); 

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!emailRegex.test(email)) throw new CustomError(400, 'Envia un email valido');
            
            if(code.length != 6) throw new CustomError(400, 'Envia un codigo valido'); 

            await this.useCase.execute(email, code);

            res.status(200).json({mesage: 'Jugador activado correctamente'});
        } catch(error: any) {
            console.error("Error inesperado:", error);
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    }
}