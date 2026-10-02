import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Blog from '@/models/Blog';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const session = await auth();

    // Find by either id or slug
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    const blog = await Blog.findOne(query).lean();
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    if (!blog.published && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    const body = await req.json();

    // If publishing, set publishedAt if not set
    if (body.published && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Blog PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
