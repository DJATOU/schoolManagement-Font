import { Component} from '@angular/core';
import { LevelService } from '../../../services/level.service';
import { Level } from '../../../models/level/level';
import { ReusableDatatableComponent } from '../../shared/reusable-datatable/reusable-datatable.component';

@Component({
  selector: 'app-level-table',
  standalone: true,
  imports: [ReusableDatatableComponent],
  templateUrl: './level-table.component.html',
  styleUrl: './level-table.component.scss'
})
export class LevelTableComponent {

  levels: Level[] = [];
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
    levelService.getLevels().subscribe((levels: Level[]) => {
      this.levels = levels;
    });
  }
}
