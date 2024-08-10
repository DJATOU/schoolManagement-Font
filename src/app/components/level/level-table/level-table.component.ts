import { Component} from '@angular/core';
import { LevelService } from '../../../services/level.service';
import { Level } from '../../../models/level/level';
import { ReusableDatatableComponent } from '../../shared/reusable-datatable/reusable-datatable.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-level-table',
  standalone: true,
  imports: [ReusableDatatableComponent],
  templateUrl: './level-table.component.html',
  styleUrl: './level-table.component.scss'
})
export class LevelTableComponent {
  observable: Observable<any[]> = new Observable<any[]>();
  columns = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: Level) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Level) => `${element.name}`,
    },
    {
      columnDef: 'levelCode',
      header: 'Level code',
      cell: (element: Level) => `${element.levelCode}`,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: Level) => `${element.description}`,
    },
  ];

  constructor(levelService: LevelService) {
    this.observable = levelService.getLevels();
  }
}
