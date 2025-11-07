import { IVocabularyDocument } from '../../repositories/interfaces/IVocabularyRepository';

export interface IVocabularyService {
  search(query: string, limit?: number): Promise<IVocabularyDocument[]>;
  random(count: number, filters?: { topicId?: string; difficulty?: string }): Promise<IVocabularyDocument[]>;
  findByTopic(topicId: string, difficulty?: string): Promise<IVocabularyDocument[]>;
  reviewVocabulary(vocabularyId: string, userId: string, score: number, isCorrect: boolean): Promise<void>;
}