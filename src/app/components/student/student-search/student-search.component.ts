import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentCardComponent } from '../student-card/student-card.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student/student';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [MatToolbarModule,StudentCardComponent,StudentListComponent,CommonModule],
  templateUrl: './student-search.component.html',
  styleUrl: './student-search.component.scss'
})
export class StudentSearchComponent {
  viewMode = 'card'; // 'card' ou 'list'
  students: Student[] = [
    {
      firstName: 'Student Name 1',
      lastName: 'Last Name 1',
      email: 'email1@example.com',
      phoneNumber: '123-456-7890',
      dateOfBirth: new Date(2000, 0, 1),
      placeOfBirth: 'Place 1',
      photo: 'path-to-avatar-1',
      level: 'Level 1',
      establishment: 'Establishment 1'
    },
    {
      firstName: 'Student Name 2',
      lastName: 'Last Name 2',
      email: 'email2@example.com',
      phoneNumber: '123-456-7890',
      dateOfBirth: new Date(2000, 0, 1),
      placeOfBirth: 'Place 2',
      photo: 'path-to-avatar-2',
      level: 'Level 2',
      establishment: 'Establishment 2'
    },
    // ...more students
  ];
  changeViewMode(mode: string) {
    this.viewMode = mode;
  }
}
