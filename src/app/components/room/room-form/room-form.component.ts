import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { Room } from '../../../models/room/room';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatSelectModule,
    HttpClientModule,
    MatNativeDateModule,
    RouterModule,
    MatStepperModule
  ],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss'
})
export class RoomFormComponent {
  roomForm = this.fb.group({
    name: ['', Validators.required],
    capacity: ['', [Validators.required, Validators.min(0)]],
    description: ['']
  });

  constructor(private fb: FormBuilder,private roomService: RoomService) { }

  

  onSubmit(): void {
    if (this.roomForm.valid) {
      const formValue = this.roomForm.value;
  
      const room: Room = {
        base: {
          description: formValue.description ?? ''
        },
        name: formValue.name ?? '',
        capacity: formValue.capacity ? parseInt(formValue.capacity) : 0
      };
      console.log(room);
      this.roomService.createRoom(room).subscribe({
        next: (room) => {
          console.log('room created:', room);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating room:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.roomForm.reset();
  }
}
