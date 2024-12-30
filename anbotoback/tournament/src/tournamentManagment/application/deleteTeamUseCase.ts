import { TeamRepository } from "../domain/ports/teamRepository";
import { CustomError } from "../infrastructure/error/error";

export class DeleteTeamUseCase {
    constructor(private readonly repository: TeamRepository) {}

    async execute(teamUUID: string, userUUID: string): Promise<void> {
        const team = await this.repository.getTeamByUUID(teamUUID);

        if (!team) {
            throw new CustomError(404, "El equipo no existe.");
        }

        if (team.createdBy !== userUUID) {
            throw new CustomError(403, "No tienes permisos para eliminar este equipo.");
            
        }

        await this.repository.deleteTeam(teamUUID);
    }
}
