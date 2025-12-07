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

  searchTeachersByNameStartingWith(searchTerm: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/searchByNames`, {
      params: new HttpParams().set('search', searchTerm)
    });
  }
  
  disableTeacher(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/disable/${id}`);
  }

  /**
   * PHASE 3A: Upload photo pour un enseignant
   * @param teacherId ID de l'enseignant
   * @param file Fichier photo à uploader
   * @returns Observable avec le nom du fichier uploadé
   */
  uploadTeacherPhoto(teacherId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/${teacherId}/photo`, formData, {
      responseType: 'text' as 'json' // Le backend retourne un string, pas du JSON
    });
  }

  /**
   * PHASE 3A: Récupère l'URL de la photo d'un enseignant
   * @param teacherId ID de l'enseignant
   * @returns URL de la photo
   */
  getTeacherPhotoUrl(teacherId: number): string {
    return `${this.apiUrl}/${teacherId}/photo`;
  }
}
