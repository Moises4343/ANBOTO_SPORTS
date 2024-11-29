import { Notification } from "../../../domain/entities/Notification";
import { sendEmailUseCase, createNotificationUseCase, deleteNotificationUseCase } from "../../dependencies";

export const processCreatePlayerNotificationQueue = async (message: any): Promise<void> => {
    console.log("Mensaje recibido en la cola create_player_notification_queue:", message);

    const { to, playerName, code } = message;

    if (!to || !playerName || !code) {
        console.error("Mensaje inválido. Falta información necesaria:", message);
        return;
    }

    try {
        const subject = "¡Bienvenido a nuestra plataforma!";
        const body = `<h1>Hola ${playerName}!</h1>
                      <p>Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte con nosotros,
                      tu codigo de activación es <b>${code}</b>.</p>`;
        await sendEmailUseCase.execute(to, subject, body);
        console.log(`Correo enviado a ${to} para el jugador ${playerName}`);
    } catch (error) {
        console.error("Error procesando mensaje de create_player_notification_queue:", error);
    }
};

export const processInvitation = async (msg: any): Promise<void> => {
    console.log("Mensaje recibido en la cola invite_player:", msg);

    const { playerUUID, teamUUID, type, message } = msg;

    if (!playerUUID || !teamUUID || !message || !type) {
        console.error("Mensaje inválido. Falta información necesaria:", msg);
        return;
    }

    try {
        const notification = new Notification(message, playerUUID, type, teamUUID)
        await createNotificationUseCase.execute(notification);
        console.log("Notificacion Creada Correctamente");
    } catch (error) {
        console.error("Error procesando mensaje de create_player_notification_queue:", error);
    }
};

export const processCreateNotifications = async (message: any): Promise<void> => {
    console.log("Mensaje recibido en la cola accept_invitation_queue:", message);

    const { msg, playerUUID, teamUUID, notificationUUID } = message;

    if (!msg || !playerUUID || !teamUUID || !notificationUUID) {
        console.error("Mensaje inválido. Falta información necesaria:", message);
        return;
    }

    try {
        const notification = new Notification(msg, playerUUID, 'CONGRATS', teamUUID);
        await createNotificationUseCase.execute(notification);
        console.log("Notificacion Creada Correctamente");
    } catch (error) {
        console.error("Error procesando mensaje de create_player_notification_queue:", error);
    }
};