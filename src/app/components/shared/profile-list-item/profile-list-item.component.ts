import { Component, Input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';  // Import des variables d'environnement

@Component({
  selector: 'app-profile-list-item',
  standalone: true,
  imports: [MatListModule, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardSubtitle, MatButtonModule, MatTooltipModule],
  templateUrl: './profile-list-item.component.html',
  styleUrls: ['./profile-list-item.component.scss']
})
export class ProfileListItemComponent {
  @Input() profile: any;
  @Input() profileType: 'student' | 'teacher' = 'student';  // Peut être étendu à d'autres types de profils

  profilePhotoUrl: string = '';  // Variable pour stocker l'URL complète de la photo

  ngOnInit() {
    console.log(this.profile);

    // Générer dynamiquement l'URL complète de la photo
    if (this.profile?.photo) {
      this.profilePhotoUrl = `${environment.apiUrl}${environment.imagesPath}${this.profile.photo}`;
    } else {
      this.profilePhotoUrl = 'assets/default-avatar.png';  // Utiliser une image par défaut si aucune photo n'est disponible
    }
  }

  /**
   * Ouvre Gmail avec l'email pré-rempli
   */
  openEmail(event: Event): void {
    event.stopPropagation(); // Empêche la navigation vers le profil
    if (this.profile?.email) {
      window.open(`mailto:${this.profile.email}`, '_blank');
    }
  }

  /**
   * Ouvre WhatsApp avec le numéro de téléphone
   */
  openWhatsApp(event: Event): void {
    event.stopPropagation(); // Empêche la navigation vers le profil
    if (this.profile?.phoneNumber) {
      // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
      const cleanPhone = this.profile.phoneNumber.replace(/[\s\-\(\)]/g, '');
      // Ajouter le code pays si nécessaire (exemple: +33 pour France)
      const phoneNumber = cleanPhone.startsWith('+') ? cleanPhone : `+212${cleanPhone}`;
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  }
}
