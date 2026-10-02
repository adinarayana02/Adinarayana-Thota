import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Profile from '@/models/Profile';

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne().lean();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const body = await req.json();
    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      profile = await Profile.create(body);
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
