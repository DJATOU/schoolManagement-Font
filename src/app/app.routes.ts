import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LevelFormComponent } from './components/level/level-form/level-form.component';
import { RoomFormComponent } from './components/room/room-form/room-form.component';
import { PricingFormComponent } from './components/pricing/pricing-form/pricing-form.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentSearchComponent } from './components/student/student-search/student-search.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { TeacherFormComponent } from './components/teacher/teacher-form/teacher-form.component';
import { GroupFormComponent } from './components/group/group-form/group-form.component';
import { GroupTypeFormComponent } from './components/groupType/group-type-form/group-type-form.component';
import { SessionFormComponent } from './components/session/session-form/session-form.component';
import { CalendarComponent } from './components/session/calendar/calendar.component';
import { StudentProfileComponent } from './components/student/student-profile/student-profile.component';
import { TeacherProfileComponent } from './components/teacher/teacher-profile/teacher-profile.component';
import { TeacherSearchComponent } from './components/teacher/teacher-search/teacher-search.component';
import { GroupSearchComponent } from './components/group/group-search/group-search.component';
import { SerieFormComponent } from './components/serie/serie-form/serie-form.component';
import { LevelTableComponent } from './components/level/level-table/level-table.component';
import { RoomTableComponent } from './components/room/room-table/room-table.component';
import { SubjectTableComponent } from './components/subject/subject-table/subject-table.component';
import { GroupTypeTableComponent } from './components/groupType/group-type-table/group-type-table.component';
import { PricingTableComponent } from './components/pricing/pricing-table/pricing-table.component';
import { GroupProfileComponent } from './components/group/group-profile/group-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'subscription', component: StudentFormComponent },
  { path: 'student', component: StudentSearchComponent },
  { path: 'teacher', component: TeacherSearchComponent },
  { path: 'group', component: GroupSearchComponent },
  { path: 'level/new', component: LevelFormComponent },
  { path: 'room/new', component: RoomFormComponent },
  { path: 'pricing/new', component: PricingFormComponent},
  { path: 'subject/new', component: SubjectFormComponent },
  { path: 'teacher/new', component: TeacherFormComponent },
  { path: 'teacher/edit/:id', component: TeacherFormComponent },
  { path: 'group/new', component: GroupFormComponent },
  { path: 'group/edit/:id', component: GroupFormComponent },
  { path: 'groupType/new', component: GroupTypeFormComponent },
  { path: 'session/new', component: SessionFormComponent },
  { path: 'serie/new', component: SerieFormComponent },
  { path: 'calendar/new', component: CalendarComponent },
  { path: 'level/table', component: LevelTableComponent},
  { path: 'room/table', component: RoomTableComponent},
  { path: 'subject/table', component: SubjectTableComponent},
  { path: 'groupType/table', component: GroupTypeTableComponent},
  { path: 'pricing/table', component: PricingTableComponent},
  { path: 'student/:id', component: StudentProfileComponent },
  { path: 'teacher/:id', component: TeacherProfileComponent},
  { path: 'group/:id', component: GroupProfileComponent},
];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
