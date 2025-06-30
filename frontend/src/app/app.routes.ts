import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseFormComponent } from './components/course/course-form/course-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Student Routes (Protected by AuthGuard and RoleGuard)
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },
  {
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'students/edit/:id',
    component: StudentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  }, // Student edit for admin only

  // Course Routes (Protected by AuthGuard and RoleGuard for CUD)
  { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
  {
    path: 'courses/new',
    component: CourseFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },
  {
    path: 'courses/edit/:id',
    component: CourseFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },

  // Wildcard route for 404
  { path: '**', redirectTo: '' },
];
