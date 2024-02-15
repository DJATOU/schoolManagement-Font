export interface Tutor {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string; // Assuming ISO8601 string format for dates
    placeOfBirth: string;
    relationship: string;
    active: boolean;
    dateCreation: string; // Assuming ISO8601 string format for dates
    dateUpdate: string; // Assuming ISO8601 string format for dates
  }
  