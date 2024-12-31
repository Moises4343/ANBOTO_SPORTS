import { PlayerRepository } from "../domain/ports/playerRepository";

export class CleanPlayersTeamUUIDUseCase {
    constructor(private readonly repository: PlayerRepository) {}

    async execute(): Promise<void> {
        await this.repository.cleanPlayersTeamUUID();
    }
}
