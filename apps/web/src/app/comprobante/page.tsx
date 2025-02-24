'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { SearchParams } from '@simulador/common'
import { formatCurrency, formatDate } from '@/lib/utils'

function ReceiptContent({ searchParams }: { searchParams: SearchParams }) {
  const { fullName, cardNumber, amount, createdAt } = searchParams

  const formattedDate = formatDate(createdAt)
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      {/* Logo Section */}
      <div className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] p-6 rounded-lg shadow-lg mb-6">
        <img
          src="https://zippy.cl/wp-content/uploads/2024/03/01-logotipo-blanco.svg"
          alt="logo"
          className="drop-shadow-lg w-64"
        />
      </div>
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2 text-center text-green-600">
          Pago Exitoso
        </h2>
      </div>
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
        <p>{formatCurrency(amount) + '  CLP'}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Fecha de transacción:</p>
        <p>{formattedDate}</p>
      </div>
      <div className="flex flex-col gap-3 mt-6">
        <Link
          href="/"
          className="bg-gradient-to-br from-[#52D4C0] to-[#254F7A] hover:opacity-90 text-white font-bold py-2 px-4 rounded text-center"
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
