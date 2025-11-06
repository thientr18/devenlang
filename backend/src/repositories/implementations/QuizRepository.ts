import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { IQuizRepository, IQuizDocument } from '../interfaces/IQuizRepository';
import { Quiz } from '../../models/Quiz';

export class QuizRepository
  extends BaseRepository<IQuizDocument>
  implements IQuizRepository
{
  constructor() {
    super(Quiz as unknown as Model<IQuizDocument>);
  }

  async findByLesson(
    lessonId: string,
    includeUnpublished: boolean = false
  ): Promise<IQuizDocument[]> {
    try {
      const filter: any = { lessonId };
      if (!includeUnpublished) filter.isPublished = true;

      return await this.model
        .find(filter)
        .sort({ order: 1 })
        .select('-questions.correctAnswer')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByDifficulty(difficulty: string): Promise<IQuizDocument[]> {
    try {
      return await this.model
        .find({ difficulty, isPublished: true })
        .populate('lessonId', 'title slug')
        .sort({ order: 1 })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateAttemptStats(
    quizId: string,
    score: number
  ): Promise<IQuizDocument | null> {
    try {
      const quiz = await this.model.findById(quizId);
      if (!quiz) return null;

      const currentTotalAttempts = quiz.totalAttempts || 0;
      const currentAverageScore = quiz.averageScore || 0;
      const newTotalAttempts = currentTotalAttempts + 1;
      const newAverageScore =
        (currentAverageScore * currentTotalAttempts + score) / newTotalAttempts;

      return await this.model.findByIdAndUpdate(
        quizId,
        {
          $set: {
            totalAttempts: newTotalAttempts,
            averageScore: Math.round(newAverageScore)
          }
        },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getQuizWithQuestions(quizId: string): Promise<IQuizDocument | null> {
    try {
      return await this.model
        .findById(quizId)
        .populate('lessonId', 'title slug difficulty')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async getQuizzesByIds(quizIds: string[]): Promise<IQuizDocument[]> {
    try {
      return await this.model
        .find({ _id: { $in: quizIds }, isPublished: true })
        .sort({ order: 1 })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async incrementTotalAttempts(quizId: string): Promise<IQuizDocument | null> {
    try {
      return await this.model.findByIdAndUpdate(
        quizId,
        { $inc: { totalAttempts: 1 } },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}