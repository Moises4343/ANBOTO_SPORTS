import * as amqplib from 'amqplib';

export const connectRabbit = async () => {
    try {
        const connection = await amqplib.connect(process.env.RABBITMQ_URI!);
        console.log("Conexión exitosa a RabbitMQ");
        return connection;
    } catch (error) {
        console.error("Error conectándose a RabbitMQ:", error);
        throw error;
    }
};
