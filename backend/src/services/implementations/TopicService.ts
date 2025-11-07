import { TopicRepository } from '../../repositories/implementations/TopicRepository';
import { ITopicService } from '../interfaces/ITopicService';
import { TopicNotFoundError } from '../errors';

export class TopicService implements ITopicService {
  constructor(private readonly topicRepo: TopicRepository) {}

  async getPublished() {
    return this.topicRepo.findPublished();
  }

  async getBySlug(slug: string) {
    const topic = await this.topicRepo.findBySlug(slug);
    if (!topic) throw new TopicNotFoundError(slug);
    return topic;
  }

  async withLessonCounts() {
    return this.topicRepo.getTopicsWithLessonCount();
  }
}