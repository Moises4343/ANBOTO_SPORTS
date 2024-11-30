import { CreateNotificationUseCase } from "../application/createNotificationUseCase";
import { DeleteNotificationUseCase } from "../application/deleteNotificacionUseCase";
import { GetNotificationsUseCase } from "../application/getNotificationsUseCase";
import { SendEmailUseCase } from "../application/sendEmailUseCase";
import { TokenService } from "../application/tokenService";
import { EmailService } from "../domain/ports/emailService";
import { DeleteNotificationController } from "./controllers/deleteNotificationController";
import { GetNotificationsController } from "./controllers/getNotificationsController";
import { Notificationrepositoryimpl } from "./repositories/notificationRepositoryImpl";
import { NodemailerEmailService } from "./services/nodemailerEmailService";
import { JWTTokenService } from "./token/token";

const tokenService: TokenService = new JWTTokenService("miContraseñaSuperSegura$123");
const emailService: EmailService = new NodemailerEmailService();

const repository: Notificationrepositoryimpl  = new Notificationrepositoryimpl();

export const sendEmailUseCase: SendEmailUseCase = new SendEmailUseCase(emailService);
export const createNotificationUseCase: CreateNotificationUseCase = new CreateNotificationUseCase(repository);
const getNotificationsUseCase: GetNotificationsUseCase = new GetNotificationsUseCase(repository);
export const deleteNotificationUseCase: DeleteNotificationUseCase = new DeleteNotificationUseCase(repository);

export const getNotificationsController: GetNotificationsController = new GetNotificationsController(getNotificationsUseCase, tokenService);
export const deleteNotificationController: DeleteNotificationController = new DeleteNotificationController(deleteNotificationUseCase, tokenService);