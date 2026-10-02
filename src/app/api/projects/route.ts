import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@/lib/auth'
import Project from '@/models/Project'
import { projects as fallbackProjects } from '@/lib/constants'

export async function GET(req: NextRequest) {
  try {
    const conn = await dbConnect()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    if (conn) {
      const filter: Record<string, unknown> = {}
      if (category) filter.category = category
      if (featured === 'true') filter.featured = true

      const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean()
      if (projects && projects.length > 0) {
        return NextResponse.json(projects)
      }
    }

    // Graceful fallback to static projects
    let result = fallbackProjects
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category)
    }
    if (featured === 'true') {
      result = result.filter(p => p.featured)
    }
    return NextResponse.json(result)
  } catch (error) {
    console.debug('Projects GET error, falling back to static constants:', error)
    return NextResponse.json(fallbackProjects)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()

    const body = await req.json()
    const project = await Project.create(body)

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
