import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Group } from '../../../models/group/group';
import { Level } from '../../../models/level/level';
import { GroupType } from '../../../models/GroupType/groupType';
import { Router } from '@angular/router';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss']
})
export class GroupCardComponent implements OnInit {
  @Input() group!: Group;
  @Input() levels: Level[] = [];
  @Input() groupTypes: GroupType[] = [];

  level: string = 'Unknown Level';
  type: string = 'Unknown Type';
  groupPhotoUrl: string = '';

  constructor(
    private router: Router,
    private groupService: GroupService
  ) {}
  
  ngOnInit(): void {
    this.setLevelAndType();
    this.setPhotoUrl();
  }

  private setLevelAndType(): void {
    const levelData = this.levels.find(level => level.id === this.group.levelId);
    const typeData = this.groupTypes.find(type => type.id === this.group.groupTypeId);

    // Assurez-vous que `levelData` et `typeData` existent avant d'accéder à leurs propriétés
    this.level = levelData?.name || 'Unknown Level';
    this.type = typeData?.name || 'Unknown Type';
  }

  private setPhotoUrl(): void {
    if (this.group.photo && this.group.id) {
      this.groupPhotoUrl = this.groupService.getGroupPhotoUrl(this.group.id);
    }
  }

  navigateToGroupProfile(): void {
    this.router.navigate(['/group', this.group.id]);
  }
}
