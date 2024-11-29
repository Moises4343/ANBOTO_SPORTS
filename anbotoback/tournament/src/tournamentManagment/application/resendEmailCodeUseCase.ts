import { PlayerRepository } from "../domain/ports/playerRepository";

export class ResendEmailCodeUseCase {
    constructor(readonly repository: PlayerRepository){}

    async execute(email: string, code: string): Promise<void> {
        await this.repository.resendCode(email, code);
    }
}