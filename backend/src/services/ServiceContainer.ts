import { RepositoryContainer } from '../repositories/RepositoryContainer';
import {
  UserService,
  LessonService,
  VocabularyService,
  QuizService,
  ProgressService,
  BadgeService,
  TopicService
} from './implementations';

export class ServiceContainer {
  static get userService() {
    return new UserService(RepositoryContainer.userRepository);
  }
  static get lessonService() {
    return new LessonService(
      RepositoryContainer.lessonRepository,
      RepositoryContainer.progressRepository
    );
  }
  static get vocabularyService() {
    return new VocabularyService(
      RepositoryContainer.vocabularyRepository,
      RepositoryContainer.progressRepository
    );
  }
  static get quizService() {
    return new QuizService(
      RepositoryContainer.quizRepository,
      RepositoryContainer.progressRepository,
      RepositoryContainer.userRepository,
      RepositoryContainer.badgeRepository,
      RepositoryContainer.userBadgeRepository
    );
  }
  static get progressService() {
    return new ProgressService(
      RepositoryContainer.progressRepository,
      RepositoryContainer.lessonRepository
    );
  }
  static get badgeService() {
    return new BadgeService(
      RepositoryContainer.badgeRepository,
      RepositoryContainer.userBadgeRepository
    );
  }
  static get topicService() {
    return new TopicService(RepositoryContainer.topicRepository);
  }
}

// Re-export implementations
export * from './implementations/UserService';
export * from './implementations/LessonService';
export * from './implementations/VocabularyService';
export * from './implementations/QuizService';
export * from './implementations/ProgressService';
export * from './implementations/BadgeService';
export * from './implementations/TopicService';