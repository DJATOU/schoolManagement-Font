import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { SessionSeries } from '../models/sessionSerie/sessionSerie';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
    private apiUrl = `${API_BASE_URL}/api/series`;

    constructor(private http: HttpClient) {}
  
    getSeriesByGroupId(groupId: number): Observable<SessionSeries[]> {
      return this.http.get<SessionSeries[]>(`${this.apiUrl}/group/${groupId}`);
    }
  
    createSeries(series: Partial<SessionSeries>): Observable<SessionSeries> {
      return this.http.post<SessionSeries>(this.apiUrl, series);
    }

    
  getSessionSeriesByGroupId(groupId: number): Observable<SessionSeries[]> {
    return this.http.get<SessionSeries[]>(`${this.apiUrl}/group/${groupId}`);
  }
}
