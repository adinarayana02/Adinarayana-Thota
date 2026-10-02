import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import ContactMessage from '@/models/ContactMessage'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required: name, email, subject, message' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    })

    return NextResponse.json(
      { message: 'Message sent successfully', id: contactMessage._id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
