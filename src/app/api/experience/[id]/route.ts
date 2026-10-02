import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Experience from '@/models/Experience'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    await dbConnect()

    const experience = await Experience.findById(id).lean()

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Experience GET error:', error)
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
    const experience = await Experience.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean()

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Experience PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const experience = await Experience.findByIdAndDelete(id).lean()

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('Experience DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
