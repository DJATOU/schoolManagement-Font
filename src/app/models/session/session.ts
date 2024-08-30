import { Group } from "../group/group";

export interface Session {
  id: number;
  title: string;
  description?: string;
  sessionType: string;
  feedbackLink?: string;
  sessionTimeStart: Date;
  sessionTimeEnd: Date;
  groupId: number;
  roomId: number;
  sessionSeriesId?: number;
  teacherId: number;
  created_by?: string;
  updated_by?: string;
  date_creation?: Date;
  date_update?: Date;
  group?: Group;
  groupName?: string;
  roomName?: string;
  teacherName?: string;
  isFinished?: boolean;
  students: Array<{ id: number; isPresent: boolean }>;
}
