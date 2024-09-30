import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../../models/group/group';
import { Student } from '../../../models/student/student';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { GroupService } from '../../../services/group.service';
import { AddStudentDialogComponent } from '../../session/add-student-dialog/add-student-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { ProfileListItemComponent } from '../../shared/profile-list-item/profile-list-item.component';
import { StudentListComponent } from "../../student/student-list/student-list.component";
import { StudentService } from '../../../services/student.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditGroupDialogComponent } from '../edit-group-dialog/edit-group-dialog.component';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  standalone: true,
  styleUrls: ['./group-profile.component.scss'],
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon,
    MatList,
    MatListItem,
    CommonModule,
    ProfileListItemComponent,
    StudentListComponent,
    StudentListComponent
]
})
export class GroupProfileComponent implements OnInit {
  group: Group | null = null;
  students: Student[] = [];
  series: SessionSeries[] = [];
  loadingGroup = true;
  loadingStudents = true;
  loadingSeries = true;

  constructor(
    private groupService: GroupService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const groupId = this.getGroupIdFromRoute();
    if (groupId) {
      this.loadGroupData(groupId);
      this.loadStudents(groupId);
      this.loadSeries(groupId);
    }
  }

  private getGroupIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

  private loadGroupData(groupId: number): void {
    this.groupService.getGroupDetailsById(groupId).subscribe({
      next: (group) => {
        console.log('Group details:', group);  // Log pour vérifier les données reçues
        this.group = group;
        this.loadingGroup = false;
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.loadingGroup = false;
      }
    });
  }
  

  private loadStudents(groupId: number): void {
    this.groupService.getStudentsByGroupId(groupId).subscribe({
      next: (students: Student[]) => {
        console.log(students);  // Log the students array to check its structure
        this.students = students;
        this.loadingStudents = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loadingStudents = false;
      }
    });
  }
  

  private loadSeries(groupId: number): void {
    this.groupService.getSeriesByGroupId(groupId).subscribe({
      next: (series) => {
        this.series = series;
        this.loadingSeries = false;
      },
      error: (error) => {
        console.error('Error loading series:', error);
        this.loadingSeries = false;
      }
    });
  }

  addStudentToGroup(): void {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '400px',
      data: { groupId: this.group?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.addStudentToGroup(this.group!.id!, result.studentId).subscribe({
          next: () => {
            this.loadStudents(this.group!.id!); // Reload the students list after adding
          },
          error: (error) => {
            console.error('Error adding student to group:', error);
          }
        });
      }
    });
  }


  onEditGroup(): void {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {
      width: '600px',
      data: { group: this.group },
    });

    dialogRef.afterClosed().subscribe((result: Group | undefined) => {
      if (result) {
        this.groupService.updateGroup(result).subscribe({
          next: (updatedGroup) => {
            this.group = updatedGroup;
            //this.loadGroupDetails(); // Si vous avez une méthode pour recharger les détails du groupe
            this.showSuccessMessage('Groupe mis à jour avec succès.');
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du groupe :', error);
            this.showErrorMessage('Erreur lors de la mise à jour du groupe.');
          },
        });
      } else {
        console.log('Modification annulée.');
      }
    });
  }

  
  onPrint() {
   
  }

  onDisable(){
    
  }

  removeStudentFromGroup(student: Student): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Suppression d'un étudiant",
        message: 'Voulez-vous vraiment supprimer cet étudiant du groupe ?',
        confirmText: 'Oui, supprimer',
        cancelText: 'Non, annuler',
        confirmColor: 'warn'
      }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.group && this.group.id !== undefined) {
          const groupId = this.group.id;
          console.log("rrrrrr", student.id);
          this.studentService.removeStudentFromGroup(groupId, student.id).subscribe({
            next: () => {
              this.snackBar.open('Étudiant retiré du groupe avec succès', 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loadStudents(groupId); // Recharger les étudiants après suppression
            },
            error: () => {
              this.snackBar.open('Erreur lors du retrait de l\'étudiant du groupe', 'Fermer', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          });
        } else {
          this.snackBar.open('Le groupe ou l\'ID du groupe est indéfini', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      } else {
        console.log('Suppression annulée');
      }
    });
  }
  
  showSuccessMessage(message: string): void {
    // Implémentez la logique pour afficher un message de succès
    console.log(message);
  }

  showErrorMessage(message: string): void {
    // Implémentez la logique pour afficher un message d'erreur
    console.error(message);
  }
  
}
