import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Level } from '../models/level/level';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = 'http://localhost:8080/api/levels';

  constructor(private http: HttpClient) { }

  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(this.apiUrl);
  }

  createLevel(Level: Level): Observable<Level> {
    return this.http.post<Level>(this.apiUrl, Level);
  }

  updateLevel(id: number, Level: Level): Observable<Level> {
    return this.http.put<Level>(`${this.apiUrl}/${id}`, Level);
  }
}
