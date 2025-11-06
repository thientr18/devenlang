import mongoose, { Schema, Model } from 'mongoose';
import { DifficultyLevel } from '../types/enums';
import { ILesson } from '../types/model.types';

const lessonSchema = new Schema<ILesson>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
      index: true
    },
    estimatedMinutes: {
      type: Number,
      required: true,
      min: 1
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    thumbnailUrl: String,
    vocabularyIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Vocabulary'
    }],
    quizIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Quiz'
    }],
    prerequisites: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'lessons'
  }
);

// Compound indexes for common queries
lessonSchema.index({ topicId: 1, order: 1 });
lessonSchema.index({ slug: 1 });
lessonSchema.index({ isPublished: 1, difficulty: 1 });

export const Lesson: Model<ILesson> = mongoose.model<ILesson>('Lesson', lessonSchema);