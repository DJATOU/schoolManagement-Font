import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from '../../../services/group.service';
import { PricingService } from '../../../services/pricing.service';
import { Pricing } from '../../../models/pricing/pricing';
import { GroupType } from '../../../models/GroupType/groupType';
import { Level } from '../../../models/level/level';
import { Subject } from '../../../models/subject/subject';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { LevelService } from '../../../services/level.service';
import { SubjectService } from '../../../services/subject.service';
import { Teacher } from '../../../models/teacher/teacher';
import { TeacherService } from '../../../services/teacher.service';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatSnackBarModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
  providers: [GroupService]
})
export class GroupFormComponent implements OnInit {
  groupForm!: FormGroup;
  prices: Pricing[] = [];
  groupTypes: GroupType[] = [];
  levels: Level[] = [];
  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private priceService: PricingService,
    private groupTypeService: GroupTypeService,
    private levelService: LevelService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      basicInformation: this.fb.group({
        name: ['', Validators.required],
        groupTypeId: [null, Validators.required],
        levelId: [null, Validators.required],
        subjectId: [null, Validators.required],
      }),
      additionalDetails: this.fb.group({
        sessionNumberPerSerie: [null, Validators.required],
        priceId: [null, Validators.required],
        description: [''],
        teacherId: [null, Validators.required]
      })
    });
  
    this.loadSelectOptions();
  }
  

  loadSelectOptions(): void {
    this.groupTypeService.getAllGroupTypes().subscribe(data => this.groupTypes = data);
    this.levelService.getLevels().subscribe(data => this.levels = data);
    this.subjectService.getSubjects().subscribe(data => this.subjects = data);
    this.priceService.getPricings().subscribe(data => this.prices = data);
    this.teacherService.getTeachers().subscribe(data => this.teachers = data);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  flattenFormData(data: any, parentKey: string = ''): { label: string, value: any }[] {
    let result: { label: string, value: any }[] = [];
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey} - ${key}` : key;
      const value = data[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result = result.concat(this.flattenFormData(value, newKey));
      } else if (Array.isArray(value)) {
        result.push({ label: newKey, value: value.join(', ') });
      } else {
        result.push({ label: newKey, value: value });
      }
    });
    return result;
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = {
        basicInformation: {
          name: this.groupForm.get('basicInformation.name')?.value,
          groupTypeId: this.getGroupNameById(this.groupForm.get('basicInformation.groupTypeId')?.value),
          levelId: this.getLevelNameById(this.groupForm.get('basicInformation.levelId')?.value),
          subjectId: this.getSubjectNameById(this.groupForm.get('basicInformation.subjectId')?.value),
        },
        additionalDetails: {
          sessionNumberPerSerie: this.groupForm.get('additionalDetails.sessionNumberPerSerie')?.value,
          priceId: this.getPriceById(this.groupForm.get('additionalDetails.priceId')?.value),
          description: this.groupForm.get('additionalDetails.description')?.value,
          teacherId: this.getTeacherNameById(this.groupForm.get('additionalDetails.teacherId')?.value)
        }
      };
  
      const flattenedData = this.flattenFormData(formData);
      console.log('Form Data:', formData);
      console.log('Flattened Data:', flattenedData);
  
      const dialogRef = this.dialog.open(SummaryDialogComponent, {
        data: flattenedData
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const formDataToSubmit = new FormData();
          
          Object.keys(this.groupForm.value).forEach(groupKey => {
            const fieldGroup = this.groupForm.get(groupKey) as FormGroup;
            Object.keys(fieldGroup.controls).forEach(key => {
              const value = fieldGroup.get(key)?.value;
              formDataToSubmit.append(key, value);
            });
          });
          this.groupService.createGroup(formDataToSubmit).subscribe({
            next: (response) => {
              console.log('Group created:', response);

              // Upload photo si sélectionnée
              if (this.selectedFile && response.id) {
                this.groupService.uploadGroupPhoto(response.id, this.selectedFile).subscribe({
                  next: (filename) => {
                    console.log('Photo uploaded:', filename);
                    this.onClearForm();
                    this.showSuccessMessage('Group created successfully with photo.');
                  },
                  error: (error) => {
                    console.error('Error uploading photo:', error);
                    this.onClearForm();
                    this.showErrorMessage('Group created but photo upload failed.');
                  }
                });
              } else {
                this.onClearForm();
                this.showSuccessMessage('Group created successfully.');
              }
            },
            error: (error) => {
              console.error('Error creating group:', error);
              this.showErrorMessage('Error creating group.');
            }
          });
        } else {
          console.warn('Form submission was cancelled.');
        }
      });
    } else {
      console.warn('The form is not valid.');
      this.showErrorMessage('The form is not valid.');
    }
  }
  
  getGroupNameById(id: number): string {
    const groupType = this.groupTypes.find(type => type.id === id);
    return groupType ? groupType.name : '';
  }
  
  getLevelNameById(id: number): string {
    const level = this.levels.find(level => level.id === id);
    return level ? level.name : '';
  }
  
  getSubjectNameById(id: number): string {
    const subject = this.subjects.find(subject => subject.id === id);
    return subject ? subject.name : '';
  }
  
  getPriceById(id: number): string {
    const price = this.prices.find(price => price.id === id);
    return price ? `${price.price}` : '';
  }
  
  getTeacherNameById(id: number): string {
    const teacher = this.teachers.find(teacher => teacher.id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
  }
  

  onClearForm(): void {
    this.groupForm.reset();
    this.selectedFile = null;
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
