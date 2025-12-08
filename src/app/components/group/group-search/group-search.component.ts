import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../../services/group.service';
import { LevelService } from '../../../services/level.service';
import { GroupTypeService } from '../../../services/GroupTypeService';
import { Group } from '../../../models/group/group';
import { Level } from '../../../models/level/level';
import { GroupType } from '../../../models/GroupType/groupType';
import { CommonModule } from '@angular/common';
import { GroupCardComponent } from '../group-card/group-card.component';
import { GroupListComponent } from '../group-list/group-list.component';
import { SearchService } from '../../../services/SearchService ';


@Component({
  selector: 'app-group-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,

// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    CommonModule,
    GroupCardComponent,
    GroupListComponent
  ],
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.scss']
})
export class GroupSearchComponent implements OnInit {
  searchForm!: FormGroup;
  groups: Group[] = [];
  levels: Level[] = [];
  groupTypes: GroupType[] = [];
  filteredGroups: Group[] = [];
  currentPageGroups: Group[] = [];
  totalGroups: number = 0;
  pageSize: number = 8;
  pageSizeOptions: number[] = [4, 8];
  viewMode: 'card' | 'list' = 'card';
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private levelService: LevelService,
    private groupTypeService: GroupTypeService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    this.loadSelectOptions();
    this.listenToSearchEvents();
    this.loadAllGroups();
  }

  loadSelectOptions(): void {
    this.levelService.getLevels().subscribe(data => this.levels = data);
    this.groupTypeService.getAllGroupTypes().subscribe(data => this.groupTypes = data);
  }

  listenToSearchEvents(): void {
    this.searchService.getSearch().subscribe((searchTerm: string) => {
      this.handleSearch(searchTerm);
    });
  }

  handleSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.loadAllGroups();
    } else {
      this.groupService.searchGroupsByNameStartingWith(searchTerm).subscribe(groups => {
        if (groups.length === 1) {
          this.router.navigate(['/group', groups[0].id]);
        } else {
          this.filteredGroups = groups;
          this.updatePageGroups();
        }
      });
    }
  }

  loadAllGroups(): void {
    this.isLoading = true;
    this.groupService.getGroups().subscribe(groups => {
      this.filteredGroups = groups;
      this.totalGroups = groups.length;
      this.updatePageGroups();
      this.isLoading = false;
    });
  }

  changePage(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.currentPageGroups = this.filteredGroups.slice(startIndex, endIndex);
  }

  changeViewMode(mode: 'card' | 'list'): void {
    this.viewMode = mode;
  }

  private updatePageGroups(): void {
    this.totalGroups = this.filteredGroups.length;
    this.currentPageGroups = this.filteredGroups.slice(0, this.pageSize);
  }
}
