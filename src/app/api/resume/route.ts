import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Resume from '@/models/Resume';

export async function GET() {
  try {
    await dbConnect();
    let resume = await Resume.findOne().lean();
    if (!resume) {
      // Return default if not found
      return NextResponse.json({
        summary: '',
        pdfUrl: 'https://drive.google.com/file/d/1t7Ws-Be5RBMl-QMIKngor6LCMr2gpBQ-/view?usp=sharing',
        highlights: {
          experience: '',
          skills: '',
          projects: '',
          education: '',
          certifications: '',
        },
        downloadCount: 0,
      });
    }
    return NextResponse.json(resume);
  } catch (error) {
    console.error('Resume GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const body = await req.json();
    let resume = await Resume.findOne();

    if (resume) {
      resume = await Resume.findByIdAndUpdate(resume._id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      resume = await Resume.create(body);
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Resume PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
