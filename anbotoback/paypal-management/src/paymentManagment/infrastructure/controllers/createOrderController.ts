import { Request, Response, RequestHandler } from "express";
import { CreateOrderUseCase } from "../../application/createOrderUseCase";
import { ValidationException } from "../../domain/validator/validator";
import { HttpError } from "../errors/error";

export class CreateOrderController {
    constructor(readonly useCase: CreateOrderUseCase) { }

    execute: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { amount, currencyCode } = req.body;
            const requiredFields = ["amount", "currencyCode"];

            const missingFields = requiredFields.filter((field) => req.body[field] === undefined);
            if (missingFields.length > 0) {
                res.status(400).json({
                    message: "Faltan los siguientes campos obligatorios:",
                    missingFields,
                });
                return;
            }

            const response = await this.useCase.execute(amount as number, currencyCode);
            res.status(201).json({ data: response, message: "Orden Creada Correctamente" });
            return;
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.httpStatus).json({ error: error.message });
                return;
            }

            if (error instanceof ValidationException) {
                res.status(error.HTTP_STATUS).json({ error: error.validations });
                return;
            }

            console.error("Error inesperado:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    };
}