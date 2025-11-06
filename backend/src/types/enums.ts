import { ObjectId } from 'mongodb';

// ==================== ENUMS ====================

export enum UserRole {
  LEARNER = 'learner',
  ADMIN = 'admin',
  PREMIUM = 'premium'
}

export enum LanguageLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum PartOfSpeech {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  ADVERB = 'adverb',
  PHRASE = 'phrase',
  ACRONYM = 'acronym'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum QuizType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_IN_BLANK = 'fill_in_blank',
  MATCHING = 'matching',
  TRUE_FALSE = 'true_false'
}

export enum BadgeType {
  LESSON_COMPLETION = 'lesson_completion',
  QUIZ_MASTER = 'quiz_master',
  VOCABULARY_EXPERT = 'vocabulary_expert',
  STREAK = 'streak',
  SPECIAL = 'special'
}