import { Notification } from "../entities/Notification";

export interface NotificationRepostory {
    creataNotification(notification: Notification): Promise<any>;
    getNotifications(playerUUID: string): Promise<Notification[]>;
    deleteNotification(uuid: string) : Promise<void>;
}