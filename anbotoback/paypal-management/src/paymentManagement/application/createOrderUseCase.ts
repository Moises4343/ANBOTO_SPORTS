import { CreateOrderData } from "../domain/entities/CreateOrderData";
import { PaymentOrder } from "../domain/entities/PaymentOrder";
import { PaymentsGateway } from "../domain/ports/paymentGateway";
import { PaymentRepository } from "../domain/ports/paymentRepository";
import { Validator } from "../domain/validator/validator";

export class CreateOrderUseCase {
    constructor(readonly gateway: PaymentsGateway, readonly repository: PaymentRepository){}

    async execute(amount: number, currencyCode: string): Promise<PaymentOrder>  {
        const orderData = new CreateOrderData(amount, currencyCode);
        const validator = new Validator(orderData);
        await validator.validate();
        const data: PaymentOrder = await this.gateway.createOrder(orderData);
        await this.repository.saveOrder({id: data.getId(), amount, currencyCode });
        return data;
    }
}