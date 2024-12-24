
export interface PaymentDetail  {
  sessionId: number; // ID de la session
  amountPaid: number; // Montant payé pour la session
  sessionName: string; // Titre de la session
  paymentMethod: string; // Méthode de paiement utilisée
  description: string; // Description du paiement
  paymentDate: Date; // Date du paiement
  sessionPrice: number; // Prix de la session (à ajouter pour faciliter le calcul du statut)
  status?: string; 
}
