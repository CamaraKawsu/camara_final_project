import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentDetailComponent } from './components/student/student-detail/student-detail.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseDetailComponent } from './components/course/course-detail/course-detail.component';
import { CourseFormComponent } from './components/course/course-form/course-form.component';
import { InstructorListComponent } from './components/instructor/instructor-list/instructor-list.component';
import { InstructorDetailComponent } from './components/instructor/instructor-detail/instructor-detail.component';
import { InstructorFormComponent } from './components/instructor/instructor-form/instructor-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
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
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor', 'student'] },
  },
  {
    path: 'students/edit/:id',
    component: StudentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'student'] },
  },

  // Course Routes (Protected by AuthGuard and RoleGuard for CUD)
  { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
  {
    path: 'courses/new',
    component: CourseFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'courses/edit/:id',
    component: CourseFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },

  // Instructor Routes (Protected by AuthGuard and RoleGuard)
  {
    path: 'instructors',
    component: InstructorListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'instructors/new',
    component: InstructorFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'instructors/:id',
    component: InstructorDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },
  {
    path: 'instructors/edit/:id',
    component: InstructorFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'instructor'] },
  },

  // Wildcard route for 404 (optional)
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
