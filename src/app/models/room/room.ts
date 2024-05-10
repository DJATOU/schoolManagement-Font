import { BaseModel } from '../baseModel';

export interface Room {
  id?: string;
  base: BaseModel;
  name: string;
  capacity: number;
}
