import { SharedModule } from '../../../shared/shared/shared.module';
import { GroupCardComponent } from '../../group/group-card/group-card.component';
import { PaymentDialogComponent } from '../../payment/payment-dialog/payment-dialog.component';
import { GroupDialogComponent } from '../../group/group-dialog/group-dialog.component';
import { EditStudentDialogComponent } from '../edit-student-dialog/edit-student-dialog.component';
import { StudentService } from '../services/student.service';
import { GroupService } from '../../../services/group.service';
import { LevelService } from '../../../services/level.service';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { Component, OnInit } from '@angular/core';
import { Student } from '../domain/student';
import { Group } from '../../../models/group/group';
import { GroupType } from '../../../models/GroupType/groupType';
import { Level } from '../../../models/level/level';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiError, ApiResponse } from '../../../models/response';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { PaymentHistoryDialogComponent } from '../../payment/payment-history/payment-history-dialog/payment-history-dialog.component';
import { AttendanceHistoryDialogComponent } from '../../attendance/attendance-history-dialog/attendance-history-dialog.component';
import { environment } from '../../../../environments/environment';
import { PdfGeneratorService } from '../services/pdf-generator.service';

const errorMessages = {
  PAYMENT_EXCEEDS_SESSIONS: "Le paiement ne peut pas être effectué car il dépasse le coût des sessions actuellement créées.",
  STUDENT_NOT_FOUND: "L'étudiant n'a pas été trouvé.",
  GROUP_NOT_FOUND: "Le groupe n'a pas été trouvé.",
  GENERIC_ERROR: "Une erreur est survenue. Veuillez réessayer plus tard.",
  GROUP_ALREADY_ASSOCIATED: "Certains groupes sont déjà associés à l'étudiant.",
  INSUFFICIENT_SESSIONS: "Le nombre de sessions créées est insuffisant pour couvrir le paiement.",
  INVALID_GROUP_LEVEL: "Aucun groupe correspondant au niveau de l'étudiant n'a été trouvé.",
};

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    SharedModule,
    GroupCardComponent
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  providers: [StudentService, GroupService, LevelService, GroupTypeService]
})
export class StudentProfileComponent implements OnInit {
  student: Student | null = null;
  allGroups: Group[] = [];
  allGroupTypes: GroupType[] = [];
  levels: Level[] = [];
  studentGroups: Group[] = [];
  studentLevelId: number = -1;
  groupForm: FormGroup;
  loading = true;
  studentPhotoUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private groupService: GroupService,
    private groupTypeService: GroupTypeService,
    private levelService: LevelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private pdfGeneratorService: PdfGeneratorService // Injection du service
  ) {
    this.groupForm = this.fb.group({
      groupIds: [[]]
    });
  }

  ngOnInit(): void {
    const studentId = this.getStudentIdFromRoute();
    if (studentId) {
      this.loadStudentData(studentId);
    } else {
      this.showError(errorMessages.STUDENT_NOT_FOUND);
    }
    this.loadSelectOptions();
    this.loadAllGroups(); // Ajouté pour charger les groupes
    this.loadAllGroupTypes(); // Si nécessaire pour charger les types de groupes
  }

  private getStudentIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

  private loadStudentData(studentId: number): void {
    this.studentService.getStudentById(studentId).subscribe({
      next: student => {
        this.student = student;
        console.log('Student data:', this.student);

        // Générer l'URL complète de la photo en utilisant les variables d'environnement
        if (this.student?.photo) {
          this.studentPhotoUrl = `${environment.apiUrl}${environment.imagesPath}${this.student.photo}`;
        }
        console.log('Student photo URL:', this.studentPhotoUrl);  // Vérifier l'URL générée

        this.loading = false;
        this.loadStudentLevel();
        this.loadStudentGroups();
      },
      error: () => {
        this.loading = false;
        this.showError(errorMessages.STUDENT_NOT_FOUND);
      }
    });
  }

  private loadStudentLevel(): void {
    if (this.student?.levelId) {
      console.log('Attempting to fetch level with ID:', this.student.levelId); // Log pour vérifier l'ID du niveau
      this.levelService.getLevelById(this.student.levelId).subscribe({
        next: level => {
          console.log('Level fetched successfully:', level); // Log pour vérifier la réponse du backend
          this.student!.levelName = level.name;
          this.studentLevelId = level.id ?? 0;
          console.log('Level name set:', this.student?.levelName);
          this.updateUI();
        },
        error: error => {
          console.error('Error fetching level:', error); // Log pour vérifier les erreurs
          this.showError(errorMessages.GENERIC_ERROR);
          this.updateUI();
        }
      });
    } else {
      console.warn('No level ID provided for student:', this.student);
      this.updateUI();
    }
  }

  private updateUI(): void {
    // Mettez à jour l'interface ici après avoir récupéré les données
    this.loading = false;
  }

  private loadStudentGroups(): void {
    if (this.student?.id !== undefined) {
      this.studentService.getGroupsForStudent(this.student.id).subscribe({
        next: groups => {
          this.studentGroups = groups;
          console.log('Student groups loaded:', this.studentGroups);
        },
        error: () => {
          this.showError(errorMessages.GENERIC_ERROR);
        }
      });
    }
  }

  

  private loadAllGroups(): void {
    this.groupService.getGroups().subscribe({
      next: groups => {
        this.allGroups = groups;
      },
      error: () => {
        this.showError(errorMessages.GENERIC_ERROR);
      }
    });
  }

  private loadAllGroupTypes(): void {
    this.groupTypeService.getAllGroupTypes().subscribe({
      next: groupTypes => {
        this.allGroupTypes = groupTypes;
      },
      error: () => {
        this.showError(errorMessages.GENERIC_ERROR);
      }
    });
  }

  loadSelectOptions(): void {
    this.levelService.getLevels().subscribe(data => this.levels = data);
  }

  onSubmitGroups(): void {
    if (this.groupForm.valid) {
      const groupIds: number[] = this.groupForm.value.groupIds;
      if (this.student?.id !== undefined) {
        this.studentService.addGroupsToStudent(this.student.id, groupIds).subscribe({
          next: (response: ApiResponse) => {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            this.updateStudentGroups(groupIds);

            this.groupForm.reset({ groupIds: [] });
          },
          error: (error: ApiError) => {
            this.handleGroupSubmissionError(error);
          }
        });
      } else {
        this.showError(errorMessages.STUDENT_NOT_FOUND);
      }
    }
  }

  private updateStudentGroups(groupIds: number[]): void {
    const newGroups = this.allGroups.filter(group => group.id !== undefined && groupIds.includes(group.id!));
    this.studentGroups = [...this.studentGroups, ...newGroups];
  }

  private handleGroupSubmissionError(error: ApiError): void {
    if (error.status === 409) {
      const alreadyAssociatedGroups = error.error.alreadyAssociatedGroups || [];
      this.showError(`${errorMessages.GROUP_ALREADY_ASSOCIATED}: ${alreadyAssociatedGroups.join(', ')}`);
    } else if (error.status === 404) {
      this.showError(errorMessages.GROUP_NOT_FOUND);
    } else {
      this.showError(errorMessages.GENERIC_ERROR);
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  openPaymentDialog(): void {
    if (!this.student?.id) {
      this.showError('Invalid student');
      return;
    }
  
    // Charger la liste "fixe + rattrapage" avant d'ouvrir la dialog
    this.groupService.getGroupsForPayment(this.student.id).subscribe({
      next: (allGroups) => {
        if (allGroups.length === 0) {
          this.showError('No group available for payment');
          return;
        }
  
        // Ouvrir la dialog en passant cette liste élargie :
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          width: '400px',
          data: {
            studentId: this.student!.id,
            groups: allGroups  // => contiendra fixes + rattrapage
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.submitPayment(result);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching groups for payment', err);
        this.showError(errorMessages.GENERIC_ERROR);
      }
    });
  }
  

  openGroupDialog(): void {
    console.log('All groups:', this.allGroups);

    // Filtrer tous les groupes correspondant au niveau de l'étudiant
    const groupsForLevel = this.allGroups.filter(group => group.levelId === this.studentLevelId);
    
    if (groupsForLevel.length === 0) {
        // Aucun groupe disponible pour le niveau de l'étudiant
        this.showErrorMessage('Aucun groupe disponible pour ce niveau.');
        return;
    }

    // Filtrer pour exclure les groupes déjà ajoutés à l'étudiant
    const possibleGroups = groupsForLevel.filter(group =>
      !this.studentGroups.some(studentGroup => studentGroup.id === group.id)
    );
    
    if (possibleGroups.length === 0) {
        // Tous les groupes de ce niveau ont déjà été ajoutés à l'étudiant
        this.showErrorMessage('Tous les groupes de ce niveau ont déjà été ajoutés à cet étudiant.');
        return;
    }

    console.log('Possible groups for level:', possibleGroups);

    // Ouvrir un dialogue pour sélectionner les groupes
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '400px',
      data: {
        allGroups: possibleGroups,  // Passer les groupes filtrés qui ne sont pas déjà ajoutés
        selectedGroups: this.groupForm.value.groupIds  // Groupes déjà sélectionnés dans le formulaire
      }
    });

    // Mettre à jour le formulaire avec les groupes sélectionnés
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupForm.patchValue({ groupIds: result });
        this.onSubmitGroups();
      }
    });
  }

  submitPayment(paymentData: any): void {
    console.log('Submitting payment data:', paymentData);
  }

  onEdit(): void {
    const dialogRef = this.dialog.open(EditStudentDialogComponent, {
      width: '600px',
      data: { student: this.student },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains { student: Student, file: File | null }
        this.studentService.updateStudent(result.student).subscribe({
          next: (updatedStudent) => {
            // If a new photo was selected, upload it
            if (result.file) {
              this.studentService.uploadStudentPhoto(updatedStudent.id!, result.file).subscribe({
                next: () => {
                  this.loadStudentData(updatedStudent.id!);
                  this.showSuccessMessage('Étudiant modifié avec succès.');
                },
                error: (error: any) => {
                  console.error('Error uploading photo:', error);
                  this.showErrorMessage('Erreur lors du téléchargement de la photo.');
                }
              });
            } else {
              this.student = updatedStudent;
              this.loadStudentLevel();
              this.showSuccessMessage('Étudiant modifié avec succès.');
            }
          },
          error: (error) => {
            console.error('Error updating student:', error);
            this.showErrorMessage('Erreur lors de la mise à jour de l\'étudiant.');
          },
        });
      } else {
        console.log('Modification annulée.');
      }
    });
  }

  onDisable(): void {
    // Confirmation dialog to disable student
    this.dialog.open(ConfirmationDialogComponent, {
      data:{
        title: "Suppression d'un étudiant",
        message: 'Voulez-vous vraiment supprimer cet étudiant?',
        confirmText: 'Yes, delete',
        cancelText: 'No, cancel',
        confirmColor: 'warn'
      }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.studentService.disableStudent(this.student!.id || -1).subscribe({
          next: (response) => {
            console.log('Student disabled successfully:', response);
            this.showSuccessMessage('Student disabled successfully.'); // Affichez le message de succès
          },
          error: (error) => {
            console.error('Error disabling student:', error);
            this.showErrorMessage('Error disabling student.'); // Affichez le message d'erreur
          }
        });
      }
      else{
        console.log('Operation canceled.');
      }
    });
  }

  openPaymentHistoryDialog(): void {
    this.dialog.open(PaymentHistoryDialogComponent, {
      width: '600px',
      data: { studentId: this.student?.id } // Passer l'ID de l'étudiant pour filtrer les données
    });
  }

  openAttendanceHistoryDialog(): void {
    this.dialog.open(AttendanceHistoryDialogComponent, {
      width: '600px',
      data: { studentId: this.student?.id } // Passer l'ID de l'étudiant pour filtrer les données
    });
  }

  generateFullHistoryPdf(): void {
    if (this.student?.id) {
      this.studentService.getStudentFullHistory(this.student.id).subscribe({
        next: (fullHistory) => {
          console.log('Full History:', fullHistory);
          this.pdfGeneratorService.generateFullHistoryPdf(fullHistory, 'assets/succes_assistance.png');
        },
        error: (error) => {
          console.error('Error fetching full history:', error);
          this.showErrorMessage('Erreur lors de la récupération de l\'historique complet.');
        }
      });
    } else {
      this.showErrorMessage('Étudiant introuvable.');
    }
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-success']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-bar-error']
    });
  }
}