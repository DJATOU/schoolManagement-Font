import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { GroupType } from '../../../models/GroupType/groupType';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-type-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './group-type-form.component.html',
  styleUrls: ['./group-type-form.component.scss'],
  providers: [GroupTypeService]
})
export class GroupTypeFormComponent implements OnInit {
  groupTypeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private groupTypeService: GroupTypeService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.groupTypeForm = this.fb.group({
      groupTypeDetails: this.fb.group({
        name: ['', Validators.required],
        size: ['', [Validators.required, Validators.min(1)]]
      })
    });
  }

  flattenFormData(data: any, parentKey: string = ''): { label: string, value: any }[] {
    let result: { label: string, value: any }[] = [];
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey} - ${key}` : key;
      const value = data[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result = result.concat(this.flattenFormData(value, newKey));
      } else if (Array.isArray(value)) {
        result.push({ label: newKey, value: value.join(', ') });
      } else {
        result.push({ label: newKey, value: value });
      }
    });
    return result;
  }

  onSubmit(): void {
    if (this.groupTypeForm.valid) {
      const formData = {
        groupTypeDetails: {
          name: this.groupTypeForm.get('groupTypeDetails.name')?.value,
          size: this.groupTypeForm.get('groupTypeDetails.size')?.value
        }
      };

      const flattenedData = this.flattenFormData(formData);
      console.log('Form Data:', formData);
      console.log('Flattened Data:', flattenedData);

      const dialogRef = this.dialog.open(SummaryDialogComponent, {
        data: flattenedData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const groupType: GroupType = {
            name: formData.groupTypeDetails.name ?? '',
            size: formData.groupTypeDetails.size ? parseInt(formData.groupTypeDetails.size) : 0
          };

          this.groupTypeService.createGroupType(groupType).subscribe({
            next: (groupType) => {
              console.log('Group type created:', groupType);
              this.onClearForm();
              this.showSuccessMessage('Group type created successfully.');
            },
            error: (error) => {
              console.error('Error creating group type:', error);
              this.showErrorMessage('Error creating group type.');
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('Form is not valid');
      this.showErrorMessage('Form is not valid');
    }
  }

  onClearForm(): void {
    this.groupTypeForm.reset();
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
}
