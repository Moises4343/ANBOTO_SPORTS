import { TeamRepository } from "../domain/ports/teamRepository";

export class GetIncompleteTeamsUseCase {
  constructor(private readonly repository: TeamRepository) {}

  async execute() {
    return await this.repository.getIncompleteTeams();
  }
}
