import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class FinalizeTournamentUseCase {
    constructor(readonly repository: TournamentRepository) {}

    async execute(uuid: string) {
        await this.repository.finalizeTournament(uuid);
    }
}