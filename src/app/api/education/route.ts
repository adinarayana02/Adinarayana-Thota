import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Education from '@/models/Education';

export async function GET() {
  try {
    await dbConnect();
    const educations = await Education.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json(educations);
  } catch (error) {
    console.error('Education GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const body = await req.json();
    const education = await Education.create(body);

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Education POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
