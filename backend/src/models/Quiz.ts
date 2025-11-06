import mongoose, { Schema, Model } from 'mongoose';
import { DifficultyLevel, QuizType } from '../types/enums';
import { IQuiz, IQuizQuestion } from '../types/model.types';

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: Object.values(QuizType),
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Schema.Types.Mixed, // Can be string or array
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      required: true,
      min: 1,
      default: 10
    }
  },
  { _id: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true
    },
    timeLimit: {
      type: Number,
      min: 30
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 70
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0,
      default: 20
    },
    questions: {
      type: [quizQuestionSchema],
      required: true,
      validate: {
        validator: (v: IQuizQuestion[]) => v.length > 0,
        message: 'Quiz must have at least one question'
      }
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },
    totalAttempts: {
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
    collection: 'quizzes'
  }
);

quizSchema.index({ lessonId: 1, order: 1 });
quizSchema.index({ isPublished: 1, difficulty: 1 });

export const Quiz: Model<IQuiz> = mongoose.model<IQuiz>('Quiz', quizSchema);