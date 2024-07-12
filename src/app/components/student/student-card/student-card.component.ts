import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Student } from '../../../models/student/student';
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
  levelDescription: string | undefined = '';

  constructor(
    private levelService: LevelService
  ) {}

  ngOnInit(): void {
    this.getLevelDescription();
    
    this.setProfile();
  }

  private getLevelDescription() {
    this.levelService.getLevelById(this.student.level).subscribe({
      next: (level) => {
        this.levelDescription = level.description;
        console.log(this.levelDescription);
        this.setProfile();
      },
      error: (error) => {
        console.error('Error fetching level:', error);
      }
    });
  }

  private setProfile() {
    if (this.student) {
      this.profile = {
        id: this.student.id,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        photo: this.student.photo || '',
        subtitle: `Level: ${this.levelDescription}`,
        email: this.student.email || '',
        phoneNumber: this.student.phoneNumber || ''
      };
    } else {
      console.error('Level input is not properly defined');
    }
  }
}
