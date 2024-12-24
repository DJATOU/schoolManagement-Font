import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Group } from '../../../models/group/group';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LevelService } from '../../../services/level.service';
import { Level } from '../../../models/level/level';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { GroupType } from '../../../models/GroupType/groupType';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.scss']
})
export class EditGroupDialogComponent implements OnInit {
  editGroupForm!: FormGroup;
  levels: Level[] = [];
  groupTypes: GroupType[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: Group },
    private fb: FormBuilder,
    private levelService: LevelService,
    private groupTypeService: GroupTypeService
  ) {}

  ngOnInit(): void {
    this.editGroupForm = this.fb.group({
      name: [this.data.group.name],
      description: [this.data.group.description],
      levelId: [this.data.group.levelId],
      groupTypeId: [this.data.group.groupTypeId],
      subjectId: [this.data.group.subjectId],
      sessionNumberPerSerie: [this.data.group.sessionNumberPerSerie],
      priceAmount: [this.data.group.priceAmount],
      teacherId: [this.data.group.teacherId],
    });

    this.loadLevels();
    this.loadGroupTypes();
    // Chargez les sujets et les enseignants si nécessaire
  }

  loadLevels(): void {
    this.levelService.getLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
      },
      error: (error) => {
        console.error('Error loading levels:', error);
      },
    });
  }

  loadGroupTypes(): void {
    this.groupTypeService.getAllGroupTypes().subscribe({
      next: (groupTypes) => {
        this.groupTypes = groupTypes;
      },
      error: (error) => {
        console.error('Error loading group types:', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formValues = this.editGroupForm.value;
    const updatedGroup: Group = { ...this.data.group };

    (Object.keys(formValues) as Array<keyof Group>).forEach((key) => {
      const value = formValues[key];
      if (value !== undefined) {
        (updatedGroup as any)[key] = value;
      }
    });

    console.log('Updated group:', updatedGroup);
    this.dialogRef.close(updatedGroup);
  }
}
