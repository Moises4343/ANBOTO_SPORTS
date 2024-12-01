import * as amqplib from 'amqplib';
import { SenderService } from '../../application/senderService';

export class RabbitMQService implements SenderService {
    private static instance: RabbitMQService | null = null;
    private readonly connection: amqplib.Connection;
    private channel: amqplib.Channel | null = null;

    constructor(connection: amqplib.Connection) {
        this.connection = connection;
    }

    static async getInstance(): Promise<RabbitMQService> {
        if (!RabbitMQService.instance) {
            const connection = await amqplib.connect('amqp://guest:guest@localhost:5672');
            RabbitMQService.instance = new RabbitMQService(connection);
        }
        return RabbitMQService.instance;
    }

    private async getChannel(): Promise<amqplib.Channel> {
        if (!this.channel) {
            this.channel = await this.connection.createChannel();
        }
        return this.channel;
    }

    async sendMessage(queue: string, message: object): Promise<void> {
        try {
            const channel = await this.getChannel();
            await channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
            console.log(`Mensaje enviado a la cola ${queue}: ${JSON.stringify(message)}`);
        } catch (error: any) {
            console.error('Error al enviar el mensaje:', error);
            throw new Error(`Error al enviar mensaje a la cola ${queue}: ${error.message}`);
        }
    }

    async receiveMessage(queue: string, timeout: number = 5000): Promise<any> {
        const channel = await this.getChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout: No message received from queue "${queue}"`));
            }, timeout);

            channel.consume(
                queue,
                (msg) => {
                    if (msg !== null) {
                        clearTimeout(timer);
                        try {
                            const message = JSON.parse(msg.content.toString());
                            console.log(`Mensaje recibido de la cola ${queue}: ${JSON.stringify(message)}`);
                            channel.ack(msg);
                            resolve(message);
                        } catch (error: any) {
                            console.error(`Error procesando mensaje de la cola ${queue}:`, error);
                            channel.nack(msg);
                            reject(new Error(`Error procesando mensaje: ${error.message}`));
                        }
                    }
                },
                { noAck: false }
            );
        });
    }

    async closeConnection(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            await this.connection.close();
            console.log('Conexión a RabbitMQ cerrada.');
        } catch (error) {
            console.error('Error al cerrar la conexión:', error);
        } finally {
            RabbitMQService.instance = null;
        }
    }
}
