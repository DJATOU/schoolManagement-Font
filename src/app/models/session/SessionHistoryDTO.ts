export interface SessionHistoryDTO {
    catchUpSession: boolean;
    sessionId: number;
    sessionName: string;
    sessionDate: string; // ou Date si vous gérez le parsing
    attendanceStatus: string;
    isJustified: boolean;
    description: string;
    paymentStatus: string;
    amountPaid: number;
    paymentDate: string;
  }