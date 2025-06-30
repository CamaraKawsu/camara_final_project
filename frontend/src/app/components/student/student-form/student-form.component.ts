import { CommonModule } from '@angular/common'; // For ngIf, ngClass
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // For reactive forms
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // For routing
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { StudentService } from '../../../services/student.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules
  templateUrl: './student-form.component.html',
  styleUrls: [],
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode: boolean = false;
  studentId: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  availableUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private studentService: StudentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.studentId;

    this.initForm();
    this.loadAvailableUsers();

    if (this.isEditMode) {
      this.loadStudentData();
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      userId: ['', Validators.required],
      studentId: ['', Validators.required],
      major: ['', Validators.required],
    });
  }

  loadStudentData(): void {
    if (this.studentId) {
      this.loading = true;
      this.studentService.getStudent(this.studentId).subscribe({
        next: (res) => {
          const student = res.data;
          this.studentForm.patchValue({
            userId: (student.user as User)?._id || student.user,
            studentId: student.studentId,
            major: student.major,
          });
          // Disable user selection in edit mode if a user is already linked
          if (student.user) {
            this.f['userId'].disable();
          }
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load student data.';
          console.error('Error fetching student:', err);
          this.loading = false;
        },
      });
    }
  }

  loadAvailableUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        // Filter users who have the 'student' role in the User collection
        // and are not already linked to an existing student profile.
        // For a simple demo, we'll assume any 'student' role user can be linked.
        // In a real app, you'd check if a user.id is already in an existing student's `user` field.
        this.availableUsers = res.data.filter(
          (user) => user.role === 'student'
        );
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  get f() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.studentForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.loading = true;
    // Re-enable userId before submitting if it was disabled (for edit mode)
    if (this.isEditMode && this.f['userId'].disabled) {
      this.f['userId'].enable();
    }
    const studentData = this.studentForm.value;

    let operation: Observable<any>;
    if (this.isEditMode && this.studentId) {
      operation = this.studentService.updateStudent(
        this.studentId,
        studentData
      );
    } else {
      operation = this.studentService.createStudent(studentData);
    }

    operation.subscribe({
      next: () => {
        this.router.navigate(['/students']);
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
