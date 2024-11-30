import nodemailer from "nodemailer";
import { EmailService } from "../../domain/ports/emailService";

export class NodemailerEmailService implements EmailService {
    private transporter: nodemailer.Transporter;
    private readonly from: string;

    constructor() {
        process.loadEnvFile();
        this.from = process.env.SMTP_FROM!;
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT!, 10),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: this.from,
                to,
                subject,
                html: body, 
            });
            console.log(`Correo enviado a ${to}`);
        } catch (error) {
            console.error(`Error enviando correo a ${to}:`, error);
            throw error;
        }
    }
}