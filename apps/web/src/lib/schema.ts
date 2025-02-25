import { z } from "zod"

export const paymentSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  cardNumber: z.string().min(1, "El número de tarjeta es requerido").regex(/^\d{16}$/, "El número de tarjeta debe tener 16 dígitos"),
  expirationDate: z.string()
  .regex(/^\d{4}-\d{2}$/, "La fecha de expiración debe tener el formato YYYY-MM")
  .refine((date) => {
    const [year, month] = date.split('-').map(Number)
    const expirationDate = new Date(year, month - 1) 
    const today = new Date()
    today.setDate(1)
    today.setHours(0, 0, 0, 0)
    expirationDate.setDate(1)
    expirationDate.setHours(0, 0, 0, 0)
    
    return expirationDate >= today
  }, "Fecha de expiración inválida"),
  cvv: z.string().regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
  amount: z.number().positive("El monto debe ser positivo").min(1000, "Monto insuficiente"),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

