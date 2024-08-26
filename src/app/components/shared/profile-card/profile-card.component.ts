import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  subtitle?: string;
  email?: string;
  phoneNumber?: string;
  level?: number;
}

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @Input() profile!: Profile;
  @Input() profileType!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Profile data:', this.profile);
    if (!this.profile) {
      console.error('Profile is null or undefined:', this.profile);
    } else if (!this.profile.id) {
      console.error('Profile ID is missing:', this.profile);
    } else {
      console.log('Profile is properly defined:', this.profile);
    }
  }

  navigateToProfile(): void {
    if (this.profile && this.profile.id) {
      this.router.navigate([`/${this.profileType}`, this.profile.id]);
    } else {
      console.error('Profile ID is null or undefined');
    }
  }

  sendEmail(event: Event): void {
    event.stopPropagation();
    // Logic to send an email
  }

  callPhone(event: Event): void {
    event.stopPropagation();
    // Logic to call the profile
  }
}
