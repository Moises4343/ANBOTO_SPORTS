import express, { Application } from "express";
import morgan from "morgan";
import "reflect-metadata";
import { AppDataSource } from "./paymentManagement/infrastructure/database/data-source";
import { paymentRouter } from "./paymentManagement/infrastructure/routes/paymentRoutes";

const app: Application = express();

app.use(express.json());
app.use(morgan('dev'));
app.use('/payments', paymentRouter);

process.loadEnvFile();
const PORT = process.env.PORT || 3000;
  
app.listen(PORT, async () => {
    await AppDataSource.initialize();
    console.log('DATABASE RUNNING CORRECTLY');
    console.log(`SERVER RUNNING IN http://localhost:${PORT}.`);
});