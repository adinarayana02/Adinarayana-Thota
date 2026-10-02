import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import JobPost from '@/models/JobPost';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    // If authenticated, return all jobs. If public, return only public ones.
    const query = session ? {} : { isPublic: true };
    const jobs = await JobPost.find(query).sort({ appliedDate: -1, createdAt: -1 }).lean();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const body = await req.json();
    const job = await JobPost.create(body);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Jobs POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
