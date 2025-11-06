import { ObjectId } from 'mongodb';
import { DifficultyLevel, PartOfSpeech, QuizType, LanguageLevel, BadgeType } from './enums';

// ==================== USER (Auth0-based) ====================

export interface IUser {
  _id: ObjectId;

  // Auth identity
  authProvider: 'auth0';
  auth0Id: string; // Auth0 "sub" claim (e.g., "auth0|abc123" or "google-oauth2|xyz")
  email: string;
  emailVerified: boolean;
  fullName: string;
  picture?: string; // Auth0 profile picture URL

  // App profile
  languageLevel?: LanguageLevel;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  avatar?: string; // app-specific avatar override

  preferences: {
    dailyGoal?: number; // minutes per day
    emailNotifications: boolean;
    soundEffects: boolean;
  };

  // Timestamps and status
  lastLoginAt?: Date;       // last app login
  lastAuthSyncAt?: Date;    // last time we synced from Auth0
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // local flag to disable access regardless of Auth0
}

// ==================== TOPIC ====================

export interface ITopic {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== LESSON ====================

export interface ILesson {
  _id: ObjectId;
  topicId: ObjectId;
  title: string;
  slug: string;
  description: string;
  order: number;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  xpReward: number;
  thumbnailUrl?: string;
  vocabularyIds: ObjectId[];
  quizIds: ObjectId[];
  prerequisites?: ObjectId[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId; // User _id (admin)
}

// ==================== VOCABULARY ====================

export interface IVocabulary {
  _id: ObjectId;
  word: string;
  partOfSpeech: PartOfSpeech;
  meaning: string;
  meaningVi?: string;
  example: string;
  exampleVi?: string;
  itContext: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  topicId: ObjectId;
  difficulty: DifficultyLevel;
  tags?: string[];
  timesReviewed: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
}

// ==================== QUIZ ====================

export interface IQuizQuestion {
  questionText: string;
  questionType: QuizType;
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface IQuiz {
  _id: ObjectId;
  lessonId: ObjectId;
  title: string;
  description?: string;
  difficulty: DifficultyLevel;
  timeLimit?: number;
  passingScore: number;
  xpReward: number;
  questions: IQuizQuestion[];
  order: number;
  isPublished: boolean;
  totalAttempts: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
}

// ==================== PROGRESS ====================

export interface ILessonProgress {
  lessonId: ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: Date;
  xpEarned: number;
  vocabularyReviewed: ObjectId[];
}

export interface IQuizAttempt {
  quizId: ObjectId;
  lessonId: ObjectId;
  score: number;
  answers: {
    questionIndex: number;
    userAnswer: string | string[];
    isCorrect: boolean;
    pointsEarned: number;
  }[];
  timeSpent: number;
  xpEarned: number;
  attemptedAt: Date;
}

export interface IProgress {
  _id: ObjectId;
  userId: ObjectId;
  lessonsProgress: ILessonProgress[];
  quizAttempts: IQuizAttempt[];
  vocabularyMastery: {
    vocabularyId: ObjectId;
    level: 'learning' | 'familiar' | 'mastered';
    correctCount: number;
    incorrectCount: number;
    lastReviewedAt: Date;
  }[];
  dailyActivity: {
    date: Date;
    minutesSpent: number;
    xpEarned: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// ==================== BADGE ====================

export interface IBadge {
  _id: ObjectId;
  name: string;
  description: string;
  type: BadgeType;
  iconUrl: string;
  condition: {
    type: 'lesson_count' | 'quiz_score' | 'streak_days' | 'xp_total' | 'vocabulary_mastered';
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  createdAt: Date;
}

export interface IUserBadge {
  _id: ObjectId;
  userId: ObjectId;
  badgeId: ObjectId;
  earnedAt: Date;
}