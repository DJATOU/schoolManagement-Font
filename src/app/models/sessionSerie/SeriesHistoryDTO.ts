import { SessionHistoryDTO } from "../session/SessionHistoryDTO";

export interface SeriesHistoryDTO {
    seriesId: number;
    seriesName: string;
    sessions: SessionHistoryDTO[];
    paymentStatus: string;
    totalAmountPaid: number;
    totalCost: number;

  }