import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class RegisterTeamTournamentUseCase {
    constructor(readonly repository: TournamentRepository) {}

    async execute(teamUUID: string | null, uuid: string | null) {
        if (!teamUUID) {
            console.warn(" Registro de equipo sin teamUUID. Se procederá sin este identificador.");
        }

        if (!uuid) {
            console.warn(" Registro de equipo sin uuid. Se procederá sin este identificador.");
        }

        await this.repository.registerATeam(teamUUID || "DEFAULT_TEAM_UUID", uuid || "DEFAULT_UUID");
    }
}
