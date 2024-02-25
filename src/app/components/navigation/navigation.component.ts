import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StudentService } from '../../services/student.service';
import { Observable, debounceTime, map, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,
    MatInputModule, MatIcon, MatToolbarModule,FormsModule,MatAutocompleteModule,ReactiveFormsModule ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  searchTerm: string = '';
  searchControl = new FormControl();
  filteredSuggestions: Observable<string[]> | undefined;
  constructor(private router: Router, private searchService: StudentService) {}
  
  userPhoto = 'path/to/photo.jpg';
  toggleSidenav(){

  }

  ngOnInit() {
    // Initialisation de l'observable pour les suggestions d'autocomplétion
    this.filteredSuggestions = this.searchControl.valueChanges.pipe(
      debounceTime(300), // Attend 300ms après chaque frappe avant de procéder
      startWith(''), // Commence avec une chaîne vide pour avoir un état initial
      switchMap(value => this.search(value)) // Transforme l'entrée en appel de service
    );
  }
  
  search(value: string): Observable<string[]> {
    // Call the service and get the students
    return this.searchService.searchStudentsByNameStartingWith(value).pipe(
      // Transform the Student[] array into a string[] array
      map(students => students.map(student => student.firstName + ' ' + student.lastName))
    );
  }

  onSelect(suggestion: string): void {
    // Gère la sélection d'une suggestion par l'utilisateur
    console.log(`Vous avez sélectionné ${suggestion}`);
    // Optionnel : Naviguer vers un composant de détail ou effectuer une autre action
  }

  searchStudents(): void {
    // Gère la soumission de la recherche par l'utilisateur
    this.router.navigate(['/students'], { queryParams: { search: this.searchControl.value } });
  }
  

  navigateToStudentSearch() {
    console.log('Attempting to navigate to /students');
    this.router.navigate(['/students']);
  }
  

}
