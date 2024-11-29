export interface TokenService {
    generateToken(payload: object, expiresIn?: string): string;
    validateToken(token: string): boolean;
    getTokenData<T>(token: string): T;
}