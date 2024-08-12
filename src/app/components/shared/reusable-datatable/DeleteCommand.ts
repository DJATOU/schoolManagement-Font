import { Observable } from "rxjs";

export interface DeleteCommand {
    disableItems(id_list: Number[]): Observable<boolean>;
}
