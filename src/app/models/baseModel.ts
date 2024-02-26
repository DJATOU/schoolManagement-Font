export interface BaseModel {
    id: number;
    dateCreation: Date; // Assuming you're using string to represent LocalDateTime
    dateUpdate: Date;
    createdBy?: string;
    updatedBy?: string;
    active: boolean;
    description?: string;
  }
  