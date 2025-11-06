import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { IVocabularyRepository, IVocabularyDocument } from '../interfaces/IVocabularyRepository';
import { Vocabulary } from '../../models/Vocabulary';

export class VocabularyRepository
  extends BaseRepository<IVocabularyDocument>
  implements IVocabularyRepository
{
  constructor() {
    super(Vocabulary as unknown as Model<IVocabularyDocument>);
  }

  async searchByText(query: string, limit: number = 20): Promise<IVocabularyDocument[]> {
    try {
      return await this.model
        .find(
          { $text: { $search: query } },
          { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .populate('topicId', 'name slug')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByTopic(
    topicId: string,
    difficulty?: string
  ): Promise<IVocabularyDocument[]> {
    try {
      const filter: any = { topicId };
      if (difficulty) filter.difficulty = difficulty;

      return await this.model
        .find(filter)
        .sort({ word: 1 })
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByTags(tags: string[]): Promise<IVocabularyDocument[]> {
    try {
      return await this.model
        .find({ tags: { $in: tags.map(t => t.toLowerCase()) } })
        .populate('topicId', 'name slug')
        .exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRandomVocabularies(
    count: number,
    filters?: { topicId?: string; difficulty?: string }
  ): Promise<IVocabularyDocument[]> {
    try {
      const matchStage: any = {};
      if (filters?.topicId) matchStage.topicId = filters.topicId;
      if (filters?.difficulty) matchStage.difficulty = filters.difficulty;

      // Aggregation returns plain objects; cast result
      const docs = await (this.model as any).aggregate([
        { $match: matchStage },
        { $sample: { size: count } }
      ]);
      return docs as IVocabularyDocument[];
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateReviewStats(
    vocabularyId: string,
    score: number
  ): Promise<IVocabularyDocument | null> {
    try {
      const vocabulary = await this.model.findById(vocabularyId);
      if (!vocabulary) return null;

      const currentTimesReviewed = vocabulary.get('timesReviewed') || 0;
      const currentAverageScore = vocabulary.get('averageScore') || 0;

      const newTimesReviewed = currentTimesReviewed + 1;
      const newAverageScore =
        (currentAverageScore * currentTimesReviewed + score) / newTimesReviewed;

      return await this.model.findByIdAndUpdate(
        vocabularyId,
        {
          $set: {
            timesReviewed: newTimesReviewed,
            averageScore: Math.round(newAverageScore)
          }
        },
        { new: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}