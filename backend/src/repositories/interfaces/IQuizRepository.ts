import { IQuiz } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

export interface IQuizDocument extends Omit<IQuiz, '_id'>, Document {}

export interface IQuizRepository extends IBaseRepository<IQuizDocument> {
  findByLesson(lessonId: string, includeUnpublished?: boolean): Promise<IQuizDocument[]>;
  findByDifficulty(difficulty: string): Promise<IQuizDocument[]>;
  updateAttemptStats(quizId: string, score: number): Promise<IQuizDocument | null>;
  getQuizWithQuestions(quizId: string): Promise<IQuizDocument | null>;
  getQuizzesByIds(quizIds: string[]): Promise<IQuizDocument[]>;
  incrementTotalAttempts(quizId: string): Promise<IQuizDocument | null>;
}