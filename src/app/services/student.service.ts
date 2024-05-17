import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student/student';
import { API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${API_BASE_URL}/api/students`;
  private apiUrl2 = `${API_BASE_URL}/api/student-groups`;
  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/id/${id}`);
  }

  createStudent(studentData: FormData): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, studentData);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  searchStudents(firstName: string, lastName: string, level: string, groupId: string, establishment: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/search`, {
      params: new HttpParams()
        .set('firstName', firstName)
        .set('lastName', lastName)
        .set('level', level)
        .set('groupId', groupId)
        .set('establishment', establishment)
    });
  }

  getStudentsByFirstNameAndLastName(firstName?: string, lastName?: string): Observable<Student[]> {
    let params = new HttpParams();
    if (firstName) {
      params = params.set('firstName', firstName);
    }
    if (lastName) {
      params = params.set('lastName', lastName);
    }

    return this.http.get<Student[]>(`${this.apiUrl}/searchByNames`, { params });
  }

  searchStudentsByNameStartingWith(searchTerm: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/searchByNames`, {
      params: new HttpParams().set('search', searchTerm)
    });
  }

  addGroupsToStudent(studentId: number, groupIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl2}/${studentId}/addGroups`, { groupIds });
}

}
