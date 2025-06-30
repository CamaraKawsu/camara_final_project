import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Instructor } from '../../../models/instructor.model'; // You might need this if you implement instructors
import { CourseService } from '../../../services/course.service';
import { InstructorService } from '../../../services/instructor.service'; // You might need this if you implement instructors

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: [],
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode: boolean = false;
  courseId: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  availableInstructors: Instructor[] = []; // Only if you implement instructor assignment

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private courseService: CourseService,
    private instructorService: InstructorService // Inject if needed
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;

    this.initForm();
    this.loadAvailableInstructors(); // Load if assigning instructors to courses

    if (this.isEditMode) {
      this.loadCourseData();
    }
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      courseCode: ['', Validators.required],
      description: ['', Validators.required],
      credits: [
        '',
        [Validators.required, Validators.min(1), Validators.max(6)],
      ],
      instructorId: [''], // Optional field for assigning an instructor
    });
  }

  loadCourseData(): void {
    if (this.courseId) {
      this.loading = true;
      this.courseService.getCourse(this.courseId).subscribe({
        next: (res) => {
          const course = res.data;
          this.courseForm.patchValue({
            title: course.title,
            courseCode: course.courseCode,
            description: course.description,
            credits: course.credits,
            instructorId: (course.instructor as any)?._id || '', // Handle populated or unpopulated instructor
          });
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load course data.';
          console.error('Error fetching course:', err);
          this.loading = false;
        },
      });
    }
  }

  loadAvailableInstructors(): void {
    this.instructorService.getInstructors().subscribe({
      next: (res) => {
        this.availableInstructors = res.data;
      },
      error: (err) => {
        console.error('Error fetching instructors:', err);
      },
    });
  }

  get f() {
    return this.courseForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.courseForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.loading = true;
    const courseData = { ...this.courseForm.value };

    // Backend expects 'instructor' field (as ID), not 'instructorId'
    if (courseData.instructorId) {
      courseData.instructor = courseData.instructorId;
    } else {
      courseData.instructor = null; // Explicitly send null if no instructor selected
    }
    delete courseData.instructorId; // Remove instructorId as backend expects 'instructor'

    let operation: Observable<any>;
    if (this.isEditMode && this.courseId) {
      operation = this.courseService.updateCourse(this.courseId, courseData);
    } else {
      operation = this.courseService.createCourse(courseData);
    }

    operation.subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.msg || 'Operation failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
