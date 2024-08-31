import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Student } from '../models/student/student';
import { API_BASE_URL } from '../app.config';
import { Group } from '../models/group/group';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${API_BASE_URL}/api/students`;
  private apiUrl2 = `${API_BASE_URL}/api/student-groups`;
  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl).pipe(
      tap(student => console.log("ooooooooooooooooooo", student))
    );
  }

  getGroupsForStudent(id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/${id}/groups`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/id/${id}`).pipe(
        tap(student => console.log("Student", student))
    );
}

  createStudent(studentData: FormData): Observable<Student> {
    console.log("nnnnnnnnnnnnnnn",studentData);
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, studentData);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  searchStudents(firstName: string, lastName: string, level: number, groupId: string, establishment: string): Observable<Student[]> {
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
  
  disableStudent(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/disable/${id}`);
  }

// student.service.ts
  getStudentsByLevel(levelId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/levels/${levelId}`);
  }

  generateStudentPdf(studentId: number, lang: string = 'fr'): Observable<Blob> {
    const pdfUrl = `${API_BASE_URL}/api/pdf/student/${studentId}?lang=${lang}`;
    return this.http.get(pdfUrl, { responseType: 'blob' });
  }
  
  
}
