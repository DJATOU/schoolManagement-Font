import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Teacher } from '../../../models/teacher/teacher';
import { ProfileListItemComponent } from '../../shared/profile-list-item/profile-list-item.component';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [MatListModule, CommonModule, ProfileListItemComponent],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent {
  @Input() teacher!: Teacher;

  profile: any;

  ngOnInit(): void {
    this.profile = {
      firstName: this.teacher.firstName,
      lastName: this.teacher.lastName,
      photo: this.teacher.photo,
      email: this.teacher.email,
    };
  }
}
