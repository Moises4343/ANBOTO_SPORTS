import { Request, Response } from "express";
import { GetAllPlayersUseCase } from "../../application/getAllPlayersUseCase";

export class GetAllPlayersController {
  constructor(private useCase: GetAllPlayersUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.useCase.execute();
      res.status(200).json(users);
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
