import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class RegisterTeamTournamentUseCase {
    constructor(readonly repository: TournamentRepository){}

    async execute(teamUUID: string, uuid: string) {
        await this.repository.registerATeam(teamUUID, uuid);
    }
}