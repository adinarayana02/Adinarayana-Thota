import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import ContactMessage from '@/models/ContactMessage'

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const body = await req.json()
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read: body.read ?? true },
      { new: true, runValidators: true }
    ).lean()

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Message PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const message = await ContactMessage.findByIdAndDelete(id).lean()

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Message DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
