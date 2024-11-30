import { Router } from "express";
import { deleteNotificationController, getNotificationsController } from "../dependencies";

export const notificationRouter: Router = Router();

notificationRouter.get("/:playerUUID", getNotificationsController.execute.bind(getNotificationsController));
notificationRouter.delete("/:uuid", deleteNotificationController.execute.bind(deleteNotificationController));