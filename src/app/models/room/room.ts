import { BaseModel } from '../baseModel';

export interface Room {
  id?: number;
  base: BaseModel;
  name: string;
  capacity: number;
}
