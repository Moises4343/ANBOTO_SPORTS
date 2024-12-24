import { Player } from "../domain/entities/Player";
import { PlayerRepository } from "../domain/ports/playerRepository";

export class GetAllPlayersUseCase {
  constructor(private repository: PlayerRepository) {}

  async execute(): Promise<Player[]> {
    return await this.repository.getAllPlayers();
  }
}
