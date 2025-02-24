import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FirebaseService.name);
  public firestore: Firestore;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeFirebase();
  }

  onModuleDestroy() {
    if (getApps().length) {
      this.logger.log('Cerrando conexiones de Firebase');
    }
  }

  private async initializeFirebase() {
    try {
      if (!getApps().length) {
        const projectId = this.configService.get<string>('firebase.projectId');
        const clientEmail = this.configService.get<string>('firebase.clientEmail');
        const privateKey = this.configService.get<string>('firebase.privateKey');

        // Validar que tenemos todas las credenciales necesarias
        if (!projectId || !clientEmail || !privateKey) {
          throw new Error('Credenciales de Firebase incompletas');
        }

        const app = initializeApp({
          credential: credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });

        this.firestore = getFirestore(app);

        // Configurar Firestore
        this.firestore.settings({
          ignoreUndefinedProperties: true,
        });

        this.logger.log('✅ Firebase Admin SDK inicializado correctamente');
      } else {
        const app = getApp();
        this.firestore = getFirestore(app);
        this.logger.log('⚠️ Usando instancia existente de Firebase Admin SDK');
      }

      // Verificar conexión
      await this.testConnection();

    } catch (error) {
      this.logger.error('❌ Error al inicializar Firebase Admin SDK', error);
      throw error;
    }
  }

  private async testConnection() {
    try {
      await this.firestore.listCollections();
      this.logger.log('✅ Conexión a Firestore verificada');
    } catch (error) {
      this.logger.error('❌ Error al verificar conexiones', error);
      throw error;
    }
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

 
  // Métodos de utilidad para transacciones y batch
  async runTransaction<T>(
    callback: (transaction: FirebaseFirestore.Transaction) => Promise<T>
  ): Promise<T> {
    return this.firestore.runTransaction(callback);
  }

  createBatch(): FirebaseFirestore.WriteBatch {
    return this.firestore.batch();
  }

  // Método de utilidad para timestamps
  serverTimestamp() {
    return FirebaseFirestore.FieldValue.serverTimestamp();
  }
}
