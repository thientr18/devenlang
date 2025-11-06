import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { ILessonRepository, ILessonDocument } from '../interfaces/ILessonRepository';
import { Lesson } from '../../models/Lesson';

export class LessonRepository
  extends BaseRepository<ILessonDocument>
  implements ILessonRepository
{
  constructor() {
    super(Lesson as unknown as Model<ILessonDocument>);
  }

  async findBySlug(slug: string): Promise<ILessonDocument | null> {
    try {
      return await this.model.findOne({ slug, isPublished: true })
        .populate('topicId', 'name slug icon color')
        .populate('vocabularyIds')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByTopic(
    topicId: string,
    includeUnpublished: boolean = false
  ): Promise<ILessonDocument[]> {
    try {
      const filter: any = { topicId };
      if (!includeUnpublished) {
        filter.isPublished = true;
      }

      return await this.model
        .find(filter)
        .sort({ order: 1 })
        .populate('topicId', 'name slug')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findWithVocabularies(lessonId: string): Promise<ILessonDocument | null> {
    try {
      return await this.model.findById(lessonId)
        .populate({
          path: 'vocabularyIds',
          select: 'word partOfSpeech meaning example itContext pronunciation difficulty'
        })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findWithQuizzes(lessonId: string): Promise<ILessonDocument | null> {
    try {
      return await this.model.findById(lessonId)
        .populate({
          path: 'quizIds',
          match: { isPublished: true },
          select: 'title description difficulty timeLimit passingScore xpReward questions'
        })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByDifficulty(difficulty: string): Promise<ILessonDocument[]> {
    try {
      return await this.model
        .find({ difficulty, isPublished: true })
        .sort({ order: 1 })
        .populate('topicId', 'name slug icon')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkPrerequisites(
    lessonId: string,
    completedLessonIds: string[]
  ): Promise<boolean> {
    try {
      const lesson = await this.model.findById(lessonId).select('prerequisites');
      if (!lesson || !lesson.prerequisites || lesson.prerequisites.length === 0) {
        return true;
      }

      return lesson.prerequisites.every((prereqId) =>
        completedLessonIds.includes(prereqId.toString())
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}