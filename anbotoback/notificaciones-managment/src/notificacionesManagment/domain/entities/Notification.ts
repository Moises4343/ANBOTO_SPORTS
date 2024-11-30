import { v4 as uuidv4 } from "uuid";

export class Notification {
    uuid: string;
    player_uuid: string;
    type: "CONGRATS" | "REQUEST";
    team_uuid?: string | null;
    createdAt: Date;
    msg: string;

    constructor(
        message: string,
        player_uuid: string,
        type: "CONGRATS" | "REQUEST",
        team_uuid?: string | null,
        uuid?: string | null,
        createdAt: Date = new Date(),
    ) {
        this.uuid = uuid ?? uuidv4();
        this.player_uuid = player_uuid;
        this.type = type;
        this.team_uuid = team_uuid ?? null;
        this.createdAt = createdAt;
        this.msg = message
    }
}