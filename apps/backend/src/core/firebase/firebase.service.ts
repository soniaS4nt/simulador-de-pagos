/* import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  public firestore: Firestore;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!getApps().length) {
      const credentialsPath = this.configService.get<string>('firebase.credentialsPath');
      const projectId = this.configService.get<string>('firebase.projectId');

      if (!credentialsPath || !fs.existsSync(credentialsPath)) {
        this.logger.error(`❌ Archivo de credenciales de Firebase no encontrado: ${credentialsPath}`);
        return;
      }
      
      initializeApp({
        credential: cert(credentialsPath),
        projectId,
      });
      
      this.logger.log('✅ Firebase Admin SDK initialized');
    } else {
      this.logger.log('⚠️ Firebase Admin SDK already initialized');
    }

    this.firestore = getFirestore(getApp());
  }
}
 */

import { registerAs } from '@nestjs/config';

export const firebaseConfig = registerAs('firebase', () => ({
  credentialsPath: process.env.FIREBASE_CREDENTIALS_PATH,
  projectId: process.env.FIREBASE_PROJECT_ID,
}));


// src/firebase/firebase.service.ts
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Storage } from 'firebase-admin/storage';
import { Auth, getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FirebaseService.name);
  public firestore: Firestore;
  private auth: Auth;
  private storage: Storage;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeFirebase();
  }

  onModuleDestroy() {
    // Limpieza al detener la aplicación
    if (getApps().length) {
      this.logger.log('Cerrando conexiones de Firebase');
    }
  }

  private async initializeFirebase() {
    try {
      if (!getApps().length) {
        const credentialsPath = this.configService.get<string>('firebase.credentialsPath');
        const projectId = this.configService.get<string>('firebase.projectId');

        if (!credentialsPath || !fs.existsSync(credentialsPath)) {
          throw new Error(`Archivo de credenciales no encontrado: ${credentialsPath}`);
        }

        // Verificar que el archivo de credenciales es válido
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        this.validateCredentials(credentials);

        const app = initializeApp({
          credential: cert(credentialsPath),
          projectId,
        });

        this.firestore = getFirestore(app);

        // Configurar Firestore
        this.firestore.settings({
          ignoreUndefinedProperties: true,
          timestampsInSnapshots: true,
        });

        this.logger.log('✅ Firebase Admin SDK inicializado correctamente');
      } else {
        const app = getApp();
        this.firestore = getFirestore(app);
        this.logger.log('⚠️ Usando instancia existente de Firebase Admin SDK');
      }

      // Verificar conexión
      await this.testConnection();

    } catch (error:any) {
      this.logger.error('❌ Error al inicializar Firebase Admin SDK', error.stack);
      throw error;
    }
  }

  private validateCredentials(credentials: any) {
    const requiredFields = ['project_id', 'private_key', 'client_email'];
    for (const field of requiredFields) {
      if (!credentials[field]) {
        throw new Error(`Credencial inválida: falta el campo ${field}`);
      }
    }
  }

  private async testConnection() {
    try {
      // Test Firestore
      await this.firestore.listCollections();
      this.logger.log('✅ Conexión a Firestore verificada');

    } catch (error: any) {
      this.logger.error('❌ Error al verificar conexiones', error.stack);
      throw error;
    }
  }

  // Getters públicos para los servicios
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
