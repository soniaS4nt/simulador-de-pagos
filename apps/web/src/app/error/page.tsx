// app/error/page.tsx
'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { ErrorContentProps } from '@simulador/common'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

function ErrorContent({ searchParams }: ErrorContentProps) {
  const errorMessages = searchParams.errors
    ? JSON.parse(decodeURIComponent(searchParams.errors))
    : []

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] p-6 rounded-lg shadow-lg mb-6">
        <Image
          src="https://zippy.cl/wp-content/uploads/2024/03/01-logotipo-blanco.svg"
          alt="logo"
          className="drop-shadow-lg w-64"
          width={500}
          height={300}
          priority
        />
      </div>

      <div className="text-justify mb-6">
        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <h2 className="text-2xl text-center font-bold mb-2 text-red-600">
            Error en el Pago
          </h2>
          {searchParams.message ? (
            <p className="text-red-700">{searchParams.message}</p>
          ) : (
            <ul className="list-disc list-inside text-red-700">
              {errorMessages.map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {searchParams.fullName && (
        <div className="mb-4">
          <p className="font-semibold">Nombre:</p>
          <p className="capitalize">{searchParams.fullName}</p>
        </div>
      )}

      {searchParams.cardNumber && (
        <div className="mb-4">
          <p className="font-semibold">Tarjeta:</p>
          <p>**** **** **** {searchParams.cardNumber.slice(-4)}</p>
        </div>
      )}

      {searchParams.amount && (
        <div className="mb-6">
          <p className="font-semibold">Monto:</p>
          <p>{formatCurrency(searchParams.amount) + '  CLP'}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-6">
        <Link
          href="/"
          className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] hover:opacity-90 text-white font-bold py-2 px-4 rounded text-center"
        >
          Intentar nuevamente
        </Link>
      </div>
    </div>
  )
}

export default function Error({ searchParams }: ErrorContentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <Suspense fallback={<div>Cargando...</div>}>
        <ErrorContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
