export interface IPayment {
  fullName: string
  cardNumber: string
  expirationDate: string
  cvv: string
  amount: number
}

export interface SearchParams extends Omit<IPayment, 'expirationDate' | 'cvv'> {
  createdAt: Date
}

export interface ErrorContentProps {
  searchParams: Partial<Omit<IPayment, 'expirationDate' | 'cvv'>> & {
    message?: string
    errors?: string
  }
}