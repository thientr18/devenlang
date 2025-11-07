import { ProgressRepository } from '../../repositories/implementations/ProgressRepository';
import { LessonRepository } from '../../repositories/implementations/LessonRepository';
import { IProgressService } from '../interfaces/IProgressService';
import { ProgressConflictError } from '../errors';

export class ProgressService implements IProgressService {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly lessonRepo: LessonRepository
  ) {}

  async getUserProgress(userId: string) {
    return this.progressRepo.getUserProgress(userId);
  }

    async updateLessonStatus(
    userId: string,
    lessonId: string,
    status: 'started' | 'completed',
    xpEarned: number = 0
  ) {
    const existing = await this.progressRepo.getUserProgress(userId);
    const alreadyCompleted = existing?.lessonsProgress?.some(
      lp => lp.lessonId.toString() === lessonId && lp.status === 'completed'
    );
    if (alreadyCompleted && status === 'completed') {
      throw new ProgressConflictError('Lesson already completed.');
    }

    const updated = await this.progressRepo.updateLessonProgress(userId, lessonId, status, xpEarned);
    if (!updated) {
      throw new Error('Failed to update lesson progress.');
    }
    return updated;
  }

  async recordQuizAttempt(
    userId: string,
    quizId: string,
    score: number,
    passed: boolean,
    xpEarned: number
  ) {
    const updated = await this.progressRepo.addQuizAttempt(userId, {
      quizId,
      score,
      passed,
      xpEarned,
      attemptedAt: new Date()
    });
    if (!updated) {
      throw new Error('Failed to record quiz attempt.');
    }
    return updated;
  }

  async dailyActivity(
    userId: string,
    date: Date,
    activity: { minutesSpent: number; xpEarned: number; lessonsCompleted: number; quizzesCompleted: number }
  ) {
    const updated = await this.progressRepo.recordDailyActivity(userId, date, activity);
    if (!updated) {
      throw new Error('Failed to record daily activity.');
    }
    return updated;
  }

  async getPendingLessons(userId: string, allLessons: string[]) {
    const progress = await this.progressRepo.getUserProgress(userId);
    const completed = new Set(
      (progress?.lessonsProgress || [])
        .filter(lp => lp.status === 'completed')
        .map(lp => lp.lessonId.toString())
    );
    return allLessons.filter(id => !completed.has(id));
  }
}