import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Certificate from '@/models/Certificate'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    await dbConnect()

    const certificate = await Certificate.findById(id).lean()

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Certificate GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const body = await req.json()
    const certificate = await Certificate.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean()

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Certificate PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const certificate = await Certificate.findByIdAndDelete(id).lean()

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Certificate deleted successfully' })
  } catch (error) {
    console.error('Certificate DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
