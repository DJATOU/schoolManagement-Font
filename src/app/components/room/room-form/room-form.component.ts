import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from '../../../models/room/room';
import { RoomService } from '../../../services/room.service';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,
    RouterModule,
    MatTabsModule
  ],
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  roomForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomDetails: this.fb.group({
        name: ['', Validators.required],
        capacity: ['', [Validators.required, Validators.min(0)]],
        description: ['']
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
    if (this.roomForm.valid) {
      const formData = {
        roomDetails: {
          name: this.roomForm.get('roomDetails.name')?.value,
          capacity: this.roomForm.get('roomDetails.capacity')?.value,
          description: this.roomForm.get('roomDetails.description')?.value
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
          const room: Room = {
            description: formData.roomDetails.description ?? '',
            name: formData.roomDetails.name ?? '',
            capacity: formData.roomDetails.capacity ? parseInt(formData.roomDetails.capacity) : 0
          };
          
          this.roomService.createRoom(room).subscribe({
            next: (room) => {
              console.log('Room created:', room);
              this.onClearForm();
              this.showSuccessMessage('Room created successfully.');
            },
            error: (error) => {
              console.error('Error creating room:', error);
              this.showErrorMessage('Error creating room.');
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('Form is not valid');
      this.showErrorMessage('Form is not valid.');
    }
  }

  onClearForm(): void {
    this.roomForm.reset();
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
