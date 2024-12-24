import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Attendance } from '../models/Attendance/attendance';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = `${API_BASE_URL}/api/attendances`;  // Adjust based on your API URL structure

    constructor(private http: HttpClient) {}
    
    getAttendanceBySessionId(sessionId: number): Observable<Attendance[]> {
      console.log(`Fetching attendances for session ID: ${sessionId}`);
    
      return this.http.get<Attendance[]>(`${this.apiUrl}/session/${sessionId}`).pipe(
        tap({
          next: (attendances: Attendance[]) => {
            console.log('Attendance data retrieved successfully:', attendances);
          },
          error: (error: Error) => {
            console.error('Failed to retrieve attendance data:', error);
          }
        })
      );
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

    deleteAttendanceBySessionId(sessionId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/session/${sessionId}`);
    }

    deactivateAttendanceBySessionId(sessionId: number): Observable<void> {
      return this.http.patch<void>(`${this.apiUrl}/deactivate/${sessionId}`, { active: false });
  }


  getAttendanceByStudentAndSeries(studentId: number, sessionSeriesId : number): Observable<Attendance[]> {
    console.log(`Fetching attendances for student ID: ${studentId} and series ID: ${sessionSeriesId }`);

    return this.http.get<Attendance[]>(`${this.apiUrl}/student/${studentId}/series/${sessionSeriesId }`).pipe(
      tap({
        next: (attendances: Attendance[]) => {
          console.log('Attendance data for student and series retrieved successfully:', attendances);
        },
        error: (error: Error) => {
          console.error('Failed to retrieve attendance data for student and series:', error);
        }
      }),
      catchError(() => {
        return throwError(() => new Error('Failed to retrieve attendance data.'));
      })
    );
  }
  
}
