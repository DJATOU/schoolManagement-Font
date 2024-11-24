export interface Student {
    firstName: string;
    id?: number;
    lastName: string;
    gender: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    placeOfBirth: string;
    photo: string;
    level: number;
    levelId: number;
    levelName?: string;
    groupIds?: number[];
    tutorId?: number;
    establishment: string;
    averageScore?: number;
    isPresent?: boolean;
    isJustified?: boolean;
    description?: string;
    isCatchUp ?: boolean;
  }
  