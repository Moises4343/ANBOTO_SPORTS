import { IsNotEmpty, IsString, IsDate, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

export class CreatePlayerDTO {
    @IsNotEmpty({ message: "El nombre no puede estar vacío." })
    @IsString({ message: "El nombre debe ser una cadena de texto." })
    name: string;

    @IsNotEmpty({ message: "El apellido no puede estar vacío." })
    @IsString({ message: "El apellido debe ser una cadena de texto." })
    lastname: string;

    @IsNotEmpty({ message: "El correo electrónico no puede estar vacío." })
    @IsEmail({}, { message: "El correo electrónico no tiene un formato válido." })
    email: string;

    @IsNotEmpty({ message: "La contraseña no puede estar vacía." })
    @IsString({ message: "La contraseña debe ser una cadena de texto." })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    @MaxLength(20, { message: "La contraseña no puede tener más de 20 caracteres." })
    password: string;

    @IsNotEmpty({ message: "El número de teléfono no puede estar vacío." })
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: "El número de teléfono debe estar en formato E.164 (ejemplo: +521234567890)."
    })
    phone: string;

    @IsNotEmpty({ message: "La fecha de nacimiento no puede estar vacía." })
    @IsDate({ message: "La fecha de nacimiento debe ser una instancia de Date." })
    birthday: Date;

    constructor(name: string, lastname: string, email: string, password: string, phone: string, birthday: Date) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.birthday = birthday;
    }
}