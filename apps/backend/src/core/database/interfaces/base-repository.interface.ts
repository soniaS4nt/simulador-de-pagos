import { BaseEntity } from "./base-entity.interface";
import { QueryOptions } from "./query-options.interface";

export interface BaseRepository<T extends BaseEntity> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T>;
  find(options?: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<T>;  
  restore(id: string): Promise<T>;
}