import { z } from "zod"

export const paymentSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  cardNumber: z.string().regex(/^\d{16}$/, "El número de tarjeta debe tener 16 dígitos"),
  expirationDate: z.string().regex(/^\d{4}-\d{2}$/, "La fecha de expiración debe tener el formato YYYY-MM"),
  cvv: z.string().regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
  amount: z.number().positive("El monto debe ser positivo").min(1000, "El monto mínimo es 1000 CLP"),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

