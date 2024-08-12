import { BaseModel } from "../baseModel";

export interface StudentGroup extends BaseModel {
  groupId: number;
  studentId: number;
}
