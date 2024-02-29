import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentSearchComponent } from './components/student/student-search/student-search.component';
import { LevelFormComponent } from './components/level/level-form/level-form.component';
import { RoomFormComponent } from './components/room/room-form/room-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'subscription', component: StudentFormComponent },
    { path: 'student', component: StudentSearchComponent },
    { path: 'level/new', component: LevelFormComponent },
    { path: 'room/new', component: RoomFormComponent } 
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
