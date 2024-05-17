import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from '../../../services/student.service';
import { GroupService } from '../../../services/group.service';
import { Student } from '../../../models/student/student';
import { Group } from '../../../models/group/group';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  providers: [StudentService, GroupService]
})
export class StudentProfileComponent implements OnInit {
  student: Student | null = null;
  groups: Group[] = [];
  groupForm: FormGroup;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar // Inject MatSnackBar
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
      }, error => {
        console.error('Error fetching student:', error);
      });

      this.groupService.getGroups().subscribe(groups => {
        this.groups = groups;
      }, error => {
        console.error('Error fetching groups:', error);
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
          next: () => {
            this.snackBar.open('Groups added to student successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            if (error.status === 409) { // Assuming 409 Conflict for already existing association
              this.snackBar.open('Some groups were already associated with the student', 'Close', {
                duration: 3000,
                panelClass: ['warning-snackbar']
              });
            } else if (error.status === 404) { // Not Found
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
            console.error('Error adding groups to student:', error);
          }
        });
      } else {
        console.error('Student ID is undefined');
      }
    }
  }
  

  onEdit(): void {
    // Open edit dialog or navigate to edit form
  }

  onDelete(): void {
    // Implement delete functionality
  }
}
