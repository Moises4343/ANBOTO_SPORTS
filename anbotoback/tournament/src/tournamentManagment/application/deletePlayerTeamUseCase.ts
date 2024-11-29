import { PlayerRepository } from "../domain/ports/playerRepository";

export class DeletePlayerTeamUseCase {
    constructor(readonly repository: PlayerRepository){}

    async execute(uuid: string, teamUUID: string) {
        await this.repository.leaveTeam(uuid, teamUUID);
    }
}