import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule, MatIcon, MatToolbarModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  userPhoto = 'path/to/photo.jpg';
  toggleSidenav(){

  }

}
