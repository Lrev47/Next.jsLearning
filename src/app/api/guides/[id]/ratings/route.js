import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// Add or update a rating for a guide
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { rating } = data;

    // Validate rating
    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if guide exists
    const guide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Check if user has already rated this guide
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_guideId: {
          userId: session.user.id,
          guideId: id,
        },
      },
    });

    let result;

    if (existingRating) {
      // Update existing rating
      result = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
        },
      });
    } else {
      // Create new rating
      result = await prisma.rating.create({
        data: {
          rating,
          guide: {
            connect: { id },
          },
          user: {
            connect: { id: session.user.id },
          },
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding rating:', error);
    return NextResponse.json(
      { error: 'Failed to add rating' },
      { status: 500 }
    );
  }
} 