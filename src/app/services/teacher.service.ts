import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Teacher } from '../models/teacher/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${API_BASE_URL}/api/teachers`;

  constructor(private http: HttpClient) { }

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  getTeacher(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/id/${id}`);
  }

  createTeacher(teacherData: FormData): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.apiUrl}/createTeacher`, teacherData);
  }

  updateTeacher(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher);
  }


  searchTeachersByName(firstName: string, lastName: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/search`, {
      params: new HttpParams()
        .set('firstName', firstName)
        .set('lastName', lastName)
    });
  }


}
  

