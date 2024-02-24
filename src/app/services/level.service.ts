import { Injectable } from '@angular/core';
import { Level } from '../models/level/level';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = 'http://localhost:8080/api/levels';

  constructor(private http: HttpClient) { }

  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(this.apiUrl);
  }

  getLevel(id: number): Observable<Level> {
    return this.http.get<Level>(`${this.apiUrl}/id/${id}`);
  }

  createLevel(Level: Level): Observable<Level> {
    return this.http.post<Level>(this.apiUrl, Level);
  }

  updateLevel(id: number, Level: Level): Observable<Level> {
    return this.http.put<Level>(`${this.apiUrl}/${id}`, Level);
  }

  searchLevels(searchTerm: string): Observable<Level[]> {
    console.log('Searching for Levels with term:', searchTerm);
    return this.http.get<Level[]>(`${this.apiUrl}/search`, {
      params: { term: searchTerm }
    });
  }
}
