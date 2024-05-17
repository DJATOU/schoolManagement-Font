import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Student } from '../../../models/student/student';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.scss']
})
export class StudentCardComponent implements OnInit {
  @Input() student!: Student;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Student data:', this.student); // Log student data
    if (!this.student || !this.student.id) {
      console.error('Student input is not properly defined or does not have an ID:', this.student);
    }
  }

  navigateToProfile(): void {
    if (this.student && this.student.id) {
      this.router.navigate(['/student', this.student.id]);
    } else {
      console.error('Student ID is null or undefined');
    }
  }

  sendEmail(event: Event): void {
    event.stopPropagation();
    // Logic to send an email
  }

  callPhone(event: Event): void {
    event.stopPropagation();
    // Logic to call the student
  }
}
