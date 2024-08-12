import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GroupType } from '../../../models/GroupType/groupType';
import { Group } from '../../../models/group/group';
import { Level } from '../../../models/level/level';
import { Student } from '../../../models/student/student';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { GroupService } from '../../../services/group.service';
import { LevelService } from '../../../services/level.service';
import { StudentService } from '../../../services/student.service';
import { GroupCardComponent } from '../../group/group-card/group-card.component';
import { GroupDialogComponent } from '../../group/group-dialog/group-dialog.component';
import { PaymentDialogComponent } from '../../payment/payment-dialog/payment-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ApiError, ApiResponse } from '../../../models/response';

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
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    GroupCardComponent,
    PaymentDialogComponent,
    GroupDialogComponent
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  providers: [StudentService, GroupService, LevelService, GroupTypeService]
})
export class StudentProfileComponent implements OnInit {
  student: Student | null = null;
  allGroups: Group[] = [];
  allGroupTypes: GroupType[] = [];
  allLevels: Level[] = [];
  studentGroups: Group[] = [];
  studentLevelId: number = -1;
  groupForm: FormGroup;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private groupService: GroupService,
    private groupTypeService: GroupTypeService,
    private levelService: LevelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
  }

  private getStudentIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

  private loadStudentData(studentId: number): void {
    this.studentService.getStudentById(studentId).subscribe({
      next: student => {
        this.student = student;
        this.loading = false;
        this.loadStudentLevel();
        this.loadStudentGroups();
      },
      error: () => {
        this.loading = false;
        this.showError(errorMessages.STUDENT_NOT_FOUND);
      }
    });

    this.loadAllGroups();
    this.loadAllGroupTypes();
  }

  private loadStudentLevel(): void {
    if (this.student?.id !== undefined) {
      this.levelService.getLevels().subscribe({
        next: levels => {
          this.allLevels = levels;
          const studentLevel = this.allLevels.find(level => level.id?.toString() === this.student?.level);
          this.studentLevelId = studentLevel?.id || -1;
          
          if (this.student) {
            this.student.level = studentLevel?.description ?? '';
          }
        },
        error: () => {
          this.showError(errorMessages.GENERIC_ERROR);
        }
      });
    }
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
    if (this.student?.id && this.studentGroups.length > 0) {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        width: '400px',
        data: {
          studentId: this.student.id,
          groups: this.studentGroups
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.submitPayment(result);
        }
      });
    } else {
      this.showError('The student must be enrolled in at least one group to proceed with the payment.');
    }
  }

  openGroupDialog(): void {
    console.log('All groups:', this.allGroups);
    
    const possibleGroups = this.allGroups.filter(group => group.levelId === this.studentLevelId);
  
    if (possibleGroups.length === 0) {
      this.showError(errorMessages.INVALID_GROUP_LEVEL);
      return;
    }
  
    console.log('Possible groups for level:', possibleGroups);
  
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '400px',
      data: {
        allGroups: possibleGroups,
        selectedGroups: this.groupForm.value.groupIds
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupForm.patchValue({ groupIds: result });
        this.onSubmitGroups();
      }
    });
  }
  
  submitPayment(paymentData: any): void {
    console.log('Submitting payment data:', paymentData);
    // Implement the API call to submit the payment data
    // this.paymentService.addPayment(paymentData).subscribe({
    //   next: response => {
    //     this.snackBar.open('Payment added successfully', 'Close', {
    //       duration: 3000,
    //       panelClass: ['success-snackbar']
    //     });
    //   },
    //   error: (error: ApiError) => {
    //     this.handlePaymentError(error);
    //   }
    // });
  }

 

  onEdit(): void {
    // Open edit dialog or navigate to edit form
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
  
  onPrint(): void {
    window.print();
  }
}
