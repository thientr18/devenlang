import { IProgressDocument } from '../../repositories/interfaces/IProgressRepository';

export interface IProgressService {
  getUserProgress(userId: string): Promise<IProgressDocument | null>;
  updateLessonStatus(userId: string, lessonId: string, status: 'started' | 'completed', xpEarned?: number): Promise<IProgressDocument>;
  recordQuizAttempt(userId: string, quizId: string, score: number, passed: boolean, xpEarned: number): Promise<IProgressDocument>;
  dailyActivity(userId: string, date: Date, activity: { minutesSpent: number; xpEarned: number; lessonsCompleted: number; quizzesCompleted: number }): Promise<IProgressDocument>;
  getPendingLessons(userId: string, allLessons: string[]): Promise<string[]>;
}