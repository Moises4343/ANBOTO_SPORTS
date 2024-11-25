import { Router } from "express";
import { captureOrderController, createOrderController, isUserSuscribedController } from "../dependencies";

export const paymentRouter: Router = Router();

paymentRouter.post('/create-order', createOrderController.execute.bind(createOrderController));
paymentRouter.post('/capture-order', captureOrderController.execute.bind(captureOrderController));
paymentRouter.get('/:userID', isUserSuscribedController.execute.bind(isUserSuscribedController));