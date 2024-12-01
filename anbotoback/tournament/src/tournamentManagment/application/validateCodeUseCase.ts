import { PlayerRepository } from "../domain/ports/playerRepository";

export class ValidateCodeUseCase {
    constructor(readonly repository: PlayerRepository){}
    
    async execute(email: string, code: string) {
        await this.repository.validateCode(email, code);
    }
}