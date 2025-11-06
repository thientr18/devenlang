import { UserRepository } from './implementations/UserRepository';
import { LessonRepository } from './implementations/LessonRepository';
import { VocabularyRepository } from './implementations/VocabularyRepository';
import { QuizRepository } from './implementations/QuizRepository';
import { ProgressRepository } from './implementations/ProgressRepository';
import { BadgeRepository, UserBadgeRepository } from './implementations/BadgeRepository';
import { TopicRepository } from './implementations/TopicRepository';

/**
 * Singleton container for repository instances
 * Provides centralized access to all repositories with lazy initialization
 */
export class RepositoryContainer {
  private static _userRepository: UserRepository;
  private static _lessonRepository: LessonRepository;
  private static _vocabularyRepository: VocabularyRepository;
  private static _quizRepository: QuizRepository;
  private static _progressRepository: ProgressRepository;
  private static _badgeRepository: BadgeRepository;
  private static _userBadgeRepository: UserBadgeRepository;
  private static _topicRepository: TopicRepository;

  // User Repository
  static get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  static setUserRepository(repo: UserRepository): void {
    this._userRepository = repo;
  }

  // Lesson Repository
  static get lessonRepository(): LessonRepository {
    if (!this._lessonRepository) {
      this._lessonRepository = new LessonRepository();
    }
    return this._lessonRepository;
  }

  static setLessonRepository(repo: LessonRepository): void {
    this._lessonRepository = repo;
  }

  // Vocabulary Repository
  static get vocabularyRepository(): VocabularyRepository {
    if (!this._vocabularyRepository) {
      this._vocabularyRepository = new VocabularyRepository();
    }
    return this._vocabularyRepository;
  }

  static setVocabularyRepository(repo: VocabularyRepository): void {
    this._vocabularyRepository = repo;
  }

  // Quiz Repository
  static get quizRepository(): QuizRepository {
    if (!this._quizRepository) {
      this._quizRepository = new QuizRepository();
    }
    return this._quizRepository;
  }

  static setQuizRepository(repo: QuizRepository): void {
    this._quizRepository = repo;
  }

  // Progress Repository
  static get progressRepository(): ProgressRepository {
    if (!this._progressRepository) {
      this._progressRepository = new ProgressRepository();
    }
    return this._progressRepository;
  }

  static setProgressRepository(repo: ProgressRepository): void {
    this._progressRepository = repo;
  }

  // Badge Repository
  static get badgeRepository(): BadgeRepository {
    if (!this._badgeRepository) {
      this._badgeRepository = new BadgeRepository();
    }
    return this._badgeRepository;
  }

  static setBadgeRepository(repo: BadgeRepository): void {
    this._badgeRepository = repo;
  }

  // User Badge Repository
  static get userBadgeRepository(): UserBadgeRepository {
    if (!this._userBadgeRepository) {
      this._userBadgeRepository = new UserBadgeRepository();
    }
    return this._userBadgeRepository;
  }

  static setUserBadgeRepository(repo: UserBadgeRepository): void {
    this._userBadgeRepository = repo;
  }

  // Topic Repository
  static get topicRepository(): TopicRepository {
    if (!this._topicRepository) {
      this._topicRepository = new TopicRepository();
    }
    return this._topicRepository;
  }

  static setTopicRepository(repo: TopicRepository): void {
    this._topicRepository = repo;
  }

  /**
   * Reset all repositories (useful for testing)
   */
  static resetAll(): void {
    this._userRepository = null as any;
    this._lessonRepository = null as any;
    this._vocabularyRepository = null as any;
    this._quizRepository = null as any;
    this._progressRepository = null as any;
    this._badgeRepository = null as any;
    this._userBadgeRepository = null as any;
    this._topicRepository = null as any;
  }
}

// Export individual repositories for direct import
export {
  UserRepository,
  LessonRepository,
  VocabularyRepository,
  QuizRepository,
  ProgressRepository,
  BadgeRepository,
  UserBadgeRepository,
  TopicRepository
};

// Export interfaces
export * from './interfaces/IUserRepository';
export * from './interfaces/ILessonRepository';
export * from './interfaces/IVocabularyRepository';
export * from './interfaces/IQuizRepository';
export * from './interfaces/IProgressRepository';
export * from './interfaces/IBadgeRepository';
export * from './interfaces/ITopicRepository';
export * from './base/IBaseRepository';