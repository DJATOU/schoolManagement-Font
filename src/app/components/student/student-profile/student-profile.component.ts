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
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.studentService.getStudentById(id).subscribe(student => {
        this.student = student;
        this.loading = false;

        if (this.student && this.student.id !== undefined) {
          this.levelService.getLevels().subscribe({
            next: (levels) => {
              this.allLevels = levels;
              console.log(this.allLevels);
              let studentLevel= this.allLevels.find(level => level.id?.toString() === student.level);
              this.studentLevelId = studentLevel?.id || -1;
              this.student!.level = studentLevel?.description || '';
              console.log(this.student!.level);
            },
            error: (error) => {
              console.error('Error fetching level:', error);
            }
          });

          this.studentService.getGroupsForStudent(this.student.id).subscribe(groups => {
            this.studentGroups = groups;
          }, error => {
            console.error('Error fetching student groups:', error);
          });
        }
      }, error => {
        console.error('Error fetching student:', error);
      });

      this.groupService.getGroups().subscribe(groups => {
        this.allGroups = groups;
      }, error => {
        console.error('Error fetching groups:', error);
      });

      this.groupTypeService.getAllGroupTypes().subscribe(groupTypes => {
        this.allGroupTypes = groupTypes;
      }, error => {
        console.error('Error fetching group types:', error);
      });
    } else {
      console.error('Invalid student ID');
    }
  }

  onSubmitGroups(): void {
    if (this.groupForm.valid) {
      const groupIds = this.groupForm.value.groupIds;
      if (this.student && this.student.id !== undefined) {
        this.studentService.addGroupsToStudent(this.student.id, groupIds).subscribe({
          next: (response: any) => {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            // Update the studentGroups with the newly added groups
            const newGroups = this.allGroups.filter(group => group.id !== undefined && groupIds.includes(group.id!));
            this.studentGroups = [...this.studentGroups, ...newGroups];

            // Reset the form after submission
            this.groupForm.reset({ groupIds: [] });
          },
          error: (error: any) => {
            if (error.status === 409) {
              const alreadyAssociatedGroups = error.error.alreadyAssociatedGroups || [];
              this.snackBar.open(`Some groups were already associated with the student: ${alreadyAssociatedGroups.join(', ')}`, 'Close', {
                duration: 3000,
                panelClass: ['warning-snackbar']
              });
            } else if (error.status === 404) {
              this.snackBar.open('Student or group not found', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            } else {
              this.snackBar.open('Error adding groups to student', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          }
        });
      } else {
        console.error('Student ID is undefined');
      }
    }
  }

  openPaymentDialog(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '400px',
      data: { groups: this.studentGroups }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the payment submission
        console.log('Payment data:', result);
        this.submitPayment(result);
      }
    });
  }

  openGroupDialog(): void {
    let possibleGroups = this.allGroups.filter(group => group.levelId === this.studentLevelId);
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '400px',
      data: {
        allGroups: possibleGroups,
        selectedGroups: this.groupForm.value.groupIds 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the group selection
        this.groupForm.patchValue({ groupIds: result });
        this.onSubmitGroups();
      }
    });
  }

  submitPayment(paymentData: any): void {
    // Implement the API call to submit the payment data
    console.log('Submitting payment data:', paymentData);
    // Example API call:
    // this.paymentService.addPayment(paymentData).subscribe(response => {
    //   this.snackBar.open('Payment added successfully', 'Close', {
    //     duration: 3000,
    //     panelClass: ['success-snackbar']
    //   });
    // }, error => {
    //   this.snackBar.open('Error adding payment', 'Close', {
    //     duration: 3000,
    //     panelClass: ['error-snackbar']
    //   });
    // });
  }

  onEdit(): void {
    // Open edit dialog or navigate to edit form
  }

  onDisable(): void {
    // Implement delete functionality
  }

  onPrint(): void {
    window.print();
  }
}
