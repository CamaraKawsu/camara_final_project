import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { InstructorService } from '../../../services/instructor.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-instructor-form',
  templateUrl: './instructor-form.component.html',
  styleUrls: [],
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
})
export class InstructorFormComponent implements OnInit {
  instructorForm!: FormGroup;
  isEditMode: boolean = false;
  instructorId: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  availableUsers: User[] = []; // Users who are not yet students or instructors

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private instructorService: InstructorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.instructorId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.instructorId;

    this.initForm();
    this.loadAvailableUsers();

    if (this.isEditMode) {
      this.loadInstructorData();
    }
  }

  initForm(): void {
    this.instructorForm = this.fb.group({
      userId: ['', Validators.required],
      employeeId: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  loadInstructorData(): void {
    if (this.instructorId) {
      this.loading = true;
      this.instructorService.getInstructor(this.instructorId).subscribe({
        next: (res) => {
          const instructor = res.data;
          this.instructorForm.patchValue({
            userId: (instructor.user as User)?._id || instructor.user,
            employeeId: instructor.employeeId,
            department: instructor.department,
          });
          if (instructor.user) {
            this.f['userId'].disable();
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load instructor data.';
          console.error('Error fetching instructor:', err);
          this.loading = false;
        },
      });
    }
  }

  loadAvailableUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.availableUsers = res.data.filter(
          (user) => user.role === 'instructor'
        ); // Assuming only 'instructor' role users can become instructor profiles
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  get f() {
    return this.instructorForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.instructorForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.loading = true;
    if (this.isEditMode && this.f['userId'].disabled) {
      this.f['userId'].enable();
    }
    const instructorData = this.instructorForm.value;

    let operation: Observable<any>;
    if (this.isEditMode && this.instructorId) {
      operation = this.instructorService.updateInstructor(
        this.instructorId,
        instructorData
      );
    } else {
      operation = this.instructorService.createInstructor(instructorData);
    }

    operation.subscribe({
      next: () => {
        this.router.navigate(['/instructors']);
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
