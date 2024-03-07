import { Group } from '../group/group';

export interface Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date; // Representing Date as string
  placeOfBirth: string;
  groups: Group[]; // Using an array to represent the Set of GroupDTOs
}
