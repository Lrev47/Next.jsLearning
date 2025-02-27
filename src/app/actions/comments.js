'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

// Add a comment to a guide
export async function addComment(formData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { error: 'You must be logged in to comment' }
    }

    const guideId = formData.get('guideId')
    const content = formData.get('content')

    if (!guideId || !content) {
      return { error: 'Missing required fields' }
    }

    if (content.length < 3) {
      return { error: 'Comment is too short' }
    }

    // Verify guide exists
    const guide = await prisma.guide.findUnique({
      where: { id: guideId },
      select: { slug: true }
    })

    if (!guide) {
      return { error: 'Guide not found' }
    }

    // Add comment
    const comment = await prisma.comment.create({
      data: {
        content,
        guideId,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    // Revalidate the guide page to show new comment
    revalidatePath(`/guides/${guide.slug}`)
    return { success: true, comment }
  } catch (error) {
    console.error('Comment error:', error)
    return { error: 'Failed to add comment' }
  }
}

// Delete a comment
export async function deleteComment(formData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { error: 'You must be logged in' }
    }

    const commentId = formData.get('commentId')
    const guideSlug = formData.get('guideSlug')

    if (!commentId) {
      return { error: 'Missing comment ID' }
    }

    // Get the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
        guideId: true,
        guide: {
          select: { slug: true }
        }
      }
    })

    if (!comment) {
      return { error: 'Comment not found' }
    }

    // Check authorization - user can delete own comments, admins can delete any
    if (comment.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { error: 'Not authorized to delete this comment' }
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: commentId }
    })

    // Revalidate page
    revalidatePath(`/guides/${guideSlug || comment.guide.slug}`)
    return { success: true }
  } catch (error) {
    console.error('Delete comment error:', error)
    return { error: 'Failed to delete comment' }
  }
} 