import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { GroupType } from '../../../models/GroupType/groupTyp';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';


@Component({
  selector: 'app-group-type-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    MatToolbar
  ],
  templateUrl: './group-type-form.component.html',
  styleUrls: ['./group-type-form.component.scss']
})
export class GroupTypeFormComponent {
  groupTypeForm = this.fb.group({
    name: ['', Validators.required],
    size: ['', [Validators.required, Validators.min(1)]]
  });

  constructor(private fb: FormBuilder, private groupTypeService: GroupTypeService) { }

  onSubmit(): void {
    if (this.groupTypeForm.valid) {
      const formValue = this.groupTypeForm.value;
      const groupType: GroupType = {
        name: formValue.name ?? '',
        size: formValue.size ? parseInt(formValue.size) : 0
      };
      console.log(groupType);
      this.groupTypeService.createGroupType(groupType).subscribe({
        next: (groupType) => {
          console.log('Group type created:', groupType);
          // Handle successful response
        },
        error: (error) => {
          console.error('Error creating group type:', error);
          // Handle error response
        }
      });
    } else {
      console.warn('Form is not valid');
    }
  }

  onClearForm() {
    this.groupTypeForm.reset();
  }
}
