import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// Update a guide
export async function PATCH(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const data = await request.json();

    // Validate guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
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
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    // Validate guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
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
      { status: 500 }
    );
  }
} 