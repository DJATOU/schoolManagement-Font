import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Attendance } from '../models/Attendance/attendance';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = `${API_BASE_URL}/api/attendances`;  // Adjust based on your API URL structure

    constructor(private http: HttpClient) {}
    
    getAttendanceBySessionId(sessionId: number): Observable<Attendance[]> {
      return this.http.get<Attendance[]>(`${this.apiUrl}/session/${sessionId}`);
    }
   
    submitAttendance(attendances: Attendance[]): Observable<Attendance[]> {
      return this.http.post<Attendance[]>(`${this.apiUrl}/bulk`, attendances).pipe(
        catchError(error => {
          if (error.status === 409) {
            return throwError(() => new Error('Attendance already exists for one or more students in the same session.'));
          }
          return throwError(() => error);
        })
      );
    }
}
