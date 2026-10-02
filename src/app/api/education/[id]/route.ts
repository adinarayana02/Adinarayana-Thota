import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Education from '@/models/Education';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await dbConnect();

    const education = await Education.findById(id).lean();

    if (!education) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error('Education GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    const body = await req.json();
    const education = await Education.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!education) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error('Education PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    const education = await Education.findByIdAndDelete(id).lean();

    if (!education) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('Education DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
