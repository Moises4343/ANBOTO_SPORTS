import { Notification } from "../domain/entities/Notification";
import { NotificationRepostory } from "../domain/ports/notificationRepository";

export class CreateNotificationUseCase {
    constructor(readonly repository: NotificationRepostory) {}

    async execute(notification: Notification) {
        await this.repository.creataNotification(notification);
    }
}