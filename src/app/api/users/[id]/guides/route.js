import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// Get guides by user ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users to view their own guides or admins to view any guides
    if (id !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      authorId: id,
    };

    // Filter by published status if provided
    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    // Get guides with pagination
    const guides = await prisma.guide.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.guide.count({ where });

    return NextResponse.json({
      guides,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user guides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user guides' },
      { status: 500 }
    );
  }
} 