import { Group } from '../group/group';

export interface Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date | string;  // Consider using Date type or providing a utility to convert to Date when needed
  placeOfBirth: string;
  address?: string;            // Optional based on your usage
  photo?: string;              // Optional
  communicationPreference?: string; // Optional
  specialization?: string;     // Optional
  qualifications?: string;     // Optional
  yearsOfExperience?: number;  // Optional, could be null if not set
  groups: Group[];             // Array to handle multiple groups, matching the backend "Set"
}
