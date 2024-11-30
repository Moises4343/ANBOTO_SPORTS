import express from "express";
import { initializeRabbitConsumers } from "./notificacionesManagment/infrastructure/rabbitmq/consumers/rabbitConsumerInitializer";
import { connectToDatabase } from "./notificacionesManagment/infrastructure/database/database";
import { notificationRouter } from "./notificacionesManagment/infrastructure/routes/notificationRouter";

process.loadEnvFile();
const app = express();

app.use(express.json());

(async () => {
    try {
        await connectToDatabase();
        await initializeRabbitConsumers();

        const PORT = process.env.PORT || 4000;

        app.use('/notifications', notificationRouter);

        app.listen(PORT, () => {
            console.log(`SERVER RUNNING IN http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el microservicio:", error);
        process.exit(1);
    }
})();
