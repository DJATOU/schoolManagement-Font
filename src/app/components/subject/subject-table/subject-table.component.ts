import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from '../../../models/subject/subject';
import { SubjectService } from '../../../services/subject.service';
import { ReusableDatatableComponent } from '../../shared/reusable-datatable/reusable-datatable.component';
import { DeleteCommand } from '../../shared/reusable-datatable/DeleteCommand';

@Component({
  selector: 'app-subject-table',
  standalone: true,
  imports: [ReusableDatatableComponent],
  templateUrl: './subject-table.component.html',
  styleUrl: './subject-table.component.scss'
})
export class SubjectTableComponent implements DeleteCommand {
  observable: Observable<any[]> = new Observable<any[]>();
  columns = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: Subject) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Subject) => `${element.name}`,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: Subject) => `${element.description}`,
    },
  ];

  constructor(private subjectService: SubjectService) {
    this.observable = subjectService.getSubjects();
  }

  disableItems(id_list: Number[]): Observable<boolean> {
    return this.subjectService.disableSubjects(id_list);
  }
}
