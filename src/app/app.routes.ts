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

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'calendar/new', component: CalendarComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'group', component: GroupSearchComponent },
    { path: 'group/:id', component: TeacherProfileComponent},
    { path: 'group/new', component: GroupFormComponent },
    { path: 'groupType/new', component: GroupTypeFormComponent },
    { path: 'level/new', component: LevelFormComponent },
    { path: 'pricing/new', component: PricingFormComponent},
    { path: 'room/new', component: RoomFormComponent },
    { path: 'session/new', component: SessionFormComponent },
    { path: 'serie/new', component: SerieFormComponent },
    { path: 'student', component: StudentSearchComponent },
    { path: 'student/:id', component: StudentProfileComponent },
    { path: 'subscription', component: StudentFormComponent },
    { path: 'subject/new', component: SubjectFormComponent },
    { path: 'teacher', component: TeacherSearchComponent },
    { path: 'teacher/:id', component: TeacherProfileComponent},
    { path: 'teacher/new', component: TeacherFormComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
