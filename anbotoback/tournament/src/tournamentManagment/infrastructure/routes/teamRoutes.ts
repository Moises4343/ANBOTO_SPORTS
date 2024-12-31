import { Router } from "express";
import { CreateTeamController } from "../controllers/createTeamController";
import { DeleteTeamAdminController } from "../controllers/deleteTeamAdminController";
import { DeleteTeamController } from "../controllers/deleteTeamController";
import { GetAllTeamsController } from "../controllers/getAllTeamsController";
import { GetIncompleteTeamsController } from "../controllers/getIncompleteTeamsController";
import { GetMembersByTeamController } from "../controllers/getMembersByTeamController";
import { GetTeamsInTournamentsController } from "../controllers/getTeamsInTournamentsController";
import { InviteJointTeamController } from "../controllers/inviteJoinTeamController";

export const teamRouter = (
    createTeamController: CreateTeamController,
    inviteJointTeamController: InviteJointTeamController,
    getMembersByTeamController: GetMembersByTeamController,
    getIncompleteTeamsController: GetIncompleteTeamsController,
    getAllTeamsController: GetAllTeamsController,
    getTeamsInTournamentsController: GetTeamsInTournamentsController,
    deleteTeamController: DeleteTeamController,
    deleteTeamAdminController: DeleteTeamAdminController,

): Router => {
    const router = Router();

    router.post('/create', createTeamController.execute.bind(createTeamController));
    router.post('/invite-join', inviteJointTeamController.execute.bind(inviteJointTeamController));
    router.get('/get-members/:uuid', getMembersByTeamController.execute.bind(getMembersByTeamController));
   
    router.get("/all-teams", getAllTeamsController.execute.bind(getAllTeamsController));
    router.get("/in-tournaments", getTeamsInTournamentsController.execute.bind(getTeamsInTournamentsController));
    router.get("/incomplete", getIncompleteTeamsController.execute.bind(getIncompleteTeamsController));
    router.delete("/delete-team/:teamUUID", deleteTeamController.execute.bind(deleteTeamController));

    router.delete('/admin/delete-team/:teamUUID', deleteTeamAdminController.execute.bind(deleteTeamAdminController));

    
    return router;
};