import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

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
  imports: [MatCardModule, CommonModule, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @Input() profile!: Profile;
  @Input() profileType!: string;
  profilePhotoUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Profile data:', this.profile);
    if (!this.profile) {
      console.error('Profile is null or undefined:', this.profile);
    } else if (!this.profile.id) {
      console.error('Profile ID is missing:', this.profile);
    } else {
      console.log('Profile is properly defined:', this.profile);

      // Générer l'URL complète de la photo de profil
      if (this.profile.photo) {
        this.profilePhotoUrl = `${environment.apiUrl}${environment.imagesPath}${this.profile.photo}`;
      } else {
        this.profilePhotoUrl = 'assets/default-avatar.png';  // Utiliser une image par défaut si aucune photo n'est disponible
      }
    }
  }

  navigateToProfile(): void {
    if (this.profile && this.profile.id) {
      this.router.navigate([`/${this.profileType}`, this.profile.id]);
    } else {
      console.error('Profile ID is null or undefined');
    }
  }

  /**
   * Ouvre Gmail avec l'email pré-rempli
   */
  sendEmail(event: Event): void {
    event.stopPropagation();
    if (this.profile?.email) {
      window.open(`mailto:${this.profile.email}`, '_blank');
    }
  }

  /**
   * Ouvre WhatsApp avec le numéro de téléphone
   */
  callPhone(event: Event): void {
    event.stopPropagation();
    if (this.profile?.phoneNumber) {
      // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
      const cleanPhone = this.profile.phoneNumber.replace(/[\s\-\(\)]/g, '');
      // Ajouter le code pays si nécessaire (exemple: +212 pour Maroc)
      const phoneNumber = cleanPhone.startsWith('+') ? cleanPhone : `+212${cleanPhone}`;
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  }
}
