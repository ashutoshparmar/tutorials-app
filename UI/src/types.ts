export type UserRole = 'admin' | 'readonly';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  example: string;
  definition?: string;
  why?: string;
  problem?: string;
  realWorldExample?: string;
  syntax?: string;
  practicalExample?: string;
  commonMistakes?: string;
  viewType?: 'high-level' | 'detailed';
  html?: string;
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Database {
  users: User[];
  courses: Course[];
}
