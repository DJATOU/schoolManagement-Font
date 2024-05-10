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

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'level/new', component: LevelFormComponent },
    { path: 'room/new', component: RoomFormComponent },
    { path: 'pricing/new', component: PricingFormComponent},
    { path: 'subscription', component: StudentFormComponent },
    { path: 'student', component: StudentSearchComponent },
    { path: 'subject/new', component: SubjectFormComponent },
    { path: 'teacher/new', component: TeacherFormComponent },
    { path: 'group/new', component: GroupFormComponent },
    { path: 'groupType/new', component: GroupTypeFormComponent },
    { path: 'session/new', component: SessionFormComponent },
    { path: 'calendar/new', component: CalendarComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
