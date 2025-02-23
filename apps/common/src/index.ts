export interface PaymentSimulation {
    amount: number;
    cardType: "visa" | "mastercard";
    installments: number;
  }
  
  export function calculateInstallments(payment: PaymentSimulation): number[] {
    return Array(payment.installments).fill(payment.amount / payment.installments);
  }
  
export interface SearchParams {
  fullName: string
  cardNumber: string
  amount: number
  createdAt: string
}