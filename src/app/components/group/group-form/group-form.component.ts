import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOption, NativeDateAdapter } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GroupService } from '../../../services/group.service';
import { PricingService } from '../../../services/pricing.service';
import { Pricing } from '../../../models/pricing/pricing';
import { CommonModule } from '@angular/common';
import { GroupType } from '../../../models/GroupType/groupTyp';
import { Level } from '../../../models/level/level';
import { Subject } from '../../../models/subject/subject';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { LevelService } from '../../../services/level.service';
import { SubjectService } from '../../../services/subject.service';
import { Teacher } from '../../../models/teacher/teacher';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    HttpClientModule,
    MatNativeDateModule,
    RouterModule,
    MatStepperModule,
    MatIconModule,
    MatOption,
    MatSelectModule,
    MatTabsModule, 
    CommonModule
  ],
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
  providers: [
    GroupService,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'us-US' },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    }
  ]
})

export class GroupFormComponent implements OnInit {
  groupForm!: FormGroup;
  prices: Pricing[] = [];
  groupTypes: GroupType[] = [];
  levels: Level[] = [];
  subjects: Subject[] = [];
  teachers: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private priceService: PricingService,
    private groupTypeService: GroupTypeService,
    private levelService: LevelService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
  ) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      groupTypeId: [null, Validators.required],
      levelId: [null, Validators.required],
      subjectId: [null, Validators.required],
      sessionNumberPerSerie: [null, Validators.required],
      priceId: [null, Validators.required],
      description: [''],
      teacherId: [null, Validators.required],
    });

    this.loadSelectOptions();

  }

  loadSelectOptions(): void {
    this.groupTypeService.getAllGroupTypes().subscribe(data => this.groupTypes = data);
    this.levelService.getLevels().subscribe(data => this.levels = data);
    this.subjectService.getSubjects().subscribe(data => this.subjects = data);
    this.priceService.getPricings().subscribe(data => this.prices = data);
    this.teacherService.getTeachers().subscribe(
      data => {
        this.teachers = data;
        console.log('Fetched teachers:', this.teachers); // Log the fetched teachers data
        // Optionally log individual teacher ids if needed
        this.teachers.forEach(teacher => console.log('Teacher ID:', teacher.id));
      },
      error => console.error('Error fetching teachers:', error)
    );
  }


  onSubmit(): void {
    if (this.groupForm.valid) {
      this.groupService.createGroup(this.groupForm.value).subscribe({
        next: (response) => {
          console.log('Group created:', response);
          this.onClearForm();
        },
        error: (error) => {
          console.error('Error creating group:', error);
        }
      });
    } else {
      console.warn('The form is not valid.');
    }
  }
  
  
  onClearForm(): void {
    this.groupForm.reset();
  }
}
