import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Payment } from '../models/payment/payment';
import { PaymentDetail } from '../models/paymentDetail/paymentDetail';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments/process'; // Updated API endpoint

  constructor(private http: HttpClient) {}

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer les détails de paiement pour une série
  getPaymentDetailsForSeries(studentId: number, sessionSeriesId : number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/${studentId}/series/${sessionSeriesId }/payment-details`);
  }

  // Méthode pour récupérer l'historique des paiements pour une série
  getPaymentHistoryForSeries(studentId: number, sessionSeriesId : number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/${studentId}/series/${sessionSeriesId }/payment-history`);
  }

  getPaymentHistoryByStudentId(studentId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/student/${studentId}`);
  }
  
  getPaymentDetailsForSessions(studentId: number, sessionSeriesId : number): Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(`${this.apiUrl}/${studentId}/series/${sessionSeriesId }`);
  }
  

}
