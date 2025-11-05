import { ObjectId } from 'mongodb';
import { DifficultyLevel, QuizType } from './enum';

export interface IQuizQuestion {
  questionText: string;
  questionType: QuizType;
  options: string[]; // for multiple choice, matching
  correctAnswer: string | string[]; // string or array for multiple correct
  explanation?: string; // why this is correct
  points: number;
}

export interface IQuiz {
  _id: ObjectId;
  lessonId: ObjectId;
  title: string;
  description?: string;
  difficulty: DifficultyLevel;
  timeLimit?: number; // seconds (null = no limit)
  passingScore: number; // percentage (e.g., 70)
  xpReward: number;
  
  // Embedded questions - they don't exist independently
  questions: IQuizQuestion[];
  
  order: number; // order within lesson
  isPublished: boolean;
  
  // Stats
  totalAttempts: number;
  averageScore: number;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
}