
export interface PaymentDetail  {
  sessionId: number; // ID de la session
  amountPaid: number; // Montant payé pour la session
  sessionTitle: string; // Titre de la session
  paymentMethod: string; // Méthode de paiement utilisée
  description: string; // Description du paiement
}
