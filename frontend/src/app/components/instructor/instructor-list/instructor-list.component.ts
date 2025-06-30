import { Component, OnInit } from '@angular/core';
import { InstructorService } from '../../../services/instructor.service';
import { Instructor } from '../../../models/instructor.model';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: [],
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
})
export class InstructorListComponent implements OnInit {
  instructors: Instructor[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors(): void {
    this.loading = true;
    this.instructorService.getInstructors().subscribe({
      next: (res) => {
        this.instructors = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load instructors.';
        console.error('Error fetching instructors:', err);
        this.loading = false;
      },
    });
  }

  deleteInstructor(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this instructor? This will unassign them from any courses.'
      )
    ) {
      this.instructorService.deleteInstructor(id).subscribe({
        next: () => {
          this.instructors = this.instructors.filter((i) => i._id !== id);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete instructor.';
          console.error('Error deleting instructor:', err);
        },
      });
    }
  }
}
