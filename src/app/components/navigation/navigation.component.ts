import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { StudentService } from '../student/services/student.service';
import { TeacherService } from '../../services/teacher.service';  // Import TeacherService
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchService } from '../../services/SearchService ';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIcon, MatToolbarModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatMenuModule, RouterLink, MatTooltip
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  userPhoto: any;
  hideSearch: boolean = false;
  selectedIcon: string = '';
  searchControl = new FormControl('');
  filteredSuggestions: Observable<string[]> | undefined;
  placeholder: string = 'Rechercher un élève...';
  currentSearchType: string = 'student';

  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() searchEvent = new EventEmitter<string>();

  constructor(
    private router: Router,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.filteredSuggestions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.determineSearchLogic(value ?? ''))
    );
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  setSearchType(type: string): void {
    this.clearSearch();
    this.currentSearchType = type;
    this.placeholder = this.getPlaceholderByType(type);
    this.searchService.setSearch(type);
    this.selectedIcon = type;
  }

  onSearch(): void {
    console.log('Emitting search term:', this.searchControl.value);
    this.searchEvent.emit(this.searchControl.value ?? '');
    this.searchService.setSearch(this.searchControl.value ?? '');
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
        return of([]);  // Implement group search logic here if needed
      case 'teacher':
        return this.performTeacherSearch(value);  // Add teacher search logic
      default:
        return of([]);
    }
  }

  private performStudentSearch(value: string): Observable<string[]> {
    return this.studentService.searchStudentsByNameStartingWith(value).pipe(
      map(students => students.map(student => `${student.firstName} ${student.lastName}`))
    );
  }

  private performTeacherSearch(value: string): Observable<string[]> {  // New method for teacher search
    return this.teacherService.searchTeachersByNameStartingWith(value).pipe(
      map(teachers => teachers.map(teacher => `${teacher.firstName} ${teacher.lastName}`))
    );
  }

  private getPlaceholderByType(type: string): string {
    switch (type) {
      case 'student': return 'Rechercher un élève...';
      case 'group': return 'Rechercher un groupe...';
      case 'teacher': return 'Rechercher un enseignant...';
      default: return 'Search...';
    }
  }

  onSelect(suggestion: string): void {
    console.log('User selected:', suggestion);
    this.searchControl.setValue(suggestion);
    this.onSearch();
  }

   // Méthode pour changer le thème
   toggleDarkMode() {
    // Votre logique pour activer/désactiver le mode sombre
  }

  // Méthode pour changer la langue
  changeLanguage(_lang:string) {
    
  }

  // Méthode pour la déconnexion
  logout() {
    // Votre logique pour déconnecter l'utilisateur
  }

  // Méthode pour ouvrir les paramètres
  openSettings() {
    // Votre logique pour ouvrir les paramètres
  }
}
