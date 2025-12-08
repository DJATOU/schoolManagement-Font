import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Group } from '../../../models/group/group';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent implements OnInit {
  @Input() group!: Group;
  @Input() levels: any[] = [];
  @Input() groupTypes: any[] = [];

  groupPhotoUrl: string = '';
  level: string = '';
  type: string = '';

  constructor(
    private router: Router,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.setPhotoUrl();
    this.setLevelAndType();
  }

  private setPhotoUrl(): void {
    if (this.group.photo && this.group.id) {
      this.groupPhotoUrl = this.groupService.getGroupPhotoUrl(this.group.id);
    }
  }

  private setLevelAndType(): void {
    const foundLevel = this.levels.find(l => l.id === this.group.levelId);
    this.level = foundLevel ? foundLevel.name : 'Unknown';

    const foundType = this.groupTypes.find(t => t.id === this.group.groupTypeId);
    this.type = foundType ? foundType.name : 'Unknown';
  }

  navigateToGroupProfile(): void {
    if (this.group.id) {
      this.router.navigate(['/group', this.group.id]);
    }
  }
}
