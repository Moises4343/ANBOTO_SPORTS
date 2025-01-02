import { Router } from "express";
import { cancelPaymentController, captureOrderController, createOrderController, deleteSubscriptionController, isUserSuscribedController } from "../dependencies";

export const paymentRouter: Router = Router();

paymentRouter.post('/create-order', createOrderController.execute.bind(createOrderController));
paymentRouter.post('/capture-order', captureOrderController.execute.bind(captureOrderController));
paymentRouter.get('/:userID', isUserSuscribedController.execute.bind(isUserSuscribedController));

paymentRouter.get("/cancel", cancelPaymentController.execute.bind(cancelPaymentController));
paymentRouter.delete('/delete/:userId', deleteSubscriptionController.execute.bind(deleteSubscriptionController));