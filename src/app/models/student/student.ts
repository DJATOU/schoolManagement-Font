export interface Student {
    firstName: string;
    id?: number;
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
    isPresent?:boolean,
    description?: string;
}