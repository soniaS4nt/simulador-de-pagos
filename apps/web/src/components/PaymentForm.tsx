'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { paymentSchema, type PaymentFormData } from '@/lib/schema'
import { ZodError } from 'zod'
import axios from 'axios'

export default function PaymentForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    amount: 0,
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentFormData, string>>
  >({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = paymentSchema.parse(formData)
      setErrors({})

      const { data } = await axios.post(
        'http://localhost:4000/payments',
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
        router.push(`/error?${new URLSearchParams(paymentData)}`)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof PaymentFormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof PaymentFormData] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        console.error('Error al procesar el pago:', error)
        router.push('/error?message=Error+inesperado+al+procesar+el+pago')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg border rounded-lg border-gray-300 p-8 "
    >
      <div className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] p-6 rounded-lg shadow-lg mb-4">
        <img
          src="https://zippy.cl/wp-content/uploads/2024/03/01-logotipo-blanco.svg"
          alt="logo"
          className="drop-shadow-lg w-64"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nombre completo
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs italic">{errors.fullName}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="cardNumber"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Número de tarjeta
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-xs italic">{errors.cardNumber}</p>
        )}
      </div>
      <div className="mb-4 flex">
        <div className="w-1/2 pr-2">
          <label
            htmlFor="expirationDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de expiración
          </label>
          <input
            type="month"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.expirationDate && (
            <p className="text-red-500 text-xs italic">
              {errors.expirationDate}
            </p>
          )}
        </div>
        <div className="w-1/2 pl-2">
          <label
            htmlFor="cvv"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs italic">{errors.cvv}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="amount"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Monto a pagar (CLP)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount || ''}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs italic">{errors.amount}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Pagar
        </button>
      </div>
    </form>
  )
}
