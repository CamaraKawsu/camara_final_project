import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../../services/instructor.service';
import { Instructor } from '../../../models/instructor.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructor-detail',
  templateUrl: './instructor-detail.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class InstructorDetailComponent implements OnInit {
  instructor: Instructor | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  currentUser: User | null = null;
  availableCourses: Course[] = [];
  selectedCourseId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private instructorService: InstructorService,
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getInstructorDetails();
    this.getAvailableCourses();
  }

  getInstructorDetails(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.instructorService.getInstructor(id).subscribe({
        next: (res) => {
          this.instructor = res.data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load instructor details.';
          console.error('Error fetching instructor details:', err);
          this.loading = false;
        },
      });
    } else {
      this.errorMessage = 'Instructor ID not provided.';
      this.loading = false;
    }
  }

  getAvailableCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.availableCourses = res.data;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  assignCourse(): void {
    if (!this.instructor || !this.selectedCourseId) {
      this.errorMessage = 'Please select a course to assign.';
      return;
    }

    this.instructorService
      .assignCourseToInstructor(this.instructor._id, this.selectedCourseId)
      .subscribe({
        next: () => {
          alert('Course assigned successfully!');
          this.getInstructorDetails(); // Refresh instructor details
          this.selectedCourseId = ''; // Clear selection
        },
        error: (err) => {
          this.errorMessage = err.error?.msg || 'Failed to assign course.';
          console.error('Error assigning course:', err);
        },
      });
  }

  canEditOrDelete(): boolean {
    return (
      this.currentUser?.role === 'admin' ||
      (this.currentUser?.role === 'instructor' &&
        (this.instructor?.user as any)?.id === this.currentUser?._id)
    );
  }
}
