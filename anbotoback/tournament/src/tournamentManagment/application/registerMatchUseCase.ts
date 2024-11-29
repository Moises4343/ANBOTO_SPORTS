import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class RegisterMatchResultsUseCase {
    constructor(readonly repository: TournamentRepository) {}

    async execute(
        uuid: string,
        roundName: string,
        results: Array<{ teamA: string; teamB: string; scoreA: number; scoreB: number }>
    ) {
        await this.repository.registerMatchResults(uuid, roundName, results);
    }
}
