import { Notification } from "../domain/entities/Notification";
import { NotificationRepostory } from "../domain/ports/notificationRepository";

export class DeleteNotificationUseCase {
    constructor(readonly repository: NotificationRepostory) {}

    async execute(uuid: string) {
        await this.repository.deleteNotification(uuid);
    }
}