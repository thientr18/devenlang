import { ILessonDocument } from '../../repositories/interfaces/ILessonRepository';

export interface ILessonService {
  getLessonWithContent(slug: string): Promise<ILessonDocument>;
  getLessonWithQuizzes(lessonId: string): Promise<ILessonDocument>;
  listByTopic(topicId: string): Promise<ILessonDocument[]>;
  listUncompletedForUser(userId: string, topicId?: string): Promise<ILessonDocument[]>;
  canAccessLesson(lessonId: string, completedLessonIds: string[]): Promise<boolean>;
}