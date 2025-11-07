import { LessonRepository, ProgressRepository } from '../../repositories/implementations';
import { ILessonService } from '../interfaces';
import { ILessonDocument } from '../../repositories/interfaces';
import { LessonNotFoundError } from '../errors';

export class LessonService implements ILessonService {
  constructor(
    private readonly lessonRepo: LessonRepository,
    private readonly progressRepo: ProgressRepository
  ) {}

  async getLessonWithContent(slug: string) {
    const lesson = await this.lessonRepo.findBySlug(slug);
    if (!lesson) throw new LessonNotFoundError(slug);
    return lesson;
  }

  async getLessonWithQuizzes(lessonId: string) {
    const lesson = await this.lessonRepo.findWithQuizzes(lessonId);
    if (!lesson) throw new LessonNotFoundError(lessonId);
    return lesson;
  }

  async listByTopic(topicId: string) {
    return this.lessonRepo.findByTopic(topicId);
  }

  async listUncompletedForUser(userId: string, topicId?: string) {
    const progress = await this.progressRepo.getUserProgress(userId);
    const completedIds = new Set(
      (progress?.lessonsProgress || [])
        .filter(lp => lp.status === 'completed')
        .map(lp => lp.lessonId.toString())
    );

    const lessons: ILessonDocument[] = topicId
      ? await this.lessonRepo.findByTopic(topicId)
      : (await this.lessonRepo.findAll({ isPublished: true })) as ILessonDocument[];

    // Normalize _id (may be Types.ObjectId or string) to string to avoid 'unknown' type error
    return lessons.filter((l: ILessonDocument) => {
      const id = typeof l._id === 'string'
        ? l._id
        : (l._id as any)?.toString();
      return !completedIds.has(id);
    });
  }

  async canAccessLesson(lessonId: string, completedLessonIds: string[]) {
    return this.lessonRepo.checkPrerequisites(lessonId, completedLessonIds);
  }
}