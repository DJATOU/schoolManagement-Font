import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group/group';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss']
})
export class GroupDialogComponent implements OnInit, AfterViewInit {
  groupForm: FormGroup;
  allGroups: Group[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupForm = this.fb.group({
      groupIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.allGroups = groups;
    }, error => {
      console.error('Error fetching groups:', error);
    });
  }

  ngAfterViewInit(): void {
    gsap.from('.group-dialog-content', { duration: 0.8, y: -100, opacity: 0, ease: 'bounce' });
    gsap.from('.group-dialog-actions', { duration: 0.8, y: 100, opacity: 0, ease: 'bounce' });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      this.dialogRef.close(this.groupForm.value.groupIds);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
