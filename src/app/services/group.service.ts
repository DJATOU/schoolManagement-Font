import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Group } from '../models/group/group';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${API_BASE_URL}/api/groups`;

  constructor(private http: HttpClient) { }

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
  // Create a new group
  createGroup(groupData: FormData): Observable<Group> {
    console.log('Group created:', groupData);
    return this.http.post<Group>(`${this.apiUrl}/createGroupe`, groupData);
  }

  // Update an existing group
  updateGroup(id: number, groupData: FormData): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/update/${id}`, groupData);
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


}
