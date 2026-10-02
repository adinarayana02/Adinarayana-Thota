import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Blog from '@/models/Blog';
import { fallbackBlogs } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    // If authenticated, return all. If public, return only published ones.
    const query = session ? {} : { published: true };
    const blogs = await Blog.find(query).sort({ publishedAt: -1, createdAt: -1 }).lean();
    if (blogs && blogs.length > 0) {
      return NextResponse.json(blogs);
    }
    return NextResponse.json(fallbackBlogs);
  } catch (error) {
    console.error('Blog GET error, using fallback blogs:', error);
    return NextResponse.json(fallbackBlogs);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const body = await req.json();
    const blog = await Blog.create(body);

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
