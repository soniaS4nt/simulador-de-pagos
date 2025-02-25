import { type PaymentFormData } from './schema'

export const formatDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Santiago'
  };

  return new Date(date).toLocaleString("es-CL", options);
};

export const formatCurrency = (amount: number) => {
  return Number(amount).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  });
};


export const PAYMENT_FORM_INITIAL_STATE: PaymentFormData = {
  fullName: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  amount: 0,
}