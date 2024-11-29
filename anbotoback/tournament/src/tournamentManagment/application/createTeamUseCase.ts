import { TeamRepository } from "../domain/ports/teamRepository";

export class CreateTeamUseCase {
    constructor(readonly repository: TeamRepository){}

    async execute(uuid: string, name: string): Promise<void> {
        await this.repository.createTeam(uuid, name);
    }
}