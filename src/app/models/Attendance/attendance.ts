export interface Attendance {
    id: number;
    studentId: number;
    sessionId: number;
    isPresent: boolean;
    isJustified: boolean;
    sessionSeriesId?: number;
    groupId: number;
    dateCreation: Date;
    dateUpdate: Date;
    createdBy: string;
    updatedBy: string;
    active: boolean;
    description?: string;
    isCatchUp?: boolean; 
  }
  