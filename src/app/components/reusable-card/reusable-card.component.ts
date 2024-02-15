// src/app/components/reusable-card/reusable-card.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reusable-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './reusable-card.component.html',
  styleUrls: ['./reusable-card.component.scss']
})
export class ReusableCardComponent {
  @Input() title: string = '';
  @Input() icon: string = ''; // Name of the Material icon
  @Input() color: string = 'default-card'; // Class to apply color
}
