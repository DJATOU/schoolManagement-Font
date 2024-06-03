import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Teacher } from '../../../models/teacher/teacher';
import { ProfileCardComponent } from '../../shared/profile-card/profile-card.component';

@Component({
  selector: 'app-teacher-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, ProfileCardComponent],
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {
  @Input() teacher!: Teacher;

  profile: any;

  ngOnInit(): void {
    this.profile = {
      id: this.teacher.id,
      firstName: this.teacher.firstName,
      lastName: this.teacher.lastName,
      photo: this.teacher.photo,
      subtitle: `Specialization: ${this.teacher.specialization}`,
      email: this.teacher.email,
      phoneNumber: this.teacher.phoneNumber,
    };
  }
}
