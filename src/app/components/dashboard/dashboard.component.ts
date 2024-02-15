import { Component } from '@angular/core';
import { ReusableCardComponent } from "../reusable-card/reusable-card.component";
import { NavigationComponent } from "../navigation/navigation.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [ReusableCardComponent, NavigationComponent,MatToolbarModule,MatListModule]
})
export class DashboardComponent {

}
