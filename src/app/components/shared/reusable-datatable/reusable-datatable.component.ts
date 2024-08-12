import { Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { MatRecycleRows, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCommand } from './DeleteCommand';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { el } from '@fullcalendar/core/internal-common';

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
  @Input() observable!: Observable<any[]>;
  @Input() dataType!: string;
  @Input() deleteCommand!: DeleteCommand;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);
  data: any;
  datePipe: DatePipe;

  ngOnInit(): void {
    console.log('Received columns:', this.columns);
    this.displayedColumns = ['select', ...this.columns.map(c => c.columnDef)];
    
    this.observable.subscribe((data: any[]) => {
      console.log('Received data:', data);
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.data = data;
    });
  }

  constructor(private router: Router,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.datePipe = new DatePipe('en-US');
  }
  
  /** Implement create logic */
  onCreate() {
    this.router.navigate([this.dataType+'/new/']);
  }

  /** Implement view logic */
  onView() {
    this.selection.selected.forEach((selected) => {
      let informations= this.flattenFormData(selected, this.columns ,"Informations fondamentales");
      
      let otherColumn= Object.keys(selected).filter(key => !this.columns.some(column => column.columnDef === key));
      let otherInformation= this.flattenFormData(selected, otherColumn ,"Autre informations")
      
      informations.push(...otherInformation);

      this.dialog.open(SummaryDialogComponent, {
        data: informations
      });
    });
  }

  /** This function is used like an Adapter that transform simple object to summary-dialog input*/
  flattenFormData(data: any,cols: any[], parentKey: string = 'Informations'): { label: string, value: any }[] {
    let result: { label: string, value: any }[] = [];

    // Ajouter les informations fondamentales en premiers
    cols.forEach((column) => {
      const key = column.columnDef || column;
      const newKey = parentKey ? `${parentKey} - ${key}` : key;
      let value = data[key];

      if( (key=="dateCreation" || key=="dateUpdate") && value){
        value= this.convertDate(value);
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively flatten the nested object
        result = result.concat(this.flattenFormData(value, newKey));
      } else if (Array.isArray(value)) {
        // Convert array to string
        result.push({ label: newKey, value: value.join(', ') });
      } else {
        result.push({ label: newKey, value: value });
      }
    });
    return result;
  }

  convertDate(date: Date): String {
    const dateParts = date.toString().split(',').map(part => parseInt(part, 10));
    const newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4]);
    return this.datePipe.transform(newDate, 'dd MMMM yyyy') || '';
  }
  
  /** Implement edit logic */
  onEdit() {
    this.router.navigate([this.dataType+'/edit/'+this.selection.selected[0].id]);
  }
  
  /** Implement delete logic */
  onDisable() {
    if( this.selection.selected.length != 0){
      //Faire la confirmation avant la suppression
      this.dialog.open(ConfirmationDialogComponent, {
        data:{
          title: 'Dialogue de confirmation',
          message: 'Voulez-vous vraiment supprimer ces éléments?',
          confirmText: 'Yes, delete',
          cancelText: 'No, cancel',
          confirmColor: 'warn'
        } 
      }).afterClosed().subscribe((result: boolean) => {
        if (result) {
          let id_list = this.selection.selected.map((selected) => Number(selected.id));
          this.deleteCommand.disableItems(id_list).subscribe({
            next: (response) => {
              //Mise à jour du tableau
              this.data = this.data.filter((data: any) => !this.selection.selected.includes(data));
              this.dataSource = new MatTableDataSource<any>(this.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.selection.clear();

              console.log('Elements disabled successfully:', response);
              this.showSuccessMessage('Elements disabled successfully.'); // Affichez le message de succès
            },
            error: (error) => {
              console.error('Error disabling elements:', error);
              this.showErrorMessage('Error disabling elements.'); // Affichez le message d'erreur
            }
          });
        }
        else{
          console.log('Operation canceled.');
        }
      });
    }
  }
  
  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-success']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-error']
    });
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

