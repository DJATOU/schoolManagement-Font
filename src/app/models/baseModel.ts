export interface BaseModel {
    id: number;
    dateCreation: string; // Assuming you're using string to represent LocalDateTime
    dateUpdate: string;
    createdBy?: string;
    updatedBy?: string;
    active: boolean;
    description?: string;
  }
  