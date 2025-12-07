# ✅ Phase 3A - Frontend Services (Gestion Photos)

**Date**: 2025-12-07
**Status**: ✅ Services terminés

---

## 📊 Résumé

Ajout des méthodes de gestion des photos pour Groups et Teachers dans les services Angular.

### Modifications Réalisées

#### 1. GroupService - Méthodes photo ✅
**Fichier**: `src/app/services/group.service.ts`

**Méthodes ajoutées**:

```typescript
/**
 * PHASE 3A: Upload photo pour un groupe
 */
uploadGroupPhoto(groupId: number, file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<string>(
    `${this.apiUrl}/${groupId}/photo`,
    formData,
    {
      responseType: 'text' as 'json' // Backend retourne un string
    }
  );
}

/**
 * PHASE 3A: Récupère l'URL de la photo d'un groupe
 */
getGroupPhotoUrl(groupId: number): string {
  return `${this.apiUrl}/${groupId}/photo`;
}
```

**Endpoints appelés**:
- `POST /api/groups/{id}/photo` - Upload
- `GET /api/groups/{id}/photo` - Récupération (via URL)

---

#### 2. TeacherService - Méthodes photo ✅
**Fichier**: `src/app/services/teacher.service.ts`

**Méthodes ajoutées**:

```typescript
/**
 * PHASE 3A: Upload photo pour un enseignant
 */
uploadTeacherPhoto(teacherId: number, file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<string>(
    `${this.apiUrl}/${teacherId}/photo`,
    formData,
    {
      responseType: 'text' as 'json' // Backend retourne un string
    }
  );
}

/**
 * PHASE 3A: Récupère l'URL de la photo d'un enseignant
 */
getTeacherPhotoUrl(teacherId: number): string {
  return `${this.apiUrl}/${teacherId}/photo`;
}
```

**Endpoints appelés**:
- `POST /api/teachers/{id}/photo` - Upload
- `GET /api/teachers/{id}/photo` - Récupération (via URL)

---

## 📝 Utilisation dans les Composants

### Upload Photo - Exemple GroupCard

```typescript
import { Component } from '@angular/core';
import { GroupService } from './services/group.service';

export class GroupCardComponent {
  selectedFile: File | null = null;

  constructor(private groupService: GroupService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadPhoto(groupId: number): void {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    this.groupService.uploadGroupPhoto(groupId, this.selectedFile)
      .subscribe({
        next: (filename) => {
          console.log('Photo uploaded:', filename);
          // Recharger l'image
          this.photoUrl = this.groupService.getGroupPhotoUrl(groupId);
        },
        error: (error) => {
          console.error('Upload failed:', error);
        }
      });
  }

  getPhotoUrl(groupId: number): string {
    return this.groupService.getGroupPhotoUrl(groupId);
  }
}
```

### Template HTML - Affichage Photo

```html
<!-- Affichage de la photo avec fallback -->
<img
  [src]="getPhotoUrl(group.id)"
  [alt]="group.name"
  (error)="onImageError($event)"
  class="group-photo"
/>

<!-- Input pour upload -->
<input
  type="file"
  accept="image/*"
  (change)="onFileSelected($event)"
  #fileInput
/>

<button (click)="uploadPhoto(group.id)">
  Upload Photo
</button>
```

### Gestion d'Erreur Image

```typescript
onImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/default-group.png'; // Photo par défaut
}
```

---

## 🎯 Prochaines Étapes

### 1. Créer Composants Dialog ✅

#### EditGroupDialog
- Formulaire de modification groupe
- Input file pour photo
- Preview de l'image
- Boutons Annuler/Sauvegarder

```typescript
// edit-group-dialog.component.ts
export class EditGroupDialogComponent {
  groupForm: FormGroup;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSave(): void {
    if (this.groupForm.valid) {
      const groupData = this.groupForm.value;

      // Update group
      this.groupService.updateGroup(groupData).subscribe(() => {
        // Upload photo si sélectionnée
        if (this.selectedFile) {
          this.groupService.uploadGroupPhoto(groupData.id, this.selectedFile)
            .subscribe(() => {
              this.dialogRef.close(true);
            });
        } else {
          this.dialogRef.close(true);
        }
      });
    }
  }
}
```

#### EditTeacherDialog
- Structure similaire à EditGroupDialog
- Adapté pour Teacher

### 2. Modifier les Cartes ✅

#### GroupCard Component
```html
<mat-card class="group-card">
  <!-- Photo avec gestion d'erreur -->
  <img
    mat-card-image
    [src]="getGroupPhotoUrl(group.id)"
    [alt]="group.name"
    (error)="onImageError($event)"
  />

  <mat-card-header>
    <mat-card-title>{{ group.name }}</mat-card-title>
  </mat-card-header>

  <mat-card-actions>
    <button mat-icon-button (click)="onEdit(group)">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button color="warn" (click)="onDelete(group)">
      <mat-icon>delete</mat-icon>
    </button>
  </mat-card-actions>
</mat-card>
```

#### TeacherCard Component
- Structure similaire à GroupCard

---

## 🔧 Configuration Requise

### Images Par Défaut

Créer les images par défaut dans `src/assets/images/`:
- `default-group.png` - Photo groupe par défaut
- `default-teacher.png` - Photo enseignant par défaut

### Taille Recommandée
- **Dimension**: 400x400px
- **Format**: PNG avec transparence
- **Taille**: < 50KB

---

## ✅ Checklist Frontend

### Services ✅
- [x] GroupService - uploadGroupPhoto()
- [x] GroupService - getGroupPhotoUrl()
- [x] TeacherService - uploadTeacherPhoto()
- [x] TeacherService - getTeacherPhotoUrl()

### Composants (À faire)
- [ ] EditGroupDialogComponent - Créer
- [ ] EditGroupDialogComponent - Upload photo
- [ ] EditTeacherDialogComponent - Créer
- [ ] EditTeacherDialogComponent - Upload photo
- [ ] GroupCardComponent - Afficher photo
- [ ] GroupCardComponent - Boutons edit/delete
- [ ] TeacherCardComponent - Afficher photo
- [ ] TeacherCardComponent - Boutons edit/delete

### Assets (À faire)
- [ ] default-group.png
- [ ] default-teacher.png

---

## 📊 Statistiques

### Modifications
| Fichier | Méthodes Ajoutées | LOC |
|---------|------------------|-----|
| `group.service.ts` | 2 (upload + getUrl) | +26 |
| `teacher.service.ts` | 2 (upload + getUrl) | +26 |
| **Total** | **4 méthodes** | **+52 LOC** |

---

## 🎉 Status Final

**Services Frontend Phase 3A**: ✅ **Terminés**
**Composants UI**: 📋 **À créer** (EditDialog + Cards)
**Images Assets**: 📋 **À ajouter**

---

**Prochaine session**: Créer les composants EditGroupDialog et EditTeacherDialog avec upload de photos.

