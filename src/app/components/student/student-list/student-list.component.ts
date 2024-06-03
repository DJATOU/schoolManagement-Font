import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student/student';
import { ProfileListItemComponent } from '../../shared/profile-list-item/profile-list-item.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [MatListModule, CommonModule, ProfileListItemComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  @Input() student!: Student;

  profile: any;

  ngOnInit(): void {
    this.profile = {
      firstName: this.student.firstName,
      lastName: this.student.lastName,
      photo: this.student.photo,
      email: this.student.email,
    };
  }
}
