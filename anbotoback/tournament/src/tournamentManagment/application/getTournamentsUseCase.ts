import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class GetTournamentsUseCase {
    constructor(readonly repository: TournamentRepository){}

    async execute() {
        return await this.repository.getTournament();
    }
}