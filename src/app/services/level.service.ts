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

  getLevelById(id: number): Observable<Level> {
    console.log("level log id", id)
    return this.http.get<Level>(`${this.apiUrl}/id/${id}`);
  }

  createLevel(Level: Level): Observable<Level> {
    return this.http.post<Level>(this.apiUrl, Level);
  }

  updateLevel(id: number, Level: Level): Observable<Level> {
    return this.http.put<Level>(`${this.apiUrl}/${id}`, Level);
  }

  desactivateLevels(id_list: number[]): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/disable/${id_list}`);
  }
}
