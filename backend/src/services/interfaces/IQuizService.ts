import { IQuizDocument } from '../../repositories/interfaces/IQuizRepository';

export interface IQuizService {
  getQuizPlayable(quizId: string): Promise<IQuizDocument>;
  submitQuizAttempt(params: {
    userId: string;
    quizId: string;
    answers: { questionId: string; selected: string }[];
    durationSeconds: number;
  }): Promise<{ score: number; passed: boolean; xpAwarded: number }>;
  listByLesson(lessonId: string): Promise<IQuizDocument[]>;
}