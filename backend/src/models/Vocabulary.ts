import mongoose, { Schema, Model } from 'mongoose';
import { IVocabulary, PartOfSpeech, DifficultyLevel } from '../types';

const vocabularySchema = new Schema<IVocabulary>(
  {
    word: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    partOfSpeech: {
      type: String,
      enum: Object.values(PartOfSpeech),
      required: true
    },
    meaning: {
      type: String,
      required: true
    },
    meaningVi: String,
    example: {
      type: String,
      required: true
    },
    exampleVi: String,
    itContext: {
      type: String,
      required: true
    },
    pronunciation: String,
    audioUrl: String,
    imageUrl: String,
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
      index: true
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    timesReviewed: {
      type: Number,
      default: 0,
      min: 0
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'vocabularies'
  }
);

// Text index for search
vocabularySchema.index({ word: 'text', meaning: 'text', itContext: 'text' });
vocabularySchema.index({ topicId: 1, difficulty: 1 });
vocabularySchema.index({ tags: 1 });

export const Vocabulary: Model<IVocabulary> = mongoose.model<IVocabulary>(
  'Vocabulary',
  vocabularySchema
);