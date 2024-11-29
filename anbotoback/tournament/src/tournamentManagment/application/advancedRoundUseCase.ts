import { TournamentRepository } from "../domain/ports/tournamentRepository";

export class AdvanceRoundUseCase {
    constructor(readonly repository: TournamentRepository) {}

    async execute(uuid: string) {
        await this.repository.advanceRound(uuid);
    }
}
