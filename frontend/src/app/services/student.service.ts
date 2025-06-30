import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<{
    success: boolean;
    count: number;
    data: Student[];
  }> {
    return this.http.get<{ success: boolean; count: number; data: Student[] }>(
      this.apiUrl
    );
  }

  getStudent(id: string): Observable<{ success: boolean; data: Student }> {
    return this.http.get<{ success: boolean; data: Student }>(
      `${this.apiUrl}/${id}`
    );
  }

  createStudent(
    student: Partial<Student>
  ): Observable<{ success: boolean; data: Student }> {
    // Only send the necessary fields for creation, e.g., userId, studentId, major
    return this.http.post<{ success: boolean; data: Student }>(
      this.apiUrl,
      student
    );
  }

  updateStudent(
    id: string,
    student: Partial<Student>
  ): Observable<{ success: boolean; data: Student }> {
    return this.http.put<{ success: boolean; data: Student }>(
      `${this.apiUrl}/${id}`,
      student
    );
  }

  deleteStudent(id: string): Observable<{ success: boolean; data: {} }> {
    return this.http.delete<{ success: boolean; data: {} }>(
      `${this.apiUrl}/${id}`
    );
  }
}
