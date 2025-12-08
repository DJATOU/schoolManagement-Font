import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Student } from '../domain/student';
import { API_BASE_URL } from '../../../app.config';
import { Group } from '../../../models/group/group';
import { StudentFullHistoryDTO } from '../domain/StudentFullHistoryDTO';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${API_BASE_URL}/api/students`;
  private apiUrl2 = `${API_BASE_URL}/api/student-groups`;
  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl).pipe(
      tap(
        students => {
          console.log("Students fetched successfully getStudents:", students);
        },
        error => {
          console.error("Error fetching students getStudents:", error);
        }
      )
    );
  }
  
  getGroupsForStudent(id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl2}/${id}/groups`).pipe(
      tap(
        groups => {
          console.log("Groups for student fetched successfully getGroupsForStudent:", groups);
        },
        error => {
          console.error("Error fetching groups for student getGroupsForStudent:", error);
        }
      )
    );
  }
  
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/id/${id}`).pipe(
      tap(
        student => {
          console.log("Student data fetched successfully getStudentById:", student);
          console.log("Student photo URL getStudentById:", student.photo); // Log the photo URL specifically
        },
        error => {
          console.error("Error fetching student by ID getStudentById:", error);
        }
      )
    );
  }
  

  createStudent(studentData: FormData): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, studentData);
  }

  updateStudent1(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  updateStudent(student: Student): Observable<Student> {
    if (!student.id) {
      throw new Error('Student ID is required for update.');
    }
    return this.http.put<Student>(`${this.apiUrl}/${student.id}`, student);
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

  removeStudentFromGroup(groupId: number | undefined, studentId: number | undefined): Observable<any> {
    if (groupId === undefined || studentId === undefined) {
      throw new Error('Group ID and Student ID must be defined');
    }
    return this.http.delete(`${this.apiUrl2}/${groupId}/students/${studentId}`);
  }
  


  getStudentFullHistory(studentId: number): Observable<StudentFullHistoryDTO> {
    return this.http.get<StudentFullHistoryDTO>(`${this.apiUrl}/${studentId}/full-history`);
  }

  /**
   * PHASE 3A: Upload photo pour un étudiant
   * @param studentId ID de l'étudiant
   * @param file Fichier photo à uploader
   * @returns Observable avec le nom du fichier uploadé
   */
  uploadStudentPhoto(studentId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/${studentId}/photo`, formData, {
      responseType: 'text' as 'json' // Le backend retourne un string, pas du JSON
    });
  }

  /**
   * PHASE 3A: Récupère l'URL de la photo d'un étudiant
   * @param studentId ID de l'étudiant
   * @returns URL de la photo
   */
  getStudentPhotoUrl(studentId: number): string {
    return `${this.apiUrl}/${studentId}/photo`;
  }
}
