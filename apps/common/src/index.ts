export interface SearchParams {
  fullName: string
  cardNumber: string
  amount: number
  createdAt: Date
}

export interface ErrorContentProps {
  searchParams: {
    message?: string
    errors?: string
    fullName?: string
    cardNumber?: string
    amount?: number
  }
}