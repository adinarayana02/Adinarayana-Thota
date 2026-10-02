import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Project from '@/models/Project'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    await dbConnect()

    const isObjectId = mongoose.Types.ObjectId.isValid(id)
    const project = isObjectId
      ? await Project.findById(id).lean()
      : await Project.findOne({ slug: id }).lean()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project GET error:', error)
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
    const project = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await dbConnect()

    const project = await Project.findByIdAndDelete(id).lean()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Project DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
