import { Player } from "../domain/entities/Player";
import { PlayerRepository } from "../domain/ports/playerRepository";

export class CreatePlayerUseCase {
    constructor(readonly repository: PlayerRepository){}

    async execute(player: Player): Promise<void> {
        await this.repository.create(player);
    }   
}