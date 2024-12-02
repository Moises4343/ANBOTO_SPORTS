import * as amqplib from "amqplib";
import { connectRabbit } from "./rabbit";

export const listenToQueue = async (
    queueName: string,
    onMessage: (message: any) => Promise<void>
): Promise<void> => {
    try {
        const connection = await connectRabbit();
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: true });
        console.log(`Esperando mensajes en la cola "${queueName}"...`);

        channel.consume(
            queueName,
            async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        console.log(`Mensaje recibido en "${queueName}":`, content);

                        await onMessage(content);

                        channel.ack(msg);
                    } catch (error) {
                        console.error(`Error procesando mensaje de "${queueName}":`, error);

                        channel.nack(msg, false, true);
                    }
                }
            },
            { noAck: false } 
        );
    } catch (error) {
        console.error(`Error escuchando la cola "${queueName}":`, error);
    }
};