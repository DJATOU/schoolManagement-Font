import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Student } from '../components/student/domain/student';
import { API_BASE_URL } from '../app.config';
import { Group } from '../models/group/group';
import { StudentFullHistoryDTO } from '../components/student/domain/StudentFullHistoryDTO';

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  private apiUrl = `${API_BASE_URL}/api/students`;
  private apiUrl2 = `${API_BASE_URL}/api/student-groups`;

  constructor(private http: HttpClient) { }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/id/${id}`);
  }

  getGroupsForStudent(id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl2}/${id}/groups`);
  }

  addGroupsToStudent(studentId: number, groupIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl2}/${studentId}/addGroups`, { groupIds });
  }

  updateStudent(student: Student): Observable<Student> {
    if (!student.id) {
      throw new Error('Student ID is required for update.');
    }
    return this.http.put<Student>(`${this.apiUrl}/${student.id}`, student);
  }

  disableStudent(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/disable/${id}`);
  }

  generateStudentPdf(studentId: number, lang: string = 'fr'): Observable<Blob> {
    const pdfUrl = `${API_BASE_URL}/api/pdf/student/${studentId}?lang=${lang}`;
    return this.http.get(pdfUrl, { responseType: 'blob' });
  }

  getStudentFullHistory(studentId: number): Observable<StudentFullHistoryDTO> {
    return this.http.get<StudentFullHistoryDTO>(`${this.apiUrl}/${studentId}/full-history`);
  }
}