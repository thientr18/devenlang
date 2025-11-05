import mongoose, { Schema, Model } from 'mongoose';
import { IProgress, ILessonProgress, IQuizAttempt } from '../types';

const lessonProgressSchema = new Schema<ILessonProgress>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    completedAt: Date,
    xpEarned: {
      type: Number,
      default: 0,
      min: 0
    },
    vocabularyReviewed: [{
      type: Schema.Types.ObjectId,
      ref: 'Vocabulary'
    }]
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    answers: [{
      questionIndex: Number,
      userAnswer: Schema.Types.Mixed,
      isCorrect: Boolean,
      pointsEarned: Number
    }],
    timeSpent: {
      type: Number,
      required: true,
      min: 0
    },
    xpEarned: {
      type: Number,
      required: true,
      min: 0
    },
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    lessonsProgress: [lessonProgressSchema],
    quizAttempts: [quizAttemptSchema],
    vocabularyMastery: [{
      vocabularyId: {
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary',
        required: true
      },
      level: {
        type: String,
        enum: ['learning', 'familiar', 'mastered'],
        default: 'learning'
      },
      correctCount: {
        type: Number,
        default: 0,
        min: 0
      },
      incorrectCount: {
        type: Number,
        default: 0,
        min: 0
      },
      lastReviewedAt: {
        type: Date,
        default: Date.now
      }
    }],
    dailyActivity: [{
      date: {
        type: Date,
        required: true
      },
      minutesSpent: {
        type: Number,
        default: 0,
        min: 0
      },
      xpEarned: {
        type: Number,
        default: 0,
        min: 0
      },
      lessonsCompleted: {
        type: Number,
        default: 0,
        min: 0
      },
      quizzesCompleted: {
        type: Number,
        default: 0,
        min: 0
      }
    }]
  },
  {
    timestamps: true,
    collection: 'progress'
  }
);

// Indexes for analytics
progressSchema.index({ userId: 1 });
progressSchema.index({ 'lessonsProgress.lessonId': 1 });
progressSchema.index({ 'quizAttempts.attemptedAt': -1 });
progressSchema.index({ 'dailyActivity.date': -1 });

export const Progress: Model<IProgress> = mongoose.model<IProgress>(
  'Progress',
  progressSchema
);