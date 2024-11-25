import { CaptureOrderUseCase } from "../application/captureOrderUseCase";
import { CreateOrderUseCase } from "../application/createOrderUseCase";
import { IsUserSuscribedUseCase } from "../application/isUserSuscribedUseCase";
import { CaptureOrderController } from "./controllers/captureOrderController";
import { CreateOrderController } from "./controllers/createOrderController";
import { IsUserSuscribedController } from "./controllers/isUserSuscribedController";
import { AppDataSource } from "./database/data-source";
import { Order } from "./database/models/Order";
import { PremiumSubscription } from "./database/models/PremiumSuscription";
import { PaymentMySQLRepository } from "./repositories/paymentMySQLRepository";
import { PaypalGateway } from "./repositories/paypalGateway";

const paypalGateway: PaypalGateway = new PaypalGateway();

const orderRepository = AppDataSource.getRepository(Order);
const suscrptionRepository = AppDataSource.getRepository(PremiumSubscription);
const paymentRepository = new PaymentMySQLRepository(orderRepository, suscrptionRepository);

const createOrderUseCase: CreateOrderUseCase = new CreateOrderUseCase(paypalGateway, paymentRepository);
const captureOrderUseCase: CaptureOrderUseCase = new CaptureOrderUseCase(paypalGateway, paymentRepository);
const isUserSuscribedUseCase: IsUserSuscribedUseCase = new IsUserSuscribedUseCase(paymentRepository);

export const createOrderController: CreateOrderController = new CreateOrderController(createOrderUseCase);
export const captureOrderController: CaptureOrderController = new CaptureOrderController(captureOrderUseCase);
export const isUserSuscribedController: IsUserSuscribedController = new IsUserSuscribedController(isUserSuscribedUseCase);