import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupType } from '../../../models/GroupType/groupType';
import { Group } from '../../../models/group/group';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { ReusableDatatableComponent } from '../../shared/reusable-datatable/reusable-datatable.component';

@Component({
  selector: 'app-group-type-table',
  standalone: true,
  imports: [ReusableDatatableComponent],
  templateUrl: './group-type-table.component.html',
  styleUrl: './group-type-table.component.scss'
})
export class GroupTypeTableComponent {

  observable: Observable<any[]> = new Observable<any[]>();
  columns = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: GroupType) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: GroupType) => `${element.name}`,
    },
    {
      columnDef: 'size',
      header: 'Size',
      cell: (element: GroupType) => `${element.size}`,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: GroupType) => `${element.description}`,
    },
  ];

  constructor(groupTypeservice: GroupTypeService) {
    this.observable = groupTypeservice.getAllGroupTypes();
  }
}
