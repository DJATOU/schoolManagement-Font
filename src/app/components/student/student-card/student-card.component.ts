import { Component, Input } from '@angular/core';
import {MatCardModule } from '@angular/material/card';
import { Student } from '../../../models/student/student';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.scss'
})
export class StudentCardComponent {

  @Input() student!: Student;

}
