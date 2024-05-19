import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Teacher } from '../../../models/teacher/teacher';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-teacher-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {
  @Input() teacher!: Teacher;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Teacher data:', this.teacher); // Log teacher data
    if (!this.teacher || !this.teacher.id) {
      console.error('Teacher input is not properly defined or does not have an ID:', this.teacher);
    }
  }

  navigateToProfile(): void {
    if (this.teacher && this.teacher.id) {
      this.router.navigate(['/teacher', this.teacher.id]);
    } else {
      console.error('Teacher ID is null or undefined');
    }
  }

  sendEmail(event: Event): void {
    event.stopPropagation();
    // Logic to send an email
  }

  callPhone(event: Event): void {
    event.stopPropagation();
    // Logic to call the teacher
  }
}
