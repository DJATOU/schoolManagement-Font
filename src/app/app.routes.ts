import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentSearchComponent } from './components/student/student-search/student-search.component';

// app-routing.module.ts (or app.module.ts if that's where your routes are)

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'subscription', component: StudentFormComponent },
    { path: 'student-search', component: StudentSearchComponent } 
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
