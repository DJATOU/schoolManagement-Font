import { SeriesHistoryDTO } from "../sessionSerie/SeriesHistoryDTO";

export interface GroupHistoryDTO {
    groupId: number;
    groupName: string;
    series: SeriesHistoryDTO[];
    catchUp: boolean;
  }