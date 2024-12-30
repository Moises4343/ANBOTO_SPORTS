import { TeamRepository } from "../domain/ports/teamRepository";

export class GetAllTeamsUseCase {
  constructor(private readonly repository: TeamRepository) {}

  async execute() {
    return await this.repository.getAllTeams();
  }
}
