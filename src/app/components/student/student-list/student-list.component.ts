import { Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student/student';
import { ProfileListItemComponent } from '../../shared/profile-list-item/profile-list-item.component';
import { StudentListItemComponent } from './student-list-item/student-list-item.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [MatListModule, CommonModule, ProfileListItemComponent,StudentListItemComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  @Input() students!: Student[];  // Accept an array of students
}