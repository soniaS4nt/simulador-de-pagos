import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ZodError } from 'zod'
import { paymentSchema, type PaymentFormData } from '@/lib/schema'
import { PAYMENT_FORM_INITIAL_STATE } from '@/lib/utils'
import { getAxiosInstance } from '@/lib/axios.instance'

type FieldErrors = Partial<Record<keyof PaymentFormData, string>>

export const usePaymentForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<PaymentFormData>(PAYMENT_FORM_INITIAL_STATE)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false)

  useEffect(() => {
    const requiredFields: (keyof PaymentFormData)[] = [
      'fullName', 
      'cardNumber', 
      'expirationDate', 
      'cvv', 
      'amount'
    ]
    
    const allFilled = requiredFields.every(field => {
      if (field === 'amount') {
        return formData[field] > 0
      }
      return !!formData[field]
    })
    
    setAreAllFieldsFilled(allFilled)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    const updatedFormData = {
      ...formData,
      [name]: name === 'amount' ? Number.parseFloat(value) || 0 : value,
    }
    
    setFormData(updatedFormData)
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: '',
    }))
    
    try {
      const fieldSchema = paymentSchema.shape[name as keyof PaymentFormData]
      fieldSchema.parse(updatedFormData[name as keyof PaymentFormData])
    } catch (error) {
      if (error instanceof ZodError) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: error.errors[0]?.message || 'Campo inválido',
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const validatedData = paymentSchema.parse(formData)
      setFieldErrors({})

      const { data } = await getAxiosInstance({ baseURL: 'API_NEXT' }).post(
        '/api/payments',
        validatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const paymentData = {
        ...data.data,
        createdAt: new Date().toISOString(),
      }

      if (data.success) {
        router.push(`/comprobante?${new URLSearchParams(paymentData)}`)
      } else {
        const errorMessages = []
        if (data.errors) errorMessages.push(...data.errors)
        if (data.message) errorMessages.push(data.message)

        router.push(
          `/error?${new URLSearchParams({
            ...paymentData,
            errors: JSON.stringify(errorMessages),
          })}`
        )
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FieldErrors = {}
        const validationErrors: string[] = []
        
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof PaymentFormData
            newErrors[field] = err.message
            validationErrors.push(err.message)
          }
        })
        
        setFieldErrors(newErrors)
        
        router.push(
          `/error?${new URLSearchParams({
            ...Object.fromEntries(
              Object.entries(formData).map(([key, value]) => [
                key,
                String(value),
              ])
            ),
            errors: JSON.stringify(validationErrors),
          })}`
        )
      } else {
        router.push('/error?message=Error+inesperado+al+procesar+el+pago')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(PAYMENT_FORM_INITIAL_STATE)
    setFieldErrors({})
  }

  return {
    formData,
    fieldErrors,
    isSubmitting,
    areAllFieldsFilled,
    handleChange,
    handleSubmit,
    resetForm
  }
}