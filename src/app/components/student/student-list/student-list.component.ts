import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Student } from '../../../models/student/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
  @Input() student!: Student;
}
