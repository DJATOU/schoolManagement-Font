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

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/id/${id}`);
  }

  createStudent(studentData: FormData): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, studentData);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  searchStudents(firstName: string, lastName: string, level: string, groupId: string, establishment: string): Observable<Student[]> {
    console.log('Searching for students with firstName:', firstName, 'and lastName:', lastName);
    return this.http.get<Student[]>(`${this.apiUrl}/search`, {
      params: new HttpParams()
        .set('firstName', firstName)
        .set('lastName', lastName)
        .set('level', level)
        .set('groupId', groupId)
        .set('establishment', establishment)
    });
  }

  // Dans StudentService
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
  
searchStudentsByNameStartingWith(searchTerm: string) {
  return this.http.get<Student[]>(`${this.apiUrl}/searchByNames`, { params: { search: searchTerm } });
}


}