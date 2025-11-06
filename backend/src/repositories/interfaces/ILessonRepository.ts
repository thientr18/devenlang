import { ILesson } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

export interface ILessonDocument extends Omit<ILesson, '_id'>, Document {}

export interface ILessonRepository extends IBaseRepository<ILessonDocument> {
  findBySlug(slug: string): Promise<ILessonDocument | null>;
  findByTopic(topicId: string, includeUnpublished?: boolean): Promise<ILessonDocument[]>;
  findWithVocabularies(lessonId: string): Promise<ILessonDocument | null>;
  findWithQuizzes(lessonId: string): Promise<ILessonDocument | null>;
  findByDifficulty(difficulty: string): Promise<ILessonDocument[]>;
  checkPrerequisites(lessonId: string, completedLessonIds: string[]): Promise<boolean>;
}