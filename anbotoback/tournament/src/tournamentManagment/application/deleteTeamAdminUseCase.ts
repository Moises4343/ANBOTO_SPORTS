import { TeamRepository } from "../domain/ports/teamRepository";
import { CustomError } from "../infrastructure/error/error";

export class DeleteTeamAdminUseCase {
    constructor(private readonly repository: TeamRepository) {}

    async execute(teamUUID: string): Promise<void> {
        const team = await this.repository.getTeamByUUID(teamUUID);

        if (!team) {
            throw new CustomError(404, "El equipo no existe.");
        }

        await this.repository.deleteTeam(teamUUID);
    }
}
