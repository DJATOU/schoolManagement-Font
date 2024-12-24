export interface EditSessionData {
    id: number;
    title: string;
    sessionType: string;
    groupName: string;
    roomName: string;
    teacherName: string;
    sessionTimeStart: Date;
    sessionTimeEnd: Date;
    feedbackLink?: string;
  }
  