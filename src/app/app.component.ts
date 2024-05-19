import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { StudentSearchComponent } from "./components/student/student-search/student-search.component";
import { HttpClientModule } from '@angular/common/http';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { SharedLayoutContainerComponent } from './components/shared/shared-layout-container/shared-layout-container.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, RouterLink, NavigationComponent, SideMenuComponent, StudentSearchComponent, RouterModule,HttpClientModule,MatSidenav,MatSidenavContainer,MatSidenavContent,SharedLayoutContainerComponent]
})
export class AppComponent {
  title = 'schoolManagement-front';

  isSidenavOpen = true;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
