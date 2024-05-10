import { Group } from "../group/group";

export interface Session {
    id: string;
    title: string;
    description?: string;  // Optional field
    sessionType: string;
    feedbackLink?: string;  // Optional field
    sessionTimeStart: Date;
    sessionTimeEnd: Date;
    group_id: string;
    room_id: string;
    session_series_id?: string;
    teacher_id: string;
    created_by?: string;
    updated_by?: string;
    date_creation?: Date;  // Optional field
    date_update?: Date;    // Optional field
    group?:Group
    groupName?: string;   // Human-readable group name
    roomName?: string;   // Human-readable room name
    teacherName?: string; // Human-readable teacher name
  }
  