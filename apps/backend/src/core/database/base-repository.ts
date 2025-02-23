import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BaseEntity, BaseRepository, QueryOptions } from './interfaces';
import { FirebaseService } from '../firebase/firebase.service';
import {
  CollectionReference,
  DocumentData,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  WriteResult
} from 'firebase-admin/firestore';

@Injectable()
export abstract class FirebaseBaseRepository<T extends BaseEntity> implements BaseRepository<T> {
  protected abstract collectionName: string;
  protected logger: Logger;

  constructor(
    protected readonly firebaseService: FirebaseService
  ) {
    this.logger = new Logger(this.constructor.name);
  }


  protected get collection(): CollectionReference<DocumentData> {
    return this.firebaseService.getFirestore().collection(this.collectionName);
  }

  /**
   * Crea un nuevo documento
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const timestamp = this.firebaseService.serverTimestamp();
      const docRef = this.collection.doc();

      await docRef.set({
        ...data,
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      });

      const doc = await docRef.get();
      return this.mapToEntity(doc);
    } catch (error) {
      this.logger.error(`Error creating document in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Crea múltiples documentos en una operación batch
   */
  async createMany(dataArray: Partial<T>[]): Promise<T[]> {
    try {
      const batch = this.firebaseService.getFirestore().batch();
      const timestamp = this.firebaseService.serverTimestamp();
      const docs: T[] = [];

      for (const data of dataArray) {
        const docRef = this.collection.doc();
        batch.set(docRef, {
          ...data,
          id: docRef.id,
          createdAt: timestamp,
          updatedAt: timestamp,
          deletedAt: null,
        });
        docs.push({ ...data, id: docRef.id } as T);
      }

      await batch.commit();
      return docs;
    } catch (error) {
      this.logger.error(`Error creating multiple documents in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Encuentra un documento por ID
   */
  async findById(id: string): Promise<T> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Document with id ${id} not found in ${this.collectionName}`);
      }
      return this.mapToEntity(doc);
    } catch (error) {
      this.logger.error(`Error finding document by id in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Encuentra documentos según los criterios especificados
   */
  async find(options?: QueryOptions): Promise<T[]> {
    try {
      let query: Query = this.collection;

      // Aplicar condiciones where
      if (options?.where) {
        options.where.forEach(({ field, operator, value }) => {
          query = query.where(field, operator, value);
        });
      }

      // Filtrar documentos no eliminados por defecto
      query = query.where('deletedAt', '==', null);

      // Aplicar ordenamiento
      if (options?.orderBy) {
        options.orderBy.forEach(({ field, direction }) => {
          query = query.orderBy(field, direction);
        });
      }

      // Aplicar paginación
      if (options?.startAfter) {
        query = query.startAfter(options.startAfter);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => this.mapToEntity(doc));
    } catch (error) {
      this.logger.error(`Error finding documents in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Actualiza un documento
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException(`Document with id ${id} not found in ${this.collectionName}`);
      }

      const updateData = {
        ...data,
        updatedAt: this.firebaseService.serverTimestamp(),
      };

      await docRef.update(updateData);
      const updated = await docRef.get();
      return this.mapToEntity(updated);
    } catch (error) {
      this.logger.error(`Error updating document in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Elimina un documento físicamente
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.doc(id).delete();
      return result instanceof WriteResult;
    } catch (error) {
      this.logger.error(`Error deleting document in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Eliminación suave de un documento
   */
  async softDelete(id: string): Promise<T> {
    try {
      const docRef = this.collection.doc(id);
      await docRef.update({
        deletedAt: this.firebaseService.serverTimestamp(),
      });

      const doc = await docRef.get();
      return this.mapToEntity(doc);
    } catch (error) {
      this.logger.error(`Error soft-deleting document in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Restaura un documento eliminado suavemente
   */
  async restore(id: string): Promise<T> {
    try {
      const docRef = this.collection.doc(id);
      await docRef.update({
        deletedAt: null,
        updatedAt: this.firebaseService.serverTimestamp(),
      });

      const doc = await docRef.get();
      return this.mapToEntity(doc);
    } catch (error) {
      this.logger.error(`Error restoring document in ${this.collectionName}`, error);
      throw error;
    }
  }

  /**
   * Ejecuta una transacción
   */
  async transaction<R>(
    callback: (transaction: FirebaseFirestore.Transaction) => Promise<R>
  ): Promise<R> {
    return this.firebaseService.getFirestore().runTransaction(callback);
  }

  /**
   * Convierte un DocumentSnapshot a una entidad
   */
  protected mapToEntity(doc: DocumentSnapshot): T {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
      deletedAt: data?.deletedAt?.toDate() || null,
    } as T;
  }

  /**
   * Cuenta documentos según los criterios especificados
   */
  async count(options?: QueryOptions): Promise<number> {
    try {
      const snapshot = await this.find(options);
      return snapshot.length;
    } catch (error) {
      this.logger.error(`Error counting documents in ${this.collectionName}`, error);
      throw error;
    }
  }
}