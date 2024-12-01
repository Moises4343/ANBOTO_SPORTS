import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class CancelTournamentUseCase {
    constructor(readonly repository: TournamentRepository){}

    async execute(uuid: string) {
        await this.repository.cancelTournament(uuid);
    }
}