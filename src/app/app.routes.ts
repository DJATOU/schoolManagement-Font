import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentSearchComponent } from './components/student/student-search/student-search.component';
import { LevelListComponent } from './components/level/level-list/level-list.component';
import { LevelFormComponent } from './components/level/level-form/level-form.component';
import { LevelSearchComponent } from './components/level/level-search/level-search.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'subscription', component: StudentFormComponent },
    { path: 'students', component: StudentSearchComponent },
    { path: 'level/new', component: LevelFormComponent },
    { path: 'level/list', component: LevelListComponent },
    { path: 'level/search', component: LevelSearchComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
