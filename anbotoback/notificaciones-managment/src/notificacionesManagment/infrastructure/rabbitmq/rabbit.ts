import * as amqplib from 'amqplib';

export const connectRabbit = async () => {
    try {
        const connection = await amqplib.connect('amqp://anboto:193243up@54.83.57.80:5672');
        console.log("Conexión exitosa a RabbitMQ");
        return connection;
    } catch (error) {
        console.error("Error conectándose a RabbitMQ:", error);
        throw error;
    }
};
