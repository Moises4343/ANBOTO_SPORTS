import { EmailService } from "../domain/ports/emailService";

export class SendEmailUseCase {
    constructor(private readonly emailService: EmailService) {}

    async execute(to: string, subject: string, body: string): Promise<void> {
        console.log(`Enviando correo a ${to} con asunto "${subject}"`);
        await this.emailService.sendEmail(to, subject, body);
    }
}