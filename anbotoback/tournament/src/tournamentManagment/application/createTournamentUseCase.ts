import { Tournament } from "../domain/entities/Tournament";
import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class CreateTournamentUseCase {
    constructor(readonly repository: TournamentRepository){}

    async execute(tournament: Tournament) {
        await this.repository.createTournament(tournament);
    }
}