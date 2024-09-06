import { Component, Input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-profile-list-item',
  standalone: true,
  imports: [MatListModule, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardSubtitle],
  templateUrl: './profile-list-item.component.html',
  styleUrls: ['./profile-list-item.component.scss']
})
export class ProfileListItemComponent {
  ngOnInit() {
    console.log(this.profile);
  }
  

  @Input() profile: any;
  @Input() profileType: 'student' | 'teacher' = 'student';  // Can be expanded for different profile types
}
