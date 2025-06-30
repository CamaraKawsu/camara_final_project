import { User } from './user.model';
import { Course } from './course.model';

export interface Student {
  _id: string;
  user: User; // Can be populated User object or just user ID string
  studentId: string;
  major: string;
  enrollmentDate: Date;
  courses: Course[] | string[]; // Can be populated Course objects or just course IDs
}
