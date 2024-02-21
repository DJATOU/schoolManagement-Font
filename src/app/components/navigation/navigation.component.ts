import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule, MatIcon, MatToolbarModule,FormsModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  searchTerm: string = '';
  constructor(private router: Router) {}
  
  userPhoto = 'path/to/photo.jpg';
  toggleSidenav(){

  }

  searchStudents() {
    if (this.searchTerm) {
      console.log('Attempting to navigate to /students with search term:', this.searchTerm);
      this.router.navigate(['/students'], { queryParams: { search: this.searchTerm } });
    }
  }

  navigateToStudentSearch() {
    console.log('Attempting to navigate to /students');
    this.router.navigate(['/students']);
  }
  

}
