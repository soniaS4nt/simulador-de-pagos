import { Injectable } from '@nestjs/common';
import { FirebaseBaseRepository } from 'src/core/database/base-repository';
import { BaseEntity } from 'src/core/database/interfaces';
import { FirebaseService } from 'src/core/firebase/firebase.service';

export interface Payment extends BaseEntity {
    amount: number;
    userId: string;
    status: 'pending' | 'completed' | 'failed';
    description?: string;
  }
@Injectable()
export class PaymentRepository extends FirebaseBaseRepository<Payment> {
  protected collectionName = 'payments';

  constructor(firebaseService: FirebaseService) {
    super(firebaseService);
  }

  async create(payment: Partial<Payment>): Promise<Payment> {
    try {
      const docRef = await this.firebaseService.firestore
        .collection(this.collectionName)
        .add({
          ...payment,
          createdAt: new Date(),
          updatedAt: new Date()
        });

      const doc = await docRef.get();
      return { 
        id: doc.id, 
        ...doc.data() 
      } as Payment;
    } catch (error) {
      throw new Error(`Error creating payment: ${(error as Error).message}`);
    }
  }
  // Métodos específicos para pagos
  async findByUserId(userId: string): Promise<Payment[]> {
    return this.find({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }
}