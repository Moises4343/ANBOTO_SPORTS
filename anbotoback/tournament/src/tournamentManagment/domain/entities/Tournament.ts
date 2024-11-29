import { v4 as uuidv4 } from 'uuid';

export class Tournament {
  uuid: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  state: 'Proceso' | 'Finalizado' | 'Cancelado';
  teams: string[]; 
  
  constructor(
    name: string,
    type: string,
    startDate: Date,
    endDate: Date,
    state: 'Proceso' | 'Finalizado' | 'Cancelado',
    teams: string[] = []
  ) {
    this.uuid = uuidv4();  
    this.name = name;
    this.type = type;
    this.startDate = startDate;
    this.endDate = endDate;
    this.state = state;
    this.teams = teams;
  }

  addTeam(teamUUID: string): void {
    if (!this.teams.includes(teamUUID)) {
      this.teams.push(teamUUID);
    }
  }

  changeState(newState: 'Proceso' | 'Finalizado' | 'Cancelado'): void {
    this.state = newState;
  }

  isInProgress(): boolean {
    return this.state === 'Proceso';
  }

  getTournamentInfo(): string {
    return `Torneo: ${this.name}, Estado: ${this.state}, Equipos: ${this.teams.length}`;
  }
}
