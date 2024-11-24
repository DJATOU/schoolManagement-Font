import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Student } from '../domain/student';
import { StudentListItemComponent } from './student-list-item/student-list-item.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [MatListModule, CommonModule, StudentListItemComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  @Input() students!: Student[];  // Accepte un tableau d'étudiants
  @Input() showDeleteButton: boolean = false; // Contrôle du bouton "Supprimer"
  @Output() deleteStudent = new EventEmitter<Student>(); // Événement de suppression

  onDeleteStudent(student: Student): void {
    this.deleteStudent.emit(student);
  }
}
