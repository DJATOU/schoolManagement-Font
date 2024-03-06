import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LevelFormComponent } from './components/level/level-form/level-form.component';
import { RoomFormComponent } from './components/room/room-form/room-form.component';
import { PricingFormComponent } from './components/pricing/pricing-form/pricing-form.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentSearchComponent } from './components/student/student-search/student-search.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'level/new', component: LevelFormComponent },
    { path: 'room/new', component: RoomFormComponent },
    { path: 'pricing/new', component: PricingFormComponent},
    { path: 'subscription', component: StudentFormComponent },
    { path: 'student', component: StudentSearchComponent },
    { path: 'subject/new', component: SubjectFormComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
