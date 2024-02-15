import { BaseModel } from '../baseModel';

export interface SessionSeries extends BaseModel {
  totalSessions: number;
  totalPrice: number;
  amountPaid: number;
  balanceDue: number;
  sessionsCompleted: number;
}
