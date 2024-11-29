import { queueRegistry } from "../queueRegistry";
import { listenToQueue } from "../rabbitConsumer";

export const initializeRabbitConsumers = async (): Promise<void> => {
    try {
        for (const { queueName, handler } of queueRegistry) {
            await listenToQueue(queueName, handler);
        }
        console.log("Todos los consumidores se han inicializado correctamente.");
    } catch (error) {
        console.error("Error inicializando los consumidores:", error);
    }
};
