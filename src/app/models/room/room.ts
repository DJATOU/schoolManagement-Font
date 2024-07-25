import { BaseModel } from '../baseModel';

export interface Room extends BaseModel {
  id?: number;
  name: string;
  capacity: number;
}
