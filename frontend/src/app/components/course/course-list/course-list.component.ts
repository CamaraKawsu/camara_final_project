import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-list.component.html',
  styleUrls: [],
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  currentUser: User | null = null;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getCourses();
  }

  getCourses(): void {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.courses = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses.';
        console.error('Error fetching courses:', err);
        this.loading = false;
      },
    });
  }

  deleteCourse(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this course? This will also remove it from any enrolled students.'
      )
    ) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter((c) => c._id !== id);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete course.';
          console.error('Error deleting course:', err);
        },
      });
    }
  }

  canManageCourses(): boolean {
    return (
      this.currentUser?.role === 'admin' ||
      this.currentUser?.role === 'instructor'
    );
  }
}
