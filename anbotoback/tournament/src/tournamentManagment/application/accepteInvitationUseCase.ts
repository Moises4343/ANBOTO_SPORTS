import { PlayerRepository } from "../domain/ports/playerRepository";
import { SenderService } from "./senderService";

export class AcceptInvitationUseCase {
    constructor(readonly repository: PlayerRepository, readonly service: SenderService){}

    async execute(uuid: string, teamUUID: string, notificationUUID: string) {
        const data = await this.repository.acceptInvitation(uuid, teamUUID);
        for(const playerUUID of data.players) {
            await this.service.sendMessage("accept_invitation_queue", {
                msg: "Felicitaciones, un nuevo jugador se ha unido a tu equipo",
                playerUUID,
                teamUUID,
                notificationUUID,
                type: "CONGRATS"
            });
        }
    }
}