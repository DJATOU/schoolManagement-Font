import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../../models/group/group';
import { Student } from '../../../models/student/student';
import { SessionSeries } from '../../../models/sessionSerie/sessionSerie';
import { GroupService } from '../../../services/group.service';
import { AddStudentDialogComponent } from '../../session/add-student-dialog/add-student-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { ProfileListItemComponent } from '../../shared/profile-list-item/profile-list-item.component';
import { StudentListComponent } from "../../student/student-list/student-list.component";

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  standalone: true,
  styleUrls: ['./group-profile.component.scss'],
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon,
    MatList,
    MatListItem,
    CommonModule,
    ProfileListItemComponent,
    StudentListComponent,
    StudentListComponent
]
})
export class GroupProfileComponent implements OnInit {
  group: Group | null = null;
  students: Student[] = [];
  series: SessionSeries[] = [];
  loadingGroup = true;
  loadingStudents = true;
  loadingSeries = true;

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const groupId = this.getGroupIdFromRoute();
    if (groupId) {
      this.loadGroupData(groupId);
      this.loadStudents(groupId);
      this.loadSeries(groupId);
    }
  }

  private getGroupIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

  private loadGroupData(groupId: number): void {
    this.groupService.getGroupDetailsById(groupId).subscribe({
      next: (group) => {
        console.log('Group details:', group);  // Log pour vérifier les données reçues
        this.group = group;
        this.loadingGroup = false;
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.loadingGroup = false;
      }
    });
  }
  

  private loadStudents(groupId: number): void {
    this.groupService.getStudentsByGroupId(groupId).subscribe({
      next: (students: Student[]) => {
        console.log(students);  // Log the students array to check its structure
        this.students = students;
        this.loadingStudents = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loadingStudents = false;
      }
    });
  }
  

  private loadSeries(groupId: number): void {
    this.groupService.getSeriesByGroupId(groupId).subscribe({
      next: (series) => {
        this.series = series;
        this.loadingSeries = false;
      },
      error: (error) => {
        console.error('Error loading series:', error);
        this.loadingSeries = false;
      }
    });
  }

  addStudentToGroup(): void {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '400px',
      data: { groupId: this.group?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.addStudentToGroup(this.group!.id!, result.studentId).subscribe({
          next: () => {
            this.loadStudents(this.group!.id!); // Reload the students list after adding
          },
          error: (error) => {
            console.error('Error adding student to group:', error);
          }
        });
      }
    });
  }


  onEdit(): void {
    // Open edit dialog or navigate to edit form
  }

  onPrint() {
   
  }

  onDisable(){
    
  }
}
