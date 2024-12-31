import { Request, Response } from "express";

export class CancelPaymentController {
  async execute(req: Request, res: Response) {
    try {
      res.status(200).json({
        message: "El pago ha sido cancelado por el usuario.",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: error.message || "Error interno en el manejo de cancelación de pago.",
      });
    }
  }
}
