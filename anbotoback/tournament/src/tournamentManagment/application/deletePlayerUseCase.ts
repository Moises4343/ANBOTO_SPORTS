import { PlayerRepository } from "../domain/ports/playerRepository";
import { CustomError } from "../infrastructure/error/error";

export class DeletePlayerUseCase {
  constructor(private repository: PlayerRepository) {}

  async execute(playerUuid: string): Promise<void> {
    const playerExists = await this.repository.getByUUID(playerUuid);

    if (!playerExists) {
      throw new CustomError(404, "El jugador no existe.");
    }

    await this.repository.deletePlayer(playerUuid);
  }
}
