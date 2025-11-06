import { IVocabulary } from '../../types';
import { IBaseRepository } from '../base/IBaseRepository';
import { Document } from 'mongoose';

export interface IVocabularyDocument extends Omit<IVocabulary, '_id'>, Document {}

export interface IVocabularyRepository extends IBaseRepository<IVocabularyDocument> {
  searchByText(query: string, limit?: number): Promise<IVocabularyDocument[]>;
  findByTopic(topicId: string, difficulty?: string): Promise<IVocabularyDocument[]>;
  findByTags(tags: string[]): Promise<IVocabularyDocument[]>;
  getRandomVocabularies(
    count: number,
    filters?: {
      topicId?: string;
      difficulty?: string;
    }
  ): Promise<IVocabularyDocument[]>;
  updateReviewStats(vocabularyId: string, score: number): Promise<IVocabularyDocument | null>;
}