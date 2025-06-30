import { User } from './user.model';
import { Student } from './student.model';

export interface Course {
  _id: string;
  title: string;
  courseCode: string;
  description: string;
  credits: number;
  instructor?: User;
  studentsEnrolled?: Student[] | string[]; // Can be populated Student objects or just student IDs
  createdAt: Date;
}
