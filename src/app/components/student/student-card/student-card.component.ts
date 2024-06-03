import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Student } from '../../../models/student/student';
import { ProfileCardComponent } from '../../shared/profile-card/profile-card.component';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, ProfileCardComponent],
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.scss']
})
export class StudentCardComponent implements OnInit {
  @Input() student!: Student;

  profile: any;

  ngOnInit(): void {
    if (this.student) {
      this.profile = {
        id: this.student.id,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        photo: this.student.photo || '',
        subtitle: `Level: ${this.student.level}`,
        email: this.student.email || '',
        phoneNumber: this.student.phoneNumber || ''
      };
    } else {
      console.error('Student input is not properly defined');
    }
  }
}
