import { PlayerRepository } from "../domain/ports/playerRepository";
import { TeamRepository } from "../domain/ports/teamRepository";
import { TokenService } from "./tokenService";

export class LoginPlayerUseCase {
    constructor(readonly repository: PlayerRepository, readonly service: TokenService, readonly teamRepository: TeamRepository){}

    async execute(email: string, password: string): Promise<any> {
        const data = await this.repository.login(email, password);
        const team = await this.teamRepository.getTeamUUUID(data.uuid);
        return {
            team,
            token: this.service.generateToken(data, "1d"),
            mesage: 'Jugador loggeado correctamente'
        }
    }
}