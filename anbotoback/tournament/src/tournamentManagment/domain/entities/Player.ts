import { v4 as uuidv4 } from 'uuid';

export class Player {
    uuid: string;
    name: string | null;
    lastname: string | null;
    email: string | null;
    phone: string | null;
    birthday: Date | null;
    password: string | null;
    optCode: string | null;
    optExpired: Date | null;
    isActive: boolean;
    teamUUID: string | null;

    constructor(data: Partial<Player> = {}) {
        this.uuid = data.uuid || uuidv4();
        this.name = data.name ?? null;
        this.lastname = data.lastname ?? null;
        this.email = data.email ?? null;
        this.phone = data.phone ?? null;
        this.birthday = data.birthday ?? null;
        this.password = data.password ?? null;
        this.optCode = data.optCode ?? null;
        this.optExpired = data.optExpired ?? null;
        this.isActive = data.isActive ?? false;
        this.teamUUID = data.teamUUID ?? null;
    }
}
