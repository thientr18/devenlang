import { Document } from 'mongoose';
import {
  PaginationOptions,
  PaginatedResult,
  FindOptions,
  CreateInput,
  UpdateInput
} from '../../types/repository.types';

export interface IBaseRepository<T extends Document> {
  // Create operations
  create(data: CreateInput<T>): Promise<T>;
  createMany(data: CreateInput<T>[]): Promise<T[]>;

  // Read operations
  findById(id: string, options?: FindOptions): Promise<T | null>;
  findOne(filter: Partial<T>, options?: FindOptions): Promise<T | null>;
  findAll(filter?: Partial<T>, options?: FindOptions): Promise<T[]>;
  findWithPagination(
    filter?: Partial<T>,
    paginationOptions?: PaginationOptions,
    findOptions?: FindOptions
  ): Promise<PaginatedResult<T>>;
  count(filter?: Partial<T>): Promise<number>;
  exists(filter: Partial<T>): Promise<boolean>;

  // Update operations
  update(id: string, data: UpdateInput<T>): Promise<T | null>;
  updateMany(filter: Partial<T>, data: UpdateInput<T>): Promise<number>;
  findOneAndUpdate(
    filter: Partial<T>,
    data: UpdateInput<T>,
    options?: { upsert?: boolean }
  ): Promise<T | null>;

  // Delete operations
  delete(id: string): Promise<boolean>;
  deleteMany(filter: Partial<T>): Promise<number>;
  softDelete?(id: string): Promise<boolean>;

  // Transaction support
  startSession(): Promise<any>;
}