import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { SearchService } from '../../services/SearchService ';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    // Ensure all used Material modules and CommonModule are imported here
    CommonModule, MatFormFieldModule, MatInputModule, MatIcon, MatToolbarModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
userPhoto: any;
toggleSidenav() {
throw new Error('Method not implemented.');
}

  searchControl = new FormControl('');
  filteredSuggestions: Observable<string[]> | undefined;
  placeholder: string = 'Search for students...';
  currentSearchType: string = 'student';

  @Output() searchEvent = new EventEmitter<string>();

  constructor(
    private router: Router,
    private studentService: StudentService, 
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.filteredSuggestions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.determineSearchLogic(value ?? ''))
    );
  }

  setSearchType(type: string): void {
    this.currentSearchType = type;
    this.placeholder = this.getPlaceholderByType(type);
    this.searchService.setSearch(type); // Assuming SearchService can handle different types of searches.
  }

  onSearch(): void {
    console.log('Emitting search term:', this.searchControl.value);
    this.searchEvent.emit(this.searchControl.value ?? '');
    this.searchService.setSearch(this.searchControl.value ?? '');
    // Navigate based on the search type if needed.
    this.router.navigate([`/${this.currentSearchType}`], { queryParams: { search: this.searchControl.value } });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  private determineSearchLogic(value: string): Observable<string[]> {
    if (!value) return of([]);
    switch (this.currentSearchType) {
      case 'student':
        return this.performStudentSearch(value);
      case 'group':
      case 'teacher':
        // Placeholder for other types of searches
        return of([]);
      default:
        return of([]);
    }
  }

  private performStudentSearch(value: string): Observable<string[]> {
    return this.studentService.searchStudentsByNameStartingWith(value).pipe(
      map(students => students.map(student => `${student.firstName} ${student.lastName}`))
    );
  }

  private getPlaceholderByType(type: string): string {
    switch (type) {
      case 'student': return 'Search for students...';
      case 'group': return 'Search for groups...';
      case 'teacher': return 'Search for teachers...';
      default: return 'Search...';
    }
  }

  onSelect(suggestion: string): void {
    console.log('User selected:', suggestion);
    this.searchControl.setValue(suggestion);
    this.onSearch();
  }
}
