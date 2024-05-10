import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Session } from '../models/session/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${API_BASE_URL}/api/sessions`;

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
  getSessionById(id: string): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`);
  }

  // Update a session
  updateSession(id: string, session: any): Observable<Session> {
    return this.http.patch<Session>(`${this.apiUrl}/${id}`, session);
  }

 
}
