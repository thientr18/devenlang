import { Document, Model, FilterQuery, ClientSession, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';
import {
  PaginationOptions,
  PaginatedResult,
  FindOptions,
  CreateInput,
  UpdateInput
} from '../../types/repository.types';
import { RepositoryError, RepositoryErrorCode } from '../../utils/RepositoryError';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  protected get entityName(): string {
    return this.model.modelName;
  }

  /**
   * Handle MongoDB errors and convert to RepositoryError
   */
  protected handleError(error: any): never {
    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw RepositoryError.duplicate(this.entityName, field);
    }

    // Validation error
    if (error.name === 'ValidationError') {
      throw RepositoryError.validation(error.message);
    }

    // Cast error (invalid ObjectId)
    if (error.name === 'CastError') {
      throw RepositoryError.validation(`Invalid ${error.path}: ${error.value}`);
    }

    // Generic database error
    throw RepositoryError.database(
      `Database operation failed: ${error.message}`,
      error
    );
  }

  /**
   * Apply find options to query
   */
  protected applyFindOptions(query: any, options?: FindOptions): any {
    if (!options) return query;

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.populate) {
      query = query.populate(options.populate);
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.lean) {
      query = query.lean();
    }

    return query;
  }

  // ============ CREATE OPERATIONS ============

  async create(data: CreateInput<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      this.handleError(error);
    }
  }

  async createMany(data: CreateInput<T>[]): Promise<T[]> {
    try {
      const result = await this.model.insertMany(data);
      return result as unknown as T[];
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ READ OPERATIONS ============

  async findById(id: string, options?: FindOptions): Promise<T | null> {
    try {
      let query = this.model.findById(id);
      query = this.applyFindOptions(query, options);
      return await query.exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(filter: Partial<T>, options?: FindOptions): Promise<T | null> {
    try {
      let query = this.model.findOne(filter as FilterQuery<T>);
      query = this.applyFindOptions(query, options);
      return await query.exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(filter: Partial<T> = {}, options?: FindOptions): Promise<T[]> {
    try {
      let query = this.model.find(filter as FilterQuery<T>);
      query = this.applyFindOptions(query, options);
      return await query.exec();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findWithPagination(
    filter: Partial<T> = {},
    paginationOptions: PaginationOptions = {},
    findOptions?: FindOptions
  ): Promise<PaginatedResult<T>> {
    try {
      const page = Math.max(1, paginationOptions.page || 1);
      const limit = Math.min(100, Math.max(1, paginationOptions.limit || 10));
      const skip = (page - 1) * limit;

      let query = this.model.find(filter as FilterQuery<T>);
      query = this.applyFindOptions(query, findOptions);

      if (paginationOptions.sort) {
        query = query.sort(paginationOptions.sort);
      }

      const [data, total] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        this.model.countDocuments(filter as FilterQuery<T>)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async count(filter: Partial<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter as FilterQuery<T>);
    } catch (error) {
      this.handleError(error);
    }
  }

  async exists(filter: Partial<T>): Promise<boolean> {
    try {
      const count = await this.model.countDocuments(filter as FilterQuery<T>).limit(1);
      return count > 0;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ UPDATE OPERATIONS ============

  async update(id: string, data: UpdateInput<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        data as UpdateQuery<T>,
        { new: true, runValidators: true }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateMany(filter: Partial<T>, data: UpdateInput<T>): Promise<number> {
    try {
      const result = await this.model.updateMany(
        filter as FilterQuery<T>,
        data as UpdateQuery<T>,
        { runValidators: true }
      );
      return result.modifiedCount;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneAndUpdate(
    filter: Partial<T>,
    data: UpdateInput<T>,
    options: { upsert?: boolean } = {}
  ): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(
        filter as FilterQuery<T>,
        data as UpdateQuery<T>,
        { new: true, runValidators: true, upsert: options.upsert }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ DELETE OPERATIONS ============

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteMany(filter: Partial<T>): Promise<number> {
    try {
      const result = await this.model.deleteMany(filter as FilterQuery<T>);
      return result.deletedCount || 0;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ TRANSACTION SUPPORT ============

  async startSession(): Promise<ClientSession> {
    return await this.model.db.startSession();
  }
}