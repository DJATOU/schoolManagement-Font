export interface Attendance {
    id: number;
    studentId: number;
    sessionId: number;
    isPresent: boolean;
    sessionSeriesId: number;
    groupId: number;
    dateCreation: Date;
    dateUpdate: Date;
    createdBy: string;
    updatedBy: string;
    active: boolean;
    description?: string;
  }
  