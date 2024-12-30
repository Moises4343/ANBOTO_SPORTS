import { Request, Response } from "express";
import { GetPlayerByUUIDUseCase } from "../../application/getPlayerByUUIDUseCase";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class GetPlayerByUUIDController {
  constructor(private useCase: GetPlayerByUUIDUseCase) { }

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        throw new CustomError(400, "El UUID es obligatorio.");
      }

      const player = await this.useCase.execute(uuid);

      if (!player) {
        throw new CustomError(404, "Jugador no encontrado.");
      }

      res.status(200).json(player);
    } catch (error: any) {
      console.error("Error en getUserById:", error);
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
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

