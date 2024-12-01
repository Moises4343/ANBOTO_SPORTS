import { TeamRepository } from "../domain/ports/teamRepository";
import { SenderService } from "./senderService";

export class InviteJoinTeamUseCase {
    constructor(readonly service: SenderService, readonly repository: TeamRepository){}
    
    async execute(playerUUID: string, teamUUID: string) {
        const name = await this.repository.getNameTeam(teamUUID, playerUUID);
        const data = {
            playerUUID,
            teamUUID,
            type: 'REQUEST',
            message: 'El equipo ' + name + ' te ha invitado a unirte a su equipo'
        };

        await this.service.sendMessage('invite_player', data);
    }
}