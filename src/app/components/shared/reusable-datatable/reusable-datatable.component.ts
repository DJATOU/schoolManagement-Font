import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';

interface ColumnDefenition {
  columnDef: string;
  header: string;
  cell: (element: any) => string;
}

@Component({
  selector: 'app-reusable-datatable',
  standalone: true,
  imports: [NgIf,MatIcon,MatButton,MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRecycleRows],
  templateUrl: './reusable-datatable.component.html',
  styleUrl: './reusable-datatable.component.scss'
})
export class ReusableDatatableComponent  implements OnInit{
  @Input() columns!: ColumnDefenition[];
  @Input() data!: any[];

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);
  router: Router;

  ngOnInit(): void {
    console.log('Received data:', this.data);
    console.log('Received columns:', this.columns);
    this.displayedColumns = ['select', ...this.columns.map(c => c.columnDef)];
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(router: Router) {
    this.router = router;
  }
  
  /** Implement create logic */
  onCreate() {
    this.router.navigate(['level/new/']);
  }

  /** Implement view logic */
  onView() {
    throw new Error('Method not implemented.');
  }
  
  /** Implement edit logic */
  onEdit() {
    throw new Error('Method not implemented.');
  }
  
  /** Implement delete logic */
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
  
  /** Implement print logic */
  onPrint() {
    window.print();
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
  checkboxLabel(row?: any): string {
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

