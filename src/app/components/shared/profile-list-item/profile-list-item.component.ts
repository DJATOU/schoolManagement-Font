import { Component, Input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { environment } from '../../../../environment';  // Import des variables d'environnement

@Component({
  selector: 'app-profile-list-item',
  standalone: true,
  imports: [MatListModule, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardSubtitle],
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
}
