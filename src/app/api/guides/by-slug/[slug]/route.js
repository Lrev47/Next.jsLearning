import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/guides/by-slug/[slug] - Get a single guide by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Get the guide
    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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
      }
    });

    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.guide.update({
      where: { id: guide.id },
      data: { viewCount: { increment: 1 } }
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