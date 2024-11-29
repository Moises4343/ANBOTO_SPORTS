import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class GetDetailsTournamentUseCase {
    constructor(readonly repository: TournamentRepository){}

    async execute(uuid: string) {
        return await this.repository.getTournamentDetails(uuid);
    }
}