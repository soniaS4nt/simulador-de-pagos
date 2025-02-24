// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { paymentSchema } from '@/lib/schema'
import { ZodError } from 'zod'
import {  getAxiosInstance, isAxiosError } from '@/lib/axios.instance'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = paymentSchema.parse(body)
    
    const  {data}  = await getAxiosInstance({ baseURL: 'API_NEST' }).post('/payments', validatedData)
    return NextResponse.json(
      { 
        success: true,
        data: data.data 
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => err.message)
        },
        { status: 400 }
      )
    }

    if (isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || 'Error processing payment'
      const errors = error.response?.data?.errors

      return NextResponse.json(
        { 
          success: false,
          message,
          errors
        },
        { status }
      )
    }

    console.error('Payment processing error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}