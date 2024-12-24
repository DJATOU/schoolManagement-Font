import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pricing } from '../models/pricing/pricing';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl = 'http://localhost:8080/api/pricings';

  constructor(private http: HttpClient) { }

  getPricings(): Observable<Pricing[]> {
    return this.http.get<Pricing[]>(this.apiUrl);
  }

  createPricing(pricing: Pricing): Observable<Pricing> {
    return this.http.post<Pricing>(this.apiUrl, pricing);
  }

  updatePricing(id: number, pricing: Pricing): Observable<Pricing> {
    return this.http.put<Pricing>(`${this.apiUrl}/${id}`, pricing);
  }
  
  disablePricings(id_list: Number[]): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/disable/${id_list}`);
  }

  getPricingById(id: number): Observable<Pricing> {
    return this.http.get<Pricing>(`${this.apiUrl}/${id}`);
  }
}
