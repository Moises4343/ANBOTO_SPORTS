import jwt from "jsonwebtoken";
import { TokenService } from "../../application/tokenService";
import { CustomError } from "../error/customError";

export class JWTTokenService implements TokenService {
    private readonly secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }

    generateToken(payload: object, expiresIn: string = "1h"): string {
        return jwt.sign(payload, this.secret, { expiresIn });
    }


    validateToken(token: string): boolean {
        try {
            jwt.verify(token, this.secret);
            return true;
        } catch (error) {
            return false;
        }
    }

    getTokenData<T>(token: string): T {
        try {
            const decoded = jwt.verify(token, this.secret) as T;
            return decoded;
        } catch (error) {
            throw new CustomError(401, "Token inválido o expirado.");
        }
    }
}
