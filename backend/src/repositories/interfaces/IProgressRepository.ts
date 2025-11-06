import { IProgress } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

// Add a document interface (omit _id to avoid conflicts)
export interface IProgressDocument extends Omit<IProgress, '_id'>, Document {}

export interface IProgressRepository extends IBaseRepository<IProgressDocument> {
  getUserProgress(userId: string): Promise<IProgressDocument | null>;
  updateLessonProgress(
    userId: string,
    lessonId: string,
    status: string,
    xpEarned?: number
  ): Promise<IProgressDocument | null>;
  addQuizAttempt(
    userId: string,
    quizAttempt: any
  ): Promise<IProgressDocument | null>;
  updateVocabularyMastery(
    userId: string,
    vocabularyId: string,
    isCorrect: boolean
  ): Promise<IProgressDocument | null>;
  recordDailyActivity(
    userId: string,
    date: Date,
    activity: {
      minutesSpent: number;
      xpEarned: number;
      lessonsCompleted: number;
      quizzesCompleted: number;
    }
  ): Promise<IProgressDocument | null>;
  getDailyActivityStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]>;
}