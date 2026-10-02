import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Experience from '@/models/Experience'
import { experiences as fallbackExperiences } from '@/lib/constants'

export async function GET() {
  try {
    const conn = await dbConnect()
    if (conn) {
      const experiences = await Experience.find()
        .sort({ current: -1, order: 1, createdAt: -1 })
        .lean()
      if (experiences && experiences.length > 0) {
        return NextResponse.json(experiences)
      }
    }
    return NextResponse.json(fallbackExperiences)
  } catch (error) {
    console.debug('Experience GET error, falling back to static constants:', error)
    return NextResponse.json(fallbackExperiences)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()

    const body = await req.json()
    const experience = await Experience.create(body)

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('Experience POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
