import { TeamRepository } from "../domain/ports/teamRepository";

export class GetTeamsInTournamentsUseCase {
    constructor(private readonly repository: TeamRepository) {}

    async execute(): Promise<any> {
        const teams = await this.repository.getTeamsInTournaments();
        return teams;
    }
}
