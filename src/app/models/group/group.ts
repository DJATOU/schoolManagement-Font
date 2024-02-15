// src/app/models/group.model.ts

export interface Group {
    id: number;
    name: string;
    groupTypeId: number;
    levelId: number;
    subjectId: number;
    sessionNumberPerSerie: number;
    priceId: number;
    dateCreation: Date;
    dateUpdate: Date;
    active: boolean;
    description?: string;
    teacherId: number;
    studentIds: Set<number>;
  }
  