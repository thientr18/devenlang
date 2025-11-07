import { ITopicDocument } from '../../repositories/interfaces/ITopicRepository';

export interface ITopicService {
  getPublished(): Promise<ITopicDocument[]>;
  getBySlug(slug: string): Promise<ITopicDocument>;
  withLessonCounts(): Promise<any[]>;
}