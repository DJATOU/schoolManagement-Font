import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment/payment';
import { PaymentDetail } from '../models/paymentDetail/paymentDetail';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments/process'; // Updated API endpoint

  constructor(private http: HttpClient) {}

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  // Méthode pour récupérer les détails de paiement pour une série
  getPaymentDetailsForSeries(studentId: number, seriesId: number): Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(`${this.apiUrl}/${studentId}/series/${seriesId}/payment-details`);
  }

  // Méthode pour récupérer l'historique des paiements pour une série
  getPaymentHistoryForSeries(studentId: number, seriesId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/${studentId}/series/${seriesId}/payment-history`);
  }

}
