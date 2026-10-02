import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';

export async function POST() {
  try {
    await dbConnect();
    const resume = await Resume.findOne();
    if (resume) {
      resume.downloadCount = (resume.downloadCount || 0) + 1;
      await resume.save();
      return NextResponse.json({ success: true, downloadCount: resume.downloadCount });
    }
    return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
  } catch (error) {
    console.error('Resume download tracker error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
