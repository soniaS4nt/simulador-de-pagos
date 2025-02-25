'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { usePaymentForm } from '@/hooks/usePaymentForm'

export default function PaymentForm() {
  const [hasInteracted, setHasInteracted] = useState(false)
  const {
    formData,
    fieldErrors,
    isSubmitting,
    areAllFieldsFilled,
    handleChange,
    handleSubmit,
  } = usePaymentForm()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteracted(true)
    handleChange(event)
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
        <div className="w-9/12 pr-2">
          <label
            htmlFor="expirationDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de Expiración (MM/YY) *
          </label>
          <input
            type="text"
            id="expirationDate"
            name="expirationDate"
            placeholder="MM/YY"
            maxLength={5}
            value={formData.expirationDate}
            onChange={handleInputChange}
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
        <div className="w-1/4 pl-2">
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
            onChange={handleInputChange}
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
          onChange={handleInputChange}
          min="1"
          step="1"
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
          disabled={isSubmitting || !areAllFieldsFilled}
          className={`font-bold py-2 px-4 rounded text-center ${
            areAllFieldsFilled && !isSubmitting
              ? 'bg-gradient-to-br from-[#52D4C0] to-[#254F7A] hover:opacity-90 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Procesando...' : 'Pagar'}
        </button>
        {!areAllFieldsFilled && hasInteracted && (
          <p className="text-red-500 text-xs text-center">
            Debes completar todos los campos requeridos *
          </p>
        )}
      </div>
    </form>
  )
}
