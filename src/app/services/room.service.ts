import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../models/room/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/api/rooms';

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  createRoom(Room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, Room);
  }

  updateRoom(id: number, Room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, Room);
  }
}
