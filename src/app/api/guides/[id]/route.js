import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// Get a single guide
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get guide with author, category, comments, and ratings
    const guide = await prisma.guide.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        ratings: {
          select: {
            id: true,
            value: true,
            userId: true,
          },
        },
      },
    });

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Increment view count
    await prisma.guide.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guide' },
      { status: 500 }
    );
  }
}

// Update a guide
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Validate guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Check if user is author or admin
    if (existingGuide.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update guide
    const updatedGuide = await prisma.guide.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(updatedGuide);
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json(
      { error: 'Failed to update guide' },
      { status: 500 }
    );
  }
}

// Delete a guide
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Check if user is author or admin
    if (existingGuide.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete guide
    await prisma.guide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return NextResponse.json(
      { error: 'Failed to delete guide' },
 