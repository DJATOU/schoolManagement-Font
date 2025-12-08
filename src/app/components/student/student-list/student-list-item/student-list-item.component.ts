import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Student } from '../../domain/student';
import { MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-student-list-item',
  standalone: true,
  imports: [
    CommonModule, // Ajouter CommonModule ici
    MatListItem,
    MatCard,
    MatCardContent,
    MatIcon,
    MatButtonModule,
    MatTooltipModule
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

  /**
   * Ouvre Gmail avec l'email pré-rempli
   */
  openEmail(event: Event): void {
    event.stopPropagation(); // Empêche la navigation vers le profil
    if (this.student?.email) {
      window.open(`mailto:${this.student.email}`, '_blank');
    }
  }

  /**
   * Ouvre WhatsApp avec le numéro de téléphone
   */
  openWhatsApp(event: Event): void {
    event.stopPropagation(); // Empêche la navigation vers le profil
    if (this.student?.phoneNumber) {
      // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
      const cleanPhone = this.student.phoneNumber.replace(/[\s\-\(\)]/g, '');
      // Ajouter le code pays si nécessaire (exemple: +212 pour Maroc)
      const phoneNumber = cleanPhone.startsWith('+') ? cleanPhone : `+212${cleanPhone}`;
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  }
}
