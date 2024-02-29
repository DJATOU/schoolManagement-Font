import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student/student';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentCardComponent } from '../student-card/student-card.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/SearchService ';

@Component({
  selector: 'app-student-search',
  standalone: true,
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss'],
  imports: [
    CommonModule, MatToolbarModule, MatPaginatorModule, StudentCardComponent, StudentListComponent
  ]
})
export class StudentSearchComponent implements OnInit {
  viewMode = 'card'; // 'card' or 'list'
  students: Student[] = [];
  filteredStudents: Student[] = [];
  currentPageStudents: Student[] = [];
  totalStudents: number = 0;
  pageSize: number = 10; // Adjust as needed
  pageSizeOptions: number[] = [5, 10, 20]; // Adjust as needed

  constructor(
    private studentService: StudentService, 
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.listenToSearchEvents();
    this.loadAllStudents(); // Load all students initially
  }

  listenToSearchEvents(): void {
    this.searchService.getSearch().subscribe((searchTerm: string) => {
      console.log('Received search term in StudentSearchComponent:', searchTerm);
      this.handleSearch(searchTerm);
    });
  }
  
  handleSearch(searchTerm: string): void {
    console.log('Handling search for:', searchTerm);
    if (!searchTerm) {
      this.loadAllStudents(); // Load all students if no search term is specified.
    } else {
      this.studentService.searchStudentsByNameStartingWith(searchTerm).subscribe(students => {
        console.log('Search results:', students);
        this.filteredStudents = students;
        this.updatePageStudents();
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
