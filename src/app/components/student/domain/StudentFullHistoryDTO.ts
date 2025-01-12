import { GroupHistoryDTO } from "../../../models/group/GroupHistoryDTO";

export interface StudentFullHistoryDTO {
    studentId: number;
    studentName: string;
    groups: GroupHistoryDTO[];
    catchUp: boolean;
  }