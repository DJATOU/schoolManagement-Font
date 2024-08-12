import { Observable } from "rxjs";

export interface DeleteCommand {
    desactivate(id_list: Number[]): Observable<boolean>;
}
