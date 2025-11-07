import { IBaseRepository } from '../../repositories/base/IBaseRepository';

export interface IBaseService<T> {
  getById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: any): Promise<T[]>;
}

export abstract class BaseService<T> implements IBaseService<T> {
  protected readonly repo: IBaseRepository<T>;

  constructor(repo: IBaseRepository<T>) {
    this.repo = repo;
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }

  async create(data: Partial<T>) {
    return this.repo.create(data as T);
  }

  async update(id: string, data: Partial<T>) {
    return this.repo.update(id, data as T);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async list(filter: any = {}) {
    return this.repo.findAll(filter);
  }
}