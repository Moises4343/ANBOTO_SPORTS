import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class GenerateMatchesUseCase {
    constructor(readonly repository: TournamentRepository) {}

    async execute(uuid: string) {
        await this.repository.generateMatches(uuid);
    }
}