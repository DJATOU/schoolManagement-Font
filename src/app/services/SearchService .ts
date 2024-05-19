import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');

  setSearch(query: string) {
    console.log(query+"ddddddddddddddddddddddddddddddddddddd");
    this.searchSubject.next(query);
  }

  getSearch(): Observable<string> {
    return this.searchSubject.asObservable();
  }
}
