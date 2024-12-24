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
    imports: [CommonModule, RouterOutlet, RouterLink, NavigationComponent, SideMenuComponent, StudentSearchComponent, RouterModule,
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,MatSidenav,MatSidenavContainer,MatSidenavContent,SharedLayoutContainerComponent]
})
export class AppComponent {
  title = 'schoolManagement-front';

  isSidenavOpen = true;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
