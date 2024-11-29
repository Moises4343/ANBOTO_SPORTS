import { Notification } from "../domain/entities/Notification";
import { NotificationRepostory } from "../domain/ports/notificationRepository";

export class GetNotificationsUseCase {
    constructor(readonly repository: NotificationRepostory){}

    async execute(playerUUID: string): Promise<Notification[]> {
        return await this.repository.getNotifications(playerUUID);
    }
}