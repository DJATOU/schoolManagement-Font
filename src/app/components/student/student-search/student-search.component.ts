import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student/student';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentCardComponent } from '../student-card/student-card.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/SearchService ';

@Component({
  selector: 'app-student-search',
  standalone: true,
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss'],
  imports: [
    CommonModule, MatToolbarModule, MatPaginatorModule, StudentCardComponent, StudentListComponent, MatIconModule
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
    if (!searchTerm) {
      this.loadAllStudents(); // Load all students if no search term is specified.
    } else {
      this.studentService.searchStudentsByNameStartingWith(searchTerm).subscribe(students => {
        if (students.length === 1) {
          this.router.navigate(['/student', students[0].id]);
        } else {
          this.filteredStudents = students;
          this.updatePageStudents();
        }
      });
    }
  }
  
  loadAllStudents(): void {
    this.studentService.getStudents().subscribe(students => {
      this.filteredStudents = students;
      this.totalStudents = students.length;
      this.updatePageStudents();
    });
  }

  changePage(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.currentPageStudents = this.filteredStudents.slice(startIndex, endIndex);
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
