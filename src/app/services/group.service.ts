import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Group } from '../models/group/group';
import { Student } from '../components/student/domain/student';
import { SessionSeries } from '../models/sessionSerie/sessionSerie';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl = `${API_BASE_URL}/api/groups`;
  private apiUrl2 = `${API_BASE_URL}/api/student-groups`;
  constructor(private http: HttpClient) { }
 
  
  getGroupDetailsById(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/details/${groupId}`);
  }
  

  // Fetch all groups
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  // Fetch a single group by ID
  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/id/${id}`);
  }

  getGroupById(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${groupId}`);
  }

  getGroupsOfStudent(studentId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/${studentId}/groups`);
  }
  
  // Create a new group
  createGroup(groupData: FormData): Observable<Group> {
    console.log('Group created:', groupData);
    return this.http.post<Group>(`${this.apiUrl}/createGroupe`, groupData);
  }

 
  updateGroup(group: Group): Observable<Group> {
    if (!group.id) {
      throw new Error('Group ID is required for update.');
    }
    return this.http.put<Group>(`${this.apiUrl}/${group.id}`, group);
  }

  updateGroupPartial(groupId: number, partialGroup: Partial<Group>): Observable<Group> {
    return this.http.patch<Group>(`${this.apiUrl}/${groupId}`, partialGroup);
  }
  
  

  // Search groups by a specific criteria, e.g., name
  searchGroupsByName(name: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/search`, {
      params: new HttpParams().set('name', name)
    });
  }

  searchGroupsByNameStartingWith(searchTerm: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/searchByNames`, {
      params: new HttpParams().set('search', searchTerm)
    });
  }


    // Fetch a group by ID and return its levelId
  getLevelIdByGroupId(groupId: number): Observable<number | undefined> {
      return this.http.get<Group>(`${this.apiUrl}/${groupId}`).pipe(
        map(group => group.levelId)  // Map the group to its levelId
      );
  }

  countStudentsInGroup(groupId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${groupId}/student-count`);
  }

  getStudentsByGroupId(groupId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/${groupId}/students`);
  }

  getSeriesByGroupId(groupId: number): Observable<SessionSeries[]> {
    return this.http.get<SessionSeries[]>(`${this.apiUrl}/${groupId}/series`);
  }

  addStudentToGroup(groupId: number, studentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl2}/${studentId}/addStudents`, { studentId });
  }
  
  getGroupsForPayment(studentId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/${studentId}/groups-for-payment`);
  }

  /**
   * PHASE 3A: Upload photo pour un groupe
   * @param groupId ID du groupe
   * @param file Fichier photo à uploader
   * @returns Observable avec le nom du fichier uploadé
   */
  uploadGroupPhoto(groupId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/${groupId}/photo`, formData, {
      responseType: 'text' as 'json' // Le backend retourne un string, pas du JSON
    });
  }

  /**
   * PHASE 3A: Récupère l'URL de la photo d'un groupe
   * @param groupId ID du groupe
   * @returns URL de la photo
   */
  getGroupPhotoUrl(groupId: number): string {
    return `${this.apiUrl}/${groupId}/photo`;
  }


}
