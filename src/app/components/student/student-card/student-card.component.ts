import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Student } from '../domain/student';
import { ProfileCardComponent } from '../../shared/profile-card/profile-card.component';
import { LevelService } from '../../../services/level.service';

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
  levelName: string | undefined = '';

  constructor(private levelService: LevelService) {}

  ngOnInit(): void {
    console.log('Student object:', this.student);
    this.getLevelName();
  }

  private getLevelName(): void {
    if (this.student.levelId) {
      this.levelService.getLevelById(this.student.levelId).subscribe({
        next: (level) => {
          console.log('Level fetched:', level);
          if (level) {
            this.levelName = level.name;
            this.student.levelName = level.name;
          } else {
            console.warn('Level not found, ID:', this.student.levelId);
          }
          this.setProfile();
        },
        error: (error) => {
          console.error('Error fetching level:', error);
          this.setProfile();
        }
      });
    } else {
      console.warn('No level ID provided for student:', this.student);
      this.setProfile();
    }
  }

  private setProfile(): void {
    if (this.student && this.student.id) {
      this.profile = {
        id: this.student.id,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        photo: this.student.photo || '',
        subtitle: `Level: ${this.student.levelName || 'N/A'}`,
        email: this.student.email || '',
        phoneNumber: this.student.phoneNumber || '',
      };
      console.log('Profile data:', this.profile);
    } else {
      console.error('Student input is not properly defined or does not have an ID:', this.student);
    }
  }
  
}
