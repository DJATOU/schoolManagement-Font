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

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'level/new', component: LevelFormComponent },
    { path: 'room/new', component: RoomFormComponent },
    { path: 'pricing/new', component: PricingFormComponent},
    { path: 'subscription', component: StudentFormComponent },
    { path: 'student', component: StudentSearchComponent },
    { path: 'teacher', component: TeacherSearchComponent },  // Ajoutez cette route
    { path: 'subject/new', component: SubjectFormComponent },
    { path: 'teacher/new', component: TeacherFormComponent },
    { path: 'group/new', component: GroupFormComponent },
    { path: 'groupType/new', component: GroupTypeFormComponent },
    { path: 'session/new', component: SessionFormComponent },
    { path: 'calendar/new', component: CalendarComponent },
    { path: 'student/:id', component: StudentProfileComponent },
    { path: 'teacher/:id', component: TeacherProfileComponent},
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
