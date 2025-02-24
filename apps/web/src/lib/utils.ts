export function formatDate(date: Date): string {
  return date.toLocaleString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  })
}

export const formatCurrency = (amount: number) => {
  return Number(amount).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  });
};
