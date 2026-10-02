import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import ContactMessage from '@/models/ContactMessage'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
