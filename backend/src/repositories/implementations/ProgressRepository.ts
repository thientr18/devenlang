import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { IProgressRepository, IProgressDocument } from '../interfaces/IProgressRepository';
import { Progress } from '../../models/Progress';

export class ProgressRepository
  extends BaseRepository<IProgressDocument>
  implements IProgressRepository
{
  constructor() {
    super(Progress as unknown as Model<IProgressDocument>);
  }

  async getUserProgress(userId: string): Promise<IProgressDocument | null> {
    try {
      return await this.model.findOne({ userId })
        .populate('lessonsProgress.lessonId', 'title slug difficulty')
        .populate('vocabularyMastery.vocabularyId', 'word meaning')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateLessonProgress(
    userId: string,
    lessonId: string,
    status: string,
    xpEarned: number = 0
  ): Promise<IProgressDocument | null> {
    try {
      const updateData: any = {
        'lessonsProgress.$.status': status
      };

      if (status === 'completed') {
        updateData['lessonsProgress.$.completedAt'] = new Date();
        updateData['lessonsProgress.$.xpEarned'] = xpEarned;
      }

      const result = await this.model.findOneAndUpdate(
        { userId, 'lessonsProgress.lessonId': lessonId },
        { $set: updateData },
        { new: true }
      );

      if (result) {
        return result;
      }

      return await this.model.findOneAndUpdate(
        { userId },
        {
          $push: {
            lessonsProgress: {
              lessonId,
              status,
              completedAt: status === 'completed' ? new Date() : undefined,
              xpEarned: status === 'completed' ? xpEarned : 0,
              vocabularyReviewed: []
            }
          }
        },
        { new: true, upsert: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async addQuizAttempt(
    userId: string,
    quizAttempt: any
  ): Promise<IProgressDocument | null> {
    try {
      return await this.model.findOneAndUpdate(
        { userId },
        { $push: { quizAttempts: quizAttempt } },
        { new: true, upsert: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateVocabularyMastery(
    userId: string,
    vocabularyId: string,
    isCorrect: boolean
  ): Promise<IProgressDocument | null> {
    try {
      const progress = await this.model.findOne({ userId });

      if (!progress) {
        return await this.model.create({
          userId,
          lessonsProgress: [],
          quizAttempts: [],
          vocabularyMastery: [{
            vocabularyId,
            level: 'learning',
            correctCount: isCorrect ? 1 : 0,
            incorrectCount: isCorrect ? 0 : 1,
            lastReviewedAt: new Date()
          }],
          dailyActivity: []
        });
      }

      const masteryIndex = progress.vocabularyMastery.findIndex(
        (vm: any) => vm.vocabularyId.toString() === vocabularyId
      );

      if (masteryIndex === -1) {
        return await this.model.findOneAndUpdate(
          { userId },
          {
            $push: {
              vocabularyMastery: {
                vocabularyId,
                level: 'learning',
                correctCount: isCorrect ? 1 : 0,
                incorrectCount: isCorrect ? 0 : 1,
                lastReviewedAt: new Date()
              }
            }
          },
          { new: true }
        );
      }

      const incrementField = isCorrect ? 'correctCount' : 'incorrectCount';
      const mastery = progress.vocabularyMastery[masteryIndex] as any;
      const newCorrectCount = mastery.correctCount + (isCorrect ? 1 : 0);
      const newIncorrectCount = mastery.incorrectCount + (isCorrect ? 0 : 1);

      let level = 'learning';
      if (newCorrectCount >= 10 && newCorrectCount > newIncorrectCount * 2) {
        level = 'mastered';
      } else if (newCorrectCount >= 5 && newCorrectCount > newIncorrectCount) {
        level = 'familiar';
      }

      return await this.model.findOneAndUpdate(
        { userId, 'vocabularyMastery.vocabularyId': vocabularyId },
        {
          $inc: { [`vocabularyMastery.$.${incrementField}`]: 1 },
          $set: {
            'vocabularyMastery.$.level': level,
            'vocabularyMastery.$.lastReviewedAt': new Date()
          }
        },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async recordDailyActivity(
    userId: string,
    date: Date,
    activity: {
      minutesSpent: number;
      xpEarned: number;
      lessonsCompleted: number;
      quizzesCompleted: number;
    }
  ): Promise<IProgressDocument | null> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const result = await this.model.findOneAndUpdate(
        { userId, 'dailyActivity.date': startOfDay },
        {
          $inc: {
            'dailyActivity.$.minutesSpent': activity.minutesSpent,
            'dailyActivity.$.xpEarned': activity.xpEarned,
            'dailyActivity.$.lessonsCompleted': activity.lessonsCompleted,
            'dailyActivity.$.quizzesCompleted': activity.quizzesCompleted
          }
        },
        { new: true }
      );

      if (result) {
        return result;
      }

      return await this.model.findOneAndUpdate(
        { userId },
        {
          $push: {
            dailyActivity: {
              date: startOfDay,
              ...activity
            }
          }
        },
        { new: true, upsert: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getDailyActivityStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      const progress = await this.model.findOne({ userId });
      if (!progress) return [];

      return progress.dailyActivity
        .filter((activity: any) => {
          const activityDate = new Date(activity.date);
          return activityDate >= startDate && activityDate <= endDate;
        })
        .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      this.handleError(error);
    }
  }
}