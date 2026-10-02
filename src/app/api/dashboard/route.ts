import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Certificate from '@/models/Certificate';
import Experience from '@/models/Experience';
import Skill from '@/models/Skill';
import Blog from '@/models/Blog';
import ContactMessage from '@/models/ContactMessage';
import JobPost from '@/models/JobPost';
import Education from '@/models/Education';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [
      projectCount,
      certificateCount,
      experienceCount,
      skillCount,
      blogCount,
      publishedBlogCount,
      messageCount,
      unreadMessageCount,
      jobCount,
      educationCount,
    ] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      JobPost.countDocuments(),
      Education.countDocuments(),
    ]);

    return NextResponse.json({
      projects: projectCount,
      certificates: certificateCount,
      experiences: experienceCount,
      skills: skillCount,
      blogs: blogCount,
      publishedBlogs: publishedBlogCount,
      messages: messageCount,
      unreadMessages: unreadMessageCount,
      jobs: jobCount,
      education: educationCount,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
