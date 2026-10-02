import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Certificate from '@/models/Certificate'

export async function GET() {
  try {
    await dbConnect()
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Certificates GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()

    const body = await req.json()
    const certificate = await Certificate.create(body)

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Certificates POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
