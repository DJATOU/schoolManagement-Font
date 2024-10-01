import { GroupHistoryDTO } from "../group/GroupHistoryDTO";

export interface StudentFullHistoryDTO {
    studentId: number;
    studentName: string;
    groups: GroupHistoryDTO[];
  }