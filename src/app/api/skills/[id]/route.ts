import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Skill from '@/models/Skill'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    await dbConnect()

    const skill = await Skill.findById(id).lean()

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Skill GET error:', error)
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
    const skill = await Skill.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean()

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Skill PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const skill = await Skill.findByIdAndDelete(id).lean()

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Skill DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
