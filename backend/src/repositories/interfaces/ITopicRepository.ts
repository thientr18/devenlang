import { ITopic } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

export interface ITopicDocument extends Omit<ITopic, '_id'>, Document {}

export interface ITopicRepository extends IBaseRepository<ITopicDocument> {
  findBySlug(slug: string): Promise<ITopicDocument | null>;
  findPublished(): Promise<ITopicDocument[]>;
  findByOrder(order: number): Promise<ITopicDocument | null>;
  updateOrder(topicId: string, newOrder: number): Promise<ITopicDocument | null>;
  getTopicsWithLessonCount(): Promise<any[]>;
}