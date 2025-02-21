import { Suspense } from 'react'
import Link from 'next/link'

interface SearchParams {
  fullName: string
  lastFourDigits: string
  amount: number
  transactionDate: string
}

function ReceiptContent({ searchParams }: { searchParams: SearchParams }) {
  const { fullName, lastFourDigits, amount, transactionDate } = searchParams

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
        <p>**** **** **** {lastFourDigits}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Monto pagado:</p>
        <p>${amount} CLP</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Fecha de transacción:</p>
        <p>{new Date(transactionDate).toLocaleString()}</p>
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
