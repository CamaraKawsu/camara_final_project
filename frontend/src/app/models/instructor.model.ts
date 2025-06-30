import { User } from './user.model';
import { Course } from './course.model';

export interface Instructor {
  _id: string;
  user: User;
  employeeId: string;
  department: string;
  coursesTaught: Course[];
}
