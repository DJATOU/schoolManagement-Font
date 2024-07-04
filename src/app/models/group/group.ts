export interface Group {
    id?: number;
    name: string;
    groupTypeId: number;
    levelId: number;
    subjectId: number;
    sessionNumberPerSerie: number;
    priceId: number;
    dateUpdate?: Date;
    active?: boolean;
    description?: string;
    teacherId: number;
    studentIds?: Set<number>;
  }
  
