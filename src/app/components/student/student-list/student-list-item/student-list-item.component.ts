import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../../../models/student/student';
import { MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment'; 

@Component({
  selector: 'app-student-list-item',
  standalone: true,
  imports: [MatListItem, MatCard, MatCardContent],
  templateUrl: './student-list-item.component.html',
  styleUrl: './student-list-item.component.scss'
})
export class StudentListItemComponent implements OnInit {
  @Input() student!: Student;  // Accept a single student object
  studentPhotoUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Générer dynamiquement l'URL complète de la photo de l'étudiant
    if (this.student?.photo) {
      this.studentPhotoUrl = `${environment.apiUrl}${environment.imagesPath}${this.student.photo}`;
    } else {
      this.studentPhotoUrl = 'assets/default-avatar.png';  // Utiliser un avatar par défaut si aucune photo
    }
  }

  navigateToStudent(student: Student) {
    this.router.navigate(['/student', student.id]); // Assuming /student/:id is your route
  }
}