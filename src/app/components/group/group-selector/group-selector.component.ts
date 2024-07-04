import { Component, OnInit, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group/group';

@Component({
  selector: 'app-group-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss']
})
export class GroupSelectorComponent implements OnInit {
  @Input() selectedGroup: FormControl = new FormControl(0);
  groups: Group[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = [{
        id: 0,
        name: 'All Groups',
        groupTypeId: 0,
        levelId: 0,
        subjectId: 0,
        sessionNumberPerSerie: 0,
        priceId: 0,
        teacherId: 0
      }, ...groups];
      if (this.groups[0] && this.groups[0].id !== undefined) {
        this.selectedGroup.setValue(this.groups[0].id);
      }
    });
  }
}
