// src/app/models/payment.model.ts

export interface Payment {
    studentId: number;           // Non-nullable field
    sessionId: number;           // Non-nullable field
    sessionSeriesId: number;     // Non-nullable field
    amountPaid: number;          // Non-nullable field, should be validated to be >= 0
    paymentForMonth: Date;       // Date can be null, so it's implicitly optional
    status?: string;             // Optional field
    paymentMethod?: string;      // Optional field
    paymentDescription?: string; // Optional field
    groupId: number;             // Non-nullable field
  }
  