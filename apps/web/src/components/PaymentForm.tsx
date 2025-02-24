'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { paymentSchema, type PaymentFormData } from '@/lib/schema'
import { ZodError } from 'zod'
import Image from 'next/image'
import { useFormStatus } from 'react-dom'
import { getAxiosInstance } from '@/lib/axios.instance'

export default function PaymentForm() {
  const router = useRouter()
  const { pending } = useFormStatus()
  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    amount: 0,
  })
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PaymentFormData, string>>
  >({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number.parseFloat(value) || 0 : value,
    }))
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        const formErrors: Partial<Record<keyof PaymentFormData, string>> = {}
        const validationErrors: string[] = []

        error.errors.forEach((err) => {
          const field = err.path[0] as keyof PaymentFormData
          const value = formData[field]

          if (
            !value ||
            value === 0 ||
            value === '' ||
            err.message === 'El nombre es requerido' ||
            err.message === 'Required'
          ) {
            formErrors[field] = err.message
          } else if (value) {
            validationErrors.push(err.message)
          } else {
            formErrors[field] = err.message
          }
        })

        if (Object.keys(formErrors).length > 0) {
          setFieldErrors(formErrors)
          if (validationErrors.length === 0) {
            return
          }
        }

        if (validationErrors.length > 0) {
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
        }
      } else {
        console.error('Error al procesar el pago:', error)
        router.push('/error?message=Error+inesperado+al+procesar+el+pago')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full max-w-lg border rounded-lg border-gray-300 p-8"
    >
      <div className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] p-6 rounded-lg shadow-lg mb-4">
        <Image
          src="https://zippy.cl/wp-content/uploads/2024/03/01-logotipo-blanco.svg"
          alt="logo"
          className="drop-shadow-lg w-64"
          width={500}
          height={300}
          priority
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nombre completo *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            fieldErrors.fullName ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.fullName && (
          <p className="text-red-500 text-xs italic">{fieldErrors.fullName}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="cardNumber"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Número de tarjeta *
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            fieldErrors.cardNumber ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.cardNumber && (
          <p className="text-red-500 text-xs italic">
            {fieldErrors.cardNumber}
          </p>
        )}
      </div>
      <div className="mb-4 flex">
        <div className="w-1/2 pr-2">
          <label
            htmlFor="expirationDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de expiración *
          </label>
          <input
            type="month"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              fieldErrors.expirationDate ? 'border-red-500' : ''
            }`}
          />
          {fieldErrors.expirationDate && (
            <p className="text-red-500 text-xs italic">
              {fieldErrors.expirationDate}
            </p>
          )}
        </div>
        <div className="w-1/2 pl-2">
          <label
            htmlFor="cvv"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              fieldErrors.cvv ? 'border-red-500' : ''
            }`}
          />
          {fieldErrors.cvv && (
            <p className="text-red-500 text-xs italic">{fieldErrors.cvv}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="amount"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Monto a pagar (CLP) *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount || ''}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            fieldErrors.amount ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.amount && (
          <p className="text-red-500 text-xs italic">{fieldErrors.amount}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] hover:opacity-90 text-white font-bold py-2 px-4 rounded text-center"
        >
          Pagar
        </button>
      </div>
    </form>
  )
}
