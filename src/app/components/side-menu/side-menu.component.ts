import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, MatExpansionModule, MatToolbarModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {

  
constructor(private router: Router) {}

  isOpen = true; // État initial du sidenav

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  @Input() isSidenavOpen = false;
}
