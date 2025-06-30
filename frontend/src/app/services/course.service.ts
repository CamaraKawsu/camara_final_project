import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<{
    success: boolean;
    count: number;
    data: Course[];
  }> {
    return this.http.get<{ success: boolean; count: number; data: Course[] }>(
      this.apiUrl
    );
  }

  getCourse(id: string): Observable<{ success: boolean; data: Course }> {
    return this.http.get<{ success: boolean; data: Course }>(
      `${this.apiUrl}/${id}`
    );
  }

  createCourse(
    course: Partial<Course>
  ): Observable<{ success: boolean; data: Course }> {
    return this.http.post<{ success: boolean; data: Course }>(
      this.apiUrl,
      course
    );
  }

  updateCourse(
    id: string,
    course: Partial<Course>
  ): Observable<{ success: boolean; data: Course }> {
    return this.http.put<{ success: boolean; data: Course }>(
      `${this.apiUrl}/${id}`,
      course
    );
  }

  deleteCourse(id: string): Observable<{ success: boolean; data: {} }> {
    return this.http.delete<{ success: boolean; data: {} }>(
      `${this.apiUrl}/${id}`
    );
  }
}
