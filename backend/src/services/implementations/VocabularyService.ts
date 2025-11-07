import { VocabularyRepository } from '../../repositories/implementations/VocabularyRepository';
import { ProgressRepository } from '../../repositories/implementations/ProgressRepository';
import { IVocabularyService } from '../interfaces/IVocabularyService';

export class VocabularyService implements IVocabularyService {
  constructor(
    private readonly vocabRepo: VocabularyRepository,
    private readonly progressRepo: ProgressRepository
  ) {}

  async search(query: string, limit: number = 20) {
    return this.vocabRepo.searchByText(query, limit);
  }

  async random(count: number, filters?: { topicId?: string; difficulty?: string }) {
    return this.vocabRepo.getRandomVocabularies(count, filters);
  }

  async findByTopic(topicId: string, difficulty?: string) {
    return this.vocabRepo.findByTopic(topicId, difficulty);
  }

  async reviewVocabulary(vocabularyId: string, userId: string, score: number, isCorrect: boolean) {
    await this.vocabRepo.updateReviewStats(vocabularyId, score);
    await this.progressRepo.updateVocabularyMastery(userId, vocabularyId, isCorrect);
  }
}