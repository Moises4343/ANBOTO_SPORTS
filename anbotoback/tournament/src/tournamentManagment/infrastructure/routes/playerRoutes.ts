import { Router } from "express";
import { CreatePlayerController } from "../controllers/createPlayerController";
import { ResendEmailCodeController } from "../controllers/resendEmailCodeController";
import { ValidateCodeController } from "../controllers/validateCodeController";
import { LoginPlayerController } from "../controllers/loginPlayerController";
import { GetPlayersController } from "../controllers/getPlayersController";
import { AcceptInvitationController } from "../controllers/acceptInvitationController";
import { DeletePlayerTeamController } from "../controllers/deletePlayerTeamController";

export const playerRouter = (
        createPlayerController: CreatePlayerController, 
        resendEmailCodeController: ResendEmailCodeController,
        validateCodeController: ValidateCodeController,
        loginPlayerController: LoginPlayerController,
        getPlayersController: GetPlayersController,
        acceptInvitationController: AcceptInvitationController,
        leaveTeamController: DeletePlayerTeamController
    ): Router => {
        const router = Router();

        router.post('/create', createPlayerController.execute.bind(createPlayerController));
        router.post('/resend-email-code', resendEmailCodeController.execute.bind(resendEmailCodeController));
        router.post('/validate-code', validateCodeController.execute.bind(validateCodeController));
        router.post('/login', loginPlayerController.execute.bind(loginPlayerController));
        router.get('/:search', getPlayersController.execute.bind(getPlayersController));
        router.post('/accept-invitation', acceptInvitationController.execute.bind(acceptInvitationController));
        router.delete('/leave/:teamUUID', leaveTeamController.execute.bind(leaveTeamController))

        return router;
};