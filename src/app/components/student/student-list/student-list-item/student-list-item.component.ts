import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Student } from '../../domain/student';
import { MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment'; 
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-student-list-item',
  standalone: true,
  imports: [
    CommonModule, // Ajouter CommonModule ici
    MatListItem,
    MatCard,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './student-list-item.component.html',
  styleUrls: ['./student-list-item.component.scss']
})
export class StudentListItemComponent implements OnInit {
  @Input() student!: Student;  // Accepte un objet étudiant
  @Input() showDeleteButton: boolean = false; // Contrôle du bouton "Supprimer"
  @Output() deleteStudent = new EventEmitter<Student>(); // Événement pour notifier la suppression

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
    console.log("rrrrrrrrrrrr");
    this.router.navigate(['/student', student.id]); // En supposant que /student/:id est votre route
  }

  onDeleteStudent(event: Event): void {
    event.stopPropagation(); // Empêche le clic de se propager au parent
    this.deleteStudent.emit(this.student);
  }
}
