import { processInvitation, processCreateNotifications, processCreatePlayerNotificationQueue } from "./consumers/playerNotificationConsumer";

export const queueRegistry = [
    { queueName: "create_player_notification_queue", handler: processCreatePlayerNotificationQueue },
    { queueName: "invite_player", handler: processInvitation },
    { queueName: "accept_invitation_queue", handler: processCreateNotifications }
];