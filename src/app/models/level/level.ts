// src/app/models/level.model.ts

export interface Level {
    id?: number;
    name: string;
    levelCode: string;
    dateCreation?: Date; // Using string to represent LocalDateTime for simplicity
    dateUpdate?: Date; // Using string to represent LocalDateTime for simplicity
    createdBy?: string; // Optional since lombok.Value makes fields final and non-nullable
    updatedBy?: string; // Optional since lombok.Value makes fields final and non-nullable
    active?: boolean;
    description?: string;
  }
  