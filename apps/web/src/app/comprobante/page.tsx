'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { SearchParams } from '@simulador/common'

function formatDate(date: Date): string {
  return date.toLocaleString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  })
}

function ReceiptContent({ searchParams }: { searchParams: SearchParams }) {
  const { fullName, cardNumber, amount, createdAt } = searchParams

  const formattedDate = formatDate(createdAt)
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
        Pago Exitoso
      </h2>
      <div className="mb-4">
        <p className="font-semibold">Nombre:</p>
        <p>{fullName}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Últimos 4 dígitos de la tarjeta:</p>
        <p>**** **** **** {cardNumber.slice(-4)}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Monto pagado:</p>
        <p>
          $
          {typeof amount === 'number' ? amount.toLocaleString('es-CL') : amount}{' '}
          CLP
        </p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Fecha de transacción:</p>
        <p>{formattedDate}</p>
      </div>
      <div className="text-center">
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default function Comprobante({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>Cargando...</div>}>
        <ReceiptContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
