import { ObjectId } from 'mongodb';
import { ILesson } from './lesson.types';

export interface ILessonProgress {
  lessonId: ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: Date;
  xpEarned: number;
  vocabularyReviewed: ObjectId[]; // vocab items user has seen
}

export interface IQuizAttempt {
  quizId: ObjectId;
  lessonId: ObjectId;
  score: number; // percentage
  answers: {
    questionIndex: number;
    userAnswer: string | string[];
    isCorrect: boolean;
    pointsEarned: number;
  }[];
  timeSpent: number; // seconds
  xpEarned: number;
  attemptedAt: Date;
}

export interface IProgress {
  _id: ObjectId;
  userId: ObjectId;
  
  // Lesson tracking
  lessonsProgress: ILessonProgress[];
  
  // Quiz tracking (separate for analytics)
  quizAttempts: IQuizAttempt[];
  
  // Vocabulary mastery tracking
  vocabularyMastery: {
    vocabularyId: ObjectId;
    level: 'learning' | 'familiar' | 'mastered';
    correctCount: number;
    incorrectCount: number;
    lastReviewedAt: Date;
  }[];
  
  // Daily activity
  dailyActivity: {
    date: Date;
    minutesSpent: number;
    xpEarned: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}