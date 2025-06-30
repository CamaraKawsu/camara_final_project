import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf, ngFor
import { RouterLink } from '@angular/router'; // For routerLink
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';
import { AuthService } from '../../../services/auth.service'; // To check user roles
import { User } from '../../../models/user.model';

export interface IStudent {
  _id: string;
  studentId: string;
  major: string;
  user: User;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.component.html',
  styleUrls: [],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  currentUser: User | null = null;

  constructor(
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getStudents();
  }

  getStudents(): void {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (res) => {
        this.students = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load students.';
        console.error('Error fetching students:', err);
        this.loading = false;
      },
    });
  }

  deleteStudent(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this student? This will also delete their associated user account if it was created for them.'
      )
    ) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter((s) => s._id !== id);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete student.';
          console.error('Error deleting student:', err);
        },
      });
    }
  }

  canAddOrDeleteStudent(): boolean {
    return this.currentUser?.role === 'admin';
  }

  canEditStudent(): boolean {
    return this.currentUser?.role === 'admin'; // Only admin can edit student profiles
  }
}
