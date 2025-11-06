import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { ITopicRepository, ITopicDocument } from '../interfaces/ITopicRepository';
import { Topic } from '../../models/Topic';
import { Lesson } from '../../models/Lesson';

export class TopicRepository
  extends BaseRepository<ITopicDocument>
  implements ITopicRepository
{
  constructor() {
    super(Topic as unknown as Model<ITopicDocument>);
  }

  async findBySlug(slug: string): Promise<ITopicDocument | null> {
    try {
      return await this.model.findOne({ slug, isPublished: true });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findPublished(): Promise<ITopicDocument[]> {
    try {
      return await this.model
        .find({ isPublished: true })
        .sort({ order: 1 })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByOrder(order: number): Promise<ITopicDocument | null> {
    try {
      return await this.model.findOne({ order });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateOrder(
    topicId: string,
    newOrder: number
  ): Promise<ITopicDocument | null> {
    try {
      return await this.model.findByIdAndUpdate(
        topicId,
        { $set: { order: newOrder } },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getTopicsWithLessonCount(): Promise<any[]> {
    try {
      const topics = await this.model
        .find({ isPublished: true })
        .sort({ order: 1 })
        .lean();

      const topicsWithCounts = await Promise.all(
        topics.map(async (topic) => {
          const lessonCount = await Lesson.countDocuments({
            topicId: topic._id,
            isPublished: true
          });

          return {
            ...topic,
            lessonCount
          };
        })
      );

      return topicsWithCounts;
    } catch (error) {
      this.handleError(error);
    }
  }
}