import { Router } from "express";
import { CreateTournamentController } from "../controllers/createTournamentController";
import { GetTournamentsController } from "../controllers/getTournamentsController";
import { CancelTournamentController } from "../controllers/cancelTournamentController";
import { RegisterTeamTournamentController } from "../controllers/registerTeamTournamentController";
import { GetDetailsTournamentController } from "../controllers/getDetailsTournamentController";
import { GenerateMatchesController } from "../controllers/generatedMatchesController";
import { RegisterMatchResultsController } from "../controllers/registerMatchController";
import { AdvanceRoundController } from "../controllers/advancedRoundController";
import { FinalizeTournamentController } from "../controllers/finalizeTournamentController";

export const tournamentRouter = (
    createTournamentController: CreateTournamentController,
    getTournamentsController: GetTournamentsController,
    cancelTournamentController: CancelTournamentController,
    registerTeamTournamentController: RegisterTeamTournamentController,
    getDetailsTournamentController: GetDetailsTournamentController,
    generateMatchesController: GenerateMatchesController,
    registerMatchResultsController: RegisterMatchResultsController,
    advanceRoundController: AdvanceRoundController,
    finalizeTournamentController: FinalizeTournamentController
): Router => {
    const router = Router();

    router.post('/create', createTournamentController.execute.bind(createTournamentController));
    router.get('/', getTournamentsController.execute.bind(getTournamentsController));
    router.delete('/:uuid', cancelTournamentController.execute.bind(cancelTournamentController));
    router.patch('/:uuid/teams/:teamUUID', registerTeamTournamentController.execute.bind(registerTeamTournamentController));
    router.get('/details/:uuid', getDetailsTournamentController.execute.bind(getDetailsTournamentController));
    router.post('/:uuid/matches', generateMatchesController.execute.bind(generateMatchesController));
    router.post('/:uuid/results', registerMatchResultsController.execute.bind(registerMatchResultsController));
    router.post('/:uuid/advance', advanceRoundController.execute.bind(advanceRoundController));
    router.post('/:uuid/finalize', finalizeTournamentController.execute.bind(finalizeTournamentController));

    return router;
}