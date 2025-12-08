import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher/teacher';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TeacherCardComponent } from '../teacher-card/teacher-card.component';
import { TeacherListComponent } from '../teacher-list/teacher-list.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/SearchService ';
@Component({
  selector: 'app-teacher-search',
  standalone: true,
  templateUrl: './teacher-search.component.html',
  styleUrls: ['./teacher-search.component.scss'],
  imports: [
    CommonModule, MatToolbarModule, MatPaginatorModule, TeacherCardComponent, TeacherListComponent, MatIconModule, MatProgressSpinnerModule
  ]
})
export class TeacherSearchComponent implements OnInit {
  viewMode = 'card'; // 'card' or 'list'
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  currentPageTeachers: Teacher[] = [];
  totalTeachers: number = 0;
  pageSize: number = 8; // Adjust as needed
  pageSizeOptions: number[] = [4, 8]; // Adjust as needed
  isLoading = true;

  constructor(
    private teacherService: TeacherService, 
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listenToSearchEvents();
    this.loadAllTeachers(); // Load all teachers initially
  }

  listenToSearchEvents(): void {
    this.searchService.getSearch().subscribe((searchTerm: string) => {
      this.handleSearch(searchTerm);
    });
  }

  handleSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.loadAllTeachers(); // Load all teachers if no search term is specified.
    } else {
      this.teacherService.searchTeachersByNameStartingWith(searchTerm).subscribe(teachers => {
        if (teachers.length === 1) {
          this.router.navigate(['/teacher', teachers[0].id]);
        } else {
          this.filteredTeachers = teachers;
          this.updatePageTeachers();
        }
      });
    }
  }

  loadAllTeachers(): void {
    this.isLoading = true;
    this.teacherService.getTeachers().subscribe(teachers => {
      this.filteredTeachers = teachers;
      this.totalTeachers = teachers.length;
      this.updatePageTeachers();
      this.isLoading = false;
    });
  }

  changePage(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.currentPageTeachers = this.filteredTeachers.slice(startIndex, endIndex);
  }

  changeViewMode(mode: string): void {
    this.viewMode = mode;
  }

  // Helper method to update the teachers on the current page
  private updatePageTeachers() {
    this.totalTeachers = this.filteredTeachers.length;
    this.currentPageTeachers = this.filteredTeachers.slice(0, this.pageSize);
  }
}
