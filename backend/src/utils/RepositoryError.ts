export enum RepositoryErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN'
}

export class RepositoryError extends Error {
  constructor(
    public code: RepositoryErrorCode,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'RepositoryError';
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }

  static notFound(entity: string, id: string): RepositoryError {
    return new RepositoryError(
      RepositoryErrorCode.NOT_FOUND,
      `${entity} with id ${id} not found`
    );
  }

  static duplicate(entity: string, field: string): RepositoryError {
    return new RepositoryError(
      RepositoryErrorCode.DUPLICATE,
      `${entity} with this ${field} already exists`
    );
  }

  static validation(message: string): RepositoryError {
    return new RepositoryError(RepositoryErrorCode.VALIDATION, message);
  }

  static database(message: string, originalError?: any): RepositoryError {
    return new RepositoryError(
      RepositoryErrorCode.DATABASE,
      message,
      originalError
    );
  }
}