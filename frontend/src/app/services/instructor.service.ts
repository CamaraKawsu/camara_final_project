import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private apiUrl = `${environment.apiUrl}/instructors`;

  constructor(private http: HttpClient) {}

  getInstructors(): Observable<{
    success: boolean;
    count: number;
    data: Instructor[];
  }> {
    return this.http.get<{
      success: boolean;
      count: number;
      data: Instructor[];
    }>(this.apiUrl);
  }

  getInstructor(
    id: string
  ): Observable<{ success: boolean; data: Instructor }> {
    return this.http.get<{ success: boolean; data: Instructor }>(
      `${this.apiUrl}/${id}`
    );
  }

  createInstructor(
    instructor: Instructor
  ): Observable<{ success: boolean; data: Instructor }> {
    return this.http.post<{ success: boolean; data: Instructor }>(
      this.apiUrl,
      instructor
    );
  }

  updateInstructor(
    id: string,
    instructor: Instructor
  ): Observable<{ success: boolean; data: Instructor }> {
    return this.http.put<{ success: boolean; data: Instructor }>(
      `${this.apiUrl}/${id}`,
      instructor
    );
  }

  deleteInstructor(id: string): Observable<{ success: boolean; data: {} }> {
    return this.http.delete<{ success: boolean; data: {} }>(
      `${this.apiUrl}/${id}`
    );
  }

  assignCourseToInstructor(
    instructorId: string,
    courseId: string
  ): Observable<{ success: boolean; data: string[] }> {
    return this.http.post<{ success: boolean; data: string[] }>(
      `${this.apiUrl}/${instructorId}/assignCourse`,
      { courseId }
    );
  }
}
