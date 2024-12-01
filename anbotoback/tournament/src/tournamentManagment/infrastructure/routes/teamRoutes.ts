import { Router } from "express";
import { CreateTeamController } from "../controllers/createTeamController";
import { InviteJointTeamController } from "../controllers/inviteJoinTeamController";
import { GetMembersByTeamController } from "../controllers/getMembersByTeamController";

export const teamRouter = (
    createTeamController: CreateTeamController,
    inviteJointTeamController: InviteJointTeamController,
    getMembersByTeamController: GetMembersByTeamController
): Router => {
    const router = Router();

    router.post('/create', createTeamController.execute.bind(createTeamController));
    router.post('/invite-join', inviteJointTeamController.execute.bind(inviteJointTeamController));
    router.get('/get-members/:uuid', getMembersByTeamController.execute.bind(getMembersByTeamController));

    return router;
};