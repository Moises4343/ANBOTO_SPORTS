import * as amqplib from 'amqplib';

export async function connectRabbit(): Promise<amqplib.Connection> {
  try {
    const connection = await amqplib.connect('amqp://guest:guest@localhost:5672');
    console.log("CONNECTION SUCCESSFULLY");
    return connection;
  } catch (error) {
    console.error("Error al conectar a RabbitMQ: ", error);
    throw error;
  }
}