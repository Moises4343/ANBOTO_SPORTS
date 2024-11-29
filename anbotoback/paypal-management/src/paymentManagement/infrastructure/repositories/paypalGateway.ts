import axios, { AxiosError } from "axios";
import { CapturedPayment } from "../../domain/entities/capturedPayment";
import { CreateOrderData } from "../../domain/entities/createOrderData";
import { PaymentOrder } from "../../domain/entities/paymentOrder";
import { PaymentsGateway } from "../../domain/ports/paymentGateway";
import { HttpError } from "../errors/error";

process.loadEnvFile();
export class PaypalGateway implements PaymentsGateway {
  private readonly CLIENT_ID = process.env.CLIENT_ID || 'no-clientID';
  private readonly BASE_URL = process.env.BASE_URL || 'no-base-url';
  private readonly SECRET = process.env.SECRET || 'no-secret';

  private async getAccessToken(): Promise<string> {
    const response = await axios({
      url: `${this.BASE_URL}/v1/oauth2/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: this.CLIENT_ID,
        password: this.SECRET,
      },
      data: 'grant_type=client_credentials',
    });
    return response.data.access_token;
  }

  async createOrder(order: CreateOrderData): Promise<PaymentOrder> {
    try {
      const token = await this.getAccessToken();
      const response = await axios({
        url: `${this.BASE_URL}/v2/checkout/orders`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: order.currencyCode,
                value: order.amount.toString(),
              },
            },
          ],
        }),
      });
      const { id, status, links } = response.data;
      return new PaymentOrder(id, status, links);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status || 500;
        const message = axiosError.response?.data || axiosError.message;
        throw new HttpError(`PayPal API Error: ${message}`, status);
      }

      throw new HttpError("Error inesperado al crear la orden.", 500);
    }
  }

  async captureOrder(id: String): Promise<CapturedPayment> {
    try {
      const token = await this.getAccessToken();
      const response = await axios({ url: `${this.BASE_URL}/v2/checkout/orders/${id}/capture`, method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      const data = response.data;
      if (data.status !== "COMPLETED") {
        throw new HttpError(
          `La orden no pudo ser capturada porque su estado actual es: ${data.status}`,
          400
        );
      }

      const capture = data.purchase_units[0].payments.captures[0];
    
      return new CapturedPayment(capture.id, data.id, capture.status, parseFloat(capture.amount.value), capture.amount.currency_code, data.payer.email_address, new Date(capture.create_time));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status || 500;
        const data = (axiosError.response?.data as { details: any[] }).details[0];
        if (status === 422 && data.issue == 'ORDER_ALREADY_CAPTURED') {
          throw new HttpError("Intento duplicado de captura.", 422);
        } 
        if(status == 404 && data.issue == 'INVALID_RESOURCE_ID') {
          throw new HttpError("Identificador de orden invalida", 404);
        }
        if(status == 422 && data.issue == 'ORDER_NOT_APPROVED') {
          throw new HttpError("Orden no aprovada", 422);
        }
        const message = axiosError.response?.data || axiosError.message;
        throw new HttpError(`PayPal API Error: ${message}`, status);
      }
      throw new HttpError("Error inesperado al capturar la orden.", 500);
    }
  }
}