import { Request, RequestHandler, Response } from "express";
import { DeletePlayerUseCase } from "../../application/deletePlayerUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class DeletePlayerController {
  constructor(
    private useCase: DeletePlayerUseCase,
    private tokenService: TokenService
  ) { }

  execute: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
      }

      const token = authHeader.split(" ")[1];
      if (!this.tokenService.validateToken(token)) {
        throw new CustomError(401, "El token no es válido.");
      }

      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);
      if (!uuid) {
        throw new CustomError(401, "El token no contiene el UUID del usuario.");
      }

      const { playerUuid } = req.params;
      if (!playerUuid) {
        throw new CustomError(400, "El UUID del jugador es obligatorio.");
      }

      await this.useCase.execute(playerUuid);

      res.status(200).json({ message: "Jugador eliminado correctamente." });
    } catch (error: any) {
      console.error("Error al eliminar jugador:", error);
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
      res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor." });
    }
  };
}
