import { Pricing } from "../pricing/pricing";
export interface Group {
  id?: number;
  name: string;
  groupTypeId: number;
  groupTypeName?: string; // Add this field for the group type name
  levelId: number;
  levelName?: string;     // Add this field for the level name
  subjectId: number;
  subjectName?: string;   // Add this field for the subject name
  sessionNumberPerSerie: number;
  priceId: number;
  priceAmount?: number;   // Add this field for the price amount
  dateUpdate?: Date;
  active?: boolean;
  description?: string;
  teacherId: number;
  teacherName?: string;   // Add this field for the teacher's name
  photo?: string;         // Photo filename
  studentIds?: Set<number>;
  pricing?: Pricing;
  catchUp?: boolean;
}

   
  
