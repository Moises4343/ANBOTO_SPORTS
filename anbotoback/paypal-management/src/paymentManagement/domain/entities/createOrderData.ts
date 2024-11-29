import { IsNotEmpty, IsNumber, Length, Min } from "class-validator";

export class CreateOrderData {
    @IsNotEmpty({ message: "El campo 'amount' es requerido" })
    @IsNumber({}, { message: "La cantidad debe ser un número válido" })
    @Min(0, { message: "La cantidad no puede ser negativa" })
    readonly amount: number;

    @IsNotEmpty({ message: "El campo 'currencyCode' es requerido" })
    @Length(3, 3, { message: "El código de moneda debe tener exactamente 3 caracteres" })
    readonly currencyCode: string;


    constructor(amount: number, currencyCode: string) {
        this.amount = amount;
        this.currencyCode = currencyCode.toUpperCase();
    }

    async validate() {
        return Promise.resolve();
    }
}