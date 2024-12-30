import { Request, RequestHandler, Response } from "express";
import { GetAllPlayersUseCase } from "../../application/getAllPlayersUseCase";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/error";
import logger from "../logs/logger";

export class GetAllPlayersController {
  constructor(
    private useCase: GetAllPlayersUseCase,
    private service: TokenService
  ) { }

  execute: RequestHandler = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
      }

      const token = authHeader.split(" ")[1];
      if (!this.service.validateToken(token)) {
        throw new CustomError(401, "El token no es válido");
      }

      const { uuid } = this.service.getTokenData<{ uuid: string }>(token);
      if (!uuid) {
        throw new CustomError(401, "El token no contiene el UUID del usuario.");
      }

      const users = await this.useCase.execute();

      res.status(200).json({ data: users });
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);
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
}

