export class DomainError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, message: string, status: number = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('USER_ALREADY_EXISTS', `User with email ${email} already exists.`, 409);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super('USER_NOT_FOUND', `User ${id} not found.`, 404);
  }
}

export class LessonNotFoundError extends DomainError {
  constructor(id: string) {
    super('LESSON_NOT_FOUND', `Lesson ${id} not found.`, 404);
  }
}

export class QuizNotFoundError extends DomainError {
  constructor(id: string) {
    super('QUIZ_NOT_FOUND', `Quiz ${id} not found.`, 404);
  }
}

export class TopicNotFoundError extends DomainError {
  constructor(idOrSlug: string) {
    super('TOPIC_NOT_FOUND', `Topic ${idOrSlug} not found.`, 404);
  }
}

export class InvalidOperationError extends DomainError {
  constructor(message: string) {
    super('INVALID_OPERATION', message, 400);
  }
}

export class ProgressConflictError extends DomainError {
  constructor(message: string) {
    super('PROGRESS_CONFLICT', message, 409);
  }
}