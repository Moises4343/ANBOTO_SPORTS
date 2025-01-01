import * as amqplib from 'amqplib';

export async function connectRabbit(): Promise<amqplib.Connection> {
  try {
    const connection = await amqplib.connect('amqp://anboto:193243up@54.83.57.80:5672');
    console.log("CONNECTION SUCCESSFULLY");
    return connection;
  } catch (error) {
    console.error("Error al conectar a RabbitMQ: ", error);
    throw error;
  }
}