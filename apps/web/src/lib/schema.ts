import { z } from "zod"

export const paymentSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  cardNumber: z.string().min(1, "El número de tarjeta es requerido").regex(/^\d{16}$/, "El número de tarjeta debe tener 16 dígitos"),
  expirationDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato inválido. Debe ser MM/YY')
    .refine((val) => {
      try {
        // Validar que la fecha no esté expirada
        const [month, year] = val.split('/');
        const currentYear = new Date().getFullYear() % 100; 
        const currentMonth = new Date().getMonth() + 1; 
        
        const expMonth = parseInt(month, 10);
        const expYear = parseInt(year, 10);
        
        // Verificar si la tarjeta ha expirado
        return (expYear > currentYear) || 
               (expYear === currentYear && expMonth >= currentMonth);
      } catch (e) {
        return false;
      }
    }, 'La tarjeta ha expirado'),
  cvv: z.string().regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
  amount: z.number().positive("El monto debe ser positivo").min(1000, "Monto insuficiente"),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

