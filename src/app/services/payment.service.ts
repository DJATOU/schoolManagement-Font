import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment/payment';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = 'http://localhost:8080/api/levels';

  constructor(private http: HttpClient) { }


  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }
}
