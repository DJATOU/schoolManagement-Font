import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentCardComponent } from '../student-card/student-card.component';
import { StudentListComponent } from '../student-list/student-list.component';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student/student';
import { StudentService } from '../../../services/student.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, startWith, switchMap, take } from 'rxjs';

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

  // Define form controls for each search parameter
  firstNameControl = new FormControl('');
  lastNameControl = new FormControl('');


  constructor(private studentService: StudentService, private route: ActivatedRoute) {}
 
  ngOnInit(): void {
    this.route.queryParams.pipe(
      // Pas de take(1) ici, car nous voulons continuer à écouter les changements
      debounceTime(300), // Optionnel, pour limiter la fréquence des mises à jour
    ).subscribe(params => {
      const searchParam = params['search'] ?? '';
      // Mettre à jour les FormControl avec le nouveau paramètre de recherche
      this.firstNameControl.setValue(searchParam);
      this.lastNameControl.setValue(searchParam);
  
      // Effectuer la recherche immédiatement avec les nouveaux paramètres
      this.searchWithCurrentValues();
    });
  
    // Initialiser la souscription pour la recherche combinée
    this.initializeSearchSubscription();
  }
  
  // Séparer la logique de souscription pour la recherche dans une nouvelle méthode
  initializeSearchSubscription(): void {
    combineLatest([
      this.firstNameControl.valueChanges.pipe(startWith(this.firstNameControl.value)),
      this.lastNameControl.valueChanges.pipe(startWith(this.lastNameControl.value))
    ])
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(([firstName, lastName]) => {
        return this.studentService.getStudentsByFirstNameAndLastName(firstName ?? '', lastName ?? '');
      })
    )
    .subscribe(students => {
      this.students = students;
    });
  }
  
  // Effectuer la recherche immédiatement avec les valeurs actuelles des FormControl
  searchWithCurrentValues(): void {
    this.studentService.getStudentsByFirstNameAndLastName(
      this.firstNameControl.value ?? '', 
      this.lastNameControl.value ?? ''
    ).subscribe(students => {
      this.students = students;
    });
  }
  
  
  
 

  changeViewMode(mode: string): void {
    this.viewMode = mode;
  }
}
