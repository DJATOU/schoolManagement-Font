import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-profile-list-item',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './profile-list-item.component.html',
  styleUrls: ['./profile-list-item.component.scss']
})
export class ProfileListItemComponent {
  @Input() profile: any;
  @Input() profileType: 'student' | 'teacher' = 'student';
}
