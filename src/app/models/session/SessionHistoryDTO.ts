export interface SessionHistoryDTO {
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