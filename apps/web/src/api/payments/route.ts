import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { data } = await axios.post('http://localhost:4000/payments', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        res.status(201).json(data);
    } catch (error:any) {
        if (axios.isAxiosError(error)) {
            res.status(error.response?.status || 500).json({ 
                message: error.response?.data?.message || 'Error processing payment'
            });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


/* import { dbConnect } from '@/lib/mongodb'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import bookingPaymentModel from '@/models/bookingPayment'
// Agrega credenciales
const accessToken = process.env.YOUR_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken: accessToken!,
})
export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    dbConnect()

    const body = await request
      .json()
      .then((data) => data as { data: { id: string } })

    // Obtener información del pago
    const payment = await new Payment(client).get({ id: body.data.id })

    // Crear objeto para almacenar en la base de datos
    const bookingPayment = {
      id: payment.id,
      amount: payment.transaction_amount,
      message: payment.description,
    }

    // Verificar si ya existe en la base de datos antes de duplicar
    const existingPayment = await bookingPaymentModel.findOne({
      id: bookingPayment.id,
    })
    if (!existingPayment) {
      // Guardar en la base de datos
      await bookingPaymentModel.create(bookingPayment)
    } else {
      console.log('El pago ya existe en la base de datos.')
    }

    // Devolver una respuesta exitosa
    return NextResponse.next({
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': '0d5020ed-1af6-469c-ae06-c3bec19954bb',
        Authorization: `${process.env.YOUR_ACCESS_TOKEN}`,
      },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }
}
 */