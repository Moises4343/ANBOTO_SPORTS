import { Player } from "../domain/entities/Player";
import { PlayerRepository } from "../domain/ports/playerRepository";

export class GetPlayerByUUIDUseCase {
  constructor(private repository: PlayerRepository) {}

  async execute(uuid: string): Promise<Player | null> {
    return await this.repository.getByUUID(uuid);
  }
}
