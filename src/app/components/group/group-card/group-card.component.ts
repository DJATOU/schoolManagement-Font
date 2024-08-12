import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Group } from '../../../models/group/group';
import { Level } from '../../../models/level/level';
import { GroupType } from '../../../models/GroupType/groupType';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss']
})
export class GroupCardComponent implements OnInit {
  @Input() group!: Group;
  @Input() levels: Level[] = [];
  @Input() groupTypes: GroupType[] = [];

  level: string = 'Unknown Level';
  type: string = 'Unknown Type';

  ngOnInit(): void {
    const levelData = this.levels.find(level => level.id === this.group.levelId);
    const typeData = this.groupTypes.find(type => type.id === this.group.groupTypeId);

    this.level = levelData ? levelData.name : 'Unknown Level';
    this.type = typeData ? typeData.name : 'Unknown Type';
  }
}
