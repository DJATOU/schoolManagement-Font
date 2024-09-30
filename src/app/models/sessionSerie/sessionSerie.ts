import { BaseModel } from '../baseModel';
export interface SessionSeries extends BaseModel {
  name: string;
  serieTimeStart?: string; 
  serieTimeEnd?: string;
  groupId: number;
  totalSessions: number;
  sessionsCompleted:number;
  numberOfSessionsCreated: number;
}
