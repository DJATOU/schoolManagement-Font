import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentCardComponent } from '../student-card/student-card.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student/student';
import { StudentService } from '../../../services/student.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [MatToolbarModule, StudentCardComponent, StudentListComponent, CommonModule],
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss']
})
export class StudentSearchComponent implements OnInit {
  viewMode = 'card'; // 'card' ou 'list'
  students: Student[] = [];
  searchControl = new FormControl('');
  
  constructor(private studentService: StudentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter(params => !!params['search']),
      switchMap(params => {
        const searchTerm = params['search'] || '';
        return this.studentService.searchStudents(searchTerm);
      })
    ).subscribe(students => {
      this.students = students;
    });

    // Assurez-vous que le filtre retourne un booléen explicite
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => !!term && term.length > 0), // Correction ici
      switchMap(searchTerm => this.studentService.searchStudents(searchTerm || ''))
    ).subscribe(students => {
      this.students = students;
    });
  }

  changeViewMode(mode: string): void {
    this.viewMode = mode;
  }
}
