import { Component, ViewChild } from '@angular/core';
import { LevelService } from '../../../services/level.service';
import { Level } from '../../../models/level/level';
import { MatRecycleRows, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-level-table',
  standalone: true,
  imports: [NgIf,MatIcon,MatButton,MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRecycleRows],
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
  dataSource: any;
  displayedColumns: string[] = ['select', ...this.columns.map(c => c.columnDef)];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  selection = new SelectionModel<Level>(true, []);
  router: Router;

  constructor(levelService: LevelService, router: Router) {
    levelService.getLevels().subscribe((levels: Level[]) => {
      this.levels = levels;
      this.dataSource= new MatTableDataSource<Level>(this.levels);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.router = router;
  }
  
  onCreate() {
    this.router.navigate(['level/new/']);
  }

  onView() {
    throw new Error('Method not implemented.');
  }
  
  onEdit() {
    throw new Error('Method not implemented.');
  }
  
  onDelete() {
    /*LevelService.deleteLevels(this.selection.selected).subscribe(() => {
      this.levels = this.levels.filter((level: Level) => !this.selection.selected.includes(level));
      this.dataSource = new MatTableDataSource<Level>(this.levels);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection.clear();
    });*/
    throw new Error('Method not implemented.');
  }
  
  onPrint() {
    window.print();
    console.log('Print');
    //throw new Error('Method not implemented.');
  }
  /**For the filter option. */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  /** This part is for selection */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length || 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Level): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id! + 1}`;
  }

  /** True if one item is selected*/
  isOneItemSelected() {
    return this.selection.selected.length === 1;
  }
}
