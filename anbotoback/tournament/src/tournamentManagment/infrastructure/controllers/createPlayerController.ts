import { validateOrReject, ValidationError } from "class-validator";
import { Request, RequestHandler, Response } from "express";
import { CreatePlayerUseCase } from "../../application/createPlayerUseCase";
import { Player } from "../../domain/entities/Player";
import { CreatePlayerDTO } from "../dtos/createPlayerDTO";
import logger from "../logs/logger";

export class CreatePlayerController {
    constructor(readonly useCase: CreatePlayerUseCase) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { name, lastname, email, password, phone, birthday } = req.body;

            if (!name || !lastname || !email || !password || !phone || !birthday) {
                res.status(400).json({ error: "Todos los campos son obligatorios." });
                return;
            }

            const dto = new CreatePlayerDTO(name, lastname, email, password, phone, new Date(birthday));
            await validateOrReject(dto);

            const now = new Date();
            const futureDate = new Date(now.getTime() + 5 * 60 * 1000);
            const player = new Player({
                name: dto.name,
                lastname: dto.lastname,
                email: dto.email,
                phone: dto.phone,
                birthday: dto.birthday,
                password: dto.password,
                isActive: false,
                optCode: this.generateTimeBasedCode(),
                optExpired: futureDate
            });

            await this.useCase.execute(player);
            res.status(201).json({ message: "El jugador fue creado correctamente." });
        } catch (error: any) {
            if (Array.isArray(error) && error[0] instanceof ValidationError) {
                const validationErrors = this.formatValidationErrors(error);
                console.error("Errores de validación:", validationErrors);
                res.status(400).json({ errors: validationErrors });
                return;
            }
            console.error("Error inesperado:", error);
            logger.error(error.message, {
                metadata: {
                    route: req.originalUrl,
                    method: req.method,
                    params: req.params,
                    body: req.body,
                    headers: req.headers,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"] || "No disponible",
                    stack: error.stack,
                },
            });
            res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
        }
    };

    private formatValidationErrors(errors: ValidationError[]): { [key: string]: string[] } {
        const formattedErrors: { [key: string]: string[] } = {};
        for (const error of errors) {
            if (error.constraints) {
                formattedErrors[error.property] = Object.values(error.constraints);
            }
        }
        return formattedErrors;
    }

    private generateTimeBasedCode = (): string => {
        const timestamp = Date.now().toString();
        return timestamp.slice(-6);
    };
}
