import { Player } from "../domain/entities/Player";
import { PlayerRepository } from "../domain/ports/playerRepository";

export class GetPlayersUseCase {
    constructor(readonly repository: PlayerRepository){}

    async execute(search: string): Promise<Player[]> {
        return await this.repository.getPlayer(search);
    }
}