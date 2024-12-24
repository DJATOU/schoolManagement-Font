import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Student } from '../domain/student';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentCardComponent } from '../student-card/student-card.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/SearchService ';
import { StudentListItemComponent } from '../student-list/student-list-item/student-list-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FadeInDirective } from '../../shared/FadeInDirective';

@Component({
  selector: 'app-student-search',
  standalone: true,
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss'],
  imports: [
    CommonModule, MatToolbarModule, MatPaginatorModule, StudentCardComponent, 
    StudentListComponent, MatIconModule,StudentListItemComponent,MatProgressSpinnerModule,FadeInDirective
  ]
})
export class StudentSearchComponent implements OnInit {
  viewMode = 'card'; // 'card' or 'list'
  students: Student[] = [];
  filteredStudents: Student[] = [];
  currentPageStudents: Student[] = [];
  totalStudents: number = 0;
  pageSize: number = 8; // Adjust as needed
  pageSizeOptions: number[] = [4, 8]; // Adjust as needed
  isLoading = true;

  constructor(
    private studentService: StudentService, 
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listenToSearchEvents();
    this.loadAllStudents(); // Load all students initially
  }

  listenToSearchEvents(): void {
    this.searchService.getSearch().subscribe((searchTerm: string) => {
      this.handleSearch(searchTerm);
    });
  }
  
  handleSearch(searchTerm: string): void {
    this.isLoading = true;
    if (!searchTerm) {
      this.loadAllStudents(); // Load all students if no search term is specified.
    } else {
      this.studentService.searchStudentsByNameStartingWith(searchTerm).subscribe(students => {
        if (students.length === 1) {
          this.router.navigate(['/student', students[0].id]);
        } else {
          this.filteredStudents = students;
          this.updatePageStudents();
          this.isLoading = false;
        }
      });
    }
  }
  
  loadAllStudents(): void {
    this.isLoading = true; 
    this.studentService.getStudents().subscribe(students => {
      this.filteredStudents = students;
      this.totalStudents = students.length;
      this.updatePageStudents();
      this.isLoading = false; // Désactiver le loader
    });
  }

  changePage(event: PageEvent) {
    this.isLoading = true; // Activer le loader lors du changement de page
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
  
    setTimeout(() => {
      this.currentPageStudents = this.filteredStudents.slice(startIndex, endIndex);
      this.isLoading = false; // Désactiver le loader après le changement
    }, 1000); // Simuler un délai de chargement
  }
  

  changeViewMode(mode: string): void {
    this.viewMode = mode;
  }

  // Helper method to update the students on the current page
  private updatePageStudents() {
    this.totalStudents = this.filteredStudents.length;
    this.currentPageStudents = this.filteredStudents.slice(0, this.pageSize);
  }
}
