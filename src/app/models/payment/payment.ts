export interface Payment {
  studentId: number;
  sessionId: number;
  sessionSeriesId: number;
  amountPaid: number;
  paymentForMonth: Date;
  status?: string;
  paymentMethod?: string;
  paymentDescription?: string;
  groupId: number;
  totalSeriesCost?: number; // Propriété ajoutée pour le coût total de la série
  totalPaidForSeries?: number; // Propriété ajoutée pour le total payé
  amountOwed?: number; // Propriété ajoutée pour le montant restant dû
  seriesPrice?: number;
}
