import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group/group';
import { SeriesService } from '../../../services/series.service';

@Component({
  selector: 'app-series-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatIconModule,
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './serie-form.component.html',
  styleUrls: ['./serie-form.component.scss']
})
export class SerieFormComponent implements OnInit {
  seriesForm!: FormGroup;
  groups: Group[] = [];

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.seriesForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      groupId: [null, Validators.required],
      totalSessions: [null, Validators.required]
    });

    this.loadSelectOptions();
  }

  loadSelectOptions(): void {
    this.groupService.getGroups().subscribe(data => this.groups = data);
  }

  onSubmit(): void {
    if (this.seriesForm.valid) {
      const formData = this.seriesForm.value;
      console.log('Submitting:', formData);
      this.seriesService.createSeries(formData).subscribe({
        next: response => {
          console.log('Series created successfully:', response);
          this.seriesForm.reset();
        },
        error: (error: unknown) => {
          if (error instanceof Error) {
            console.error('Failed to create series:', error.message);
          } else {
            console.error('Failed to create series:', error);
          }
        }
      });
    } else {
      console.warn('Form is not valid.');
    }
  }

  onClearForm(): void {
    this.seriesForm.reset();
  }
}
