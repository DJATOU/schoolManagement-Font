import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Session } from '../models/session/session';
import { Student } from '../components/student/domain/student';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${API_BASE_URL}/api/sessions`;
  private apiUrl2 = `${API_BASE_URL}/api/student-groups`;

  constructor(private http: HttpClient) { }

  // Create a new session
  createSession(session: Session): Observable<Session> {
    console.log('Sending to backend:', session); // Log the session data being sent
    return this.http.post<Session>(this.apiUrl, session);
  }

  // Get all sessions
  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl).pipe(
      tap(sessions => console.log('Sessions fetched:', sessions)
    ));
  }
 
  getAllSessionsWithDetail(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/detail`).pipe(
      tap(sessions => console.log('Sessions fetched detail:', sessions)
    ));
  }
  
  // Get a single session by ID
  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`);
  }

  // Update a session
  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.patch<Session>(`${this.apiUrl}/${id}`, session);
  }

  getStudentsByGroupId(groupId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl2}/${groupId}/students`).pipe(
      tap(student => console.log('students fetched detail:', student))
    );
  }

  getStudentsForSession(groupId: number, sessionDate: Date): Observable<Student[]> {
    return this.http.get<Student[]>(
      `${this.apiUrl2}/${groupId}/studentsForSession?date=${sessionDate}`
    );
  }
  

  markSessionAsFinished(sessionId: number): Observable<Session> {
    return this.http.patch<Session>(`${this.apiUrl}/${sessionId}/finish`, {});
  }

  markSessionAsUnfinished(sessionId: number): Observable<Session> {
    return this.http.patch<Session>(`${this.apiUrl}/${sessionId}/unfinish`, {});
  }
  
  
  // Get sessions by series ID
  getSessionsBySeriesId(sessionSeriesId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/series/${sessionSeriesId}`);
  }
 


  getSessionsInDateRange(groupId: number, start: Date, end: Date): Observable<Session[]> {
    console.log("Entering getSessionsInDateRange");
    const params = new HttpParams()
      .set('groupId', groupId.toString())
      .set('start', start.toISOString())
      .set('end', end.toISOString());

    console.log('Params:', params.toString());

    return this.http.get<Session[]>(`${this.apiUrl}/sessions`, { params }).pipe(
      tap(sessions => {
        console.log('Sessions retrieved:', sessions); // Vérifiez ici les IDs
      }),
      catchError(error => {
        console.error('Error fetching sessions:', error);
        return throwError(error);
      })
    );
}

  

}
