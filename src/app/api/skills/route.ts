import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Skill from '@/models/Skill'

export async function GET() {
  try {
    await dbConnect()
    const skills = await Skill.find().sort({ category: 1, order: 1 }).lean()
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Skills GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()

    const body = await req.json()
    const skill = await Skill.create(body)

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Skills POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
