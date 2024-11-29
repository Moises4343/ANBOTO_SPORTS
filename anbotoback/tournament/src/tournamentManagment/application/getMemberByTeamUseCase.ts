import { TeamRepository } from "../domain/ports/teamRepository";

export class GetMembersByTeamUseCase {
    constructor(readonly repository: TeamRepository){}

    async execute(uuid: string) {
        return await this.repository.getMemberByTeam(uuid);
    }
}