import { Component, Input } from '@angular/core';
import { Student } from '../../../../models/student/student';
import { MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list-item',
  standalone: true,
  imports: [MatListItem, MatCard, MatCardContent],
  templateUrl: './student-list-item.component.html',
  styleUrl: './student-list-item.component.scss'
})
export class StudentListItemComponent {
  @Input() student!: Student;  // Accept a single student object

  constructor(private router: Router) {}

  navigateToStudent(student: Student) {
    this.router.navigate(['/student', student.id]); // Assuming /student/:id is your route
  }
}