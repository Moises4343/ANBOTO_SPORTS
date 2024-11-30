import { Notification } from "../../domain/entities/Notification";
import { NotificationRepostory } from "../../domain/ports/notificationRepository";
import { NotificationModel } from "../database/models/notificationModel";
import { CustomError } from "../error/customError";

export class Notificationrepositoryimpl implements NotificationRepostory {
    async deleteNotification(uuid: string): Promise<void> {
        try {
            const result = await NotificationModel.deleteOne({ uuid });

            if (result.deletedCount === 0) throw new CustomError(404, "La notificación no existe.");
            
            console.log(`Notificación con uuid ${uuid} eliminada exitosamente.`);
        } catch (error: any) {
            console.error("Error al eliminar la notificación:", error.message);
            throw new Error(error.message || "Error interno del servidor.");
        }

    }
    
    async creataNotification(notification: Notification): Promise<any> {
        try {
            const newNotification = new NotificationModel({
                uuid: notification.uuid,
                player_uuid: notification.player_uuid,
                type: notification.type,
                team_uuid: notification.team_uuid,
                createdAt: notification.createdAt,
                message: notification.msg
            });

            const savedNotification = await newNotification.save();
            console.log("Notificación creada exitosamente:", savedNotification);
            return savedNotification;
        } catch (error: any) {
            console.error("Error al crear la notificación:", error.message);
            throw new Error("No se pudo crear la notificación.");
        }
    }

    async getNotifications(playerUUID: string): Promise<Notification[]> {
        try {
            const notifications = await NotificationModel.find({ player_uuid: playerUUID }).sort({ createdAt: -1 });

            return notifications.map((notification) => new Notification(
                notification.message,
                notification.player_uuid, 
                notification.type,       
                notification.team_uuid,   
                notification.uuid,
                notification.createdAt    
            ));
        } catch (error: any) {
            console.error("Error al obtener las notificaciones:", error.message);
            throw new Error("No se pudieron obtener las notificaciones.");
        }


    }
  
}