import { BaseModel } from '../baseModel';

export interface Room {
  base: BaseModel;
  name: string;
  capacity: number;
}
