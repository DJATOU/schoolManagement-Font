export interface Student {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    placeOfBirth: string;
    photo: number[];
    level: string;
    groupIds?: number[];  // optional
    tutorId?: number;  // optional
    establishment: string;
    averageScore?: number;  // optional
}