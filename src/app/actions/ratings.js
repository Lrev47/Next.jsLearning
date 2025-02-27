'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

// Rate a guide
export async function rateGuide(formData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { error: 'You must be logged in to rate guides' }
    }

    const guideId = formData.get('guideId')
    const value = parseInt(formData.get('value'))

    if (!guideId) {
      return { error: 'Missing guide ID' }
    }

    if (isNaN(value) || value < 1 || value > 5) {
      return { error: 'Rating must be between 1 and 5' }
    }

    // Verify guide exists
    const guide = await prisma.guide.findUnique({
      where: { id: guideId },
      select: { slug: true }
    })

    if (!guide) {
      return { error: 'Guide not found' }
    }

    // Check if user has already rated this guide
    const existingRating = await prisma.rating.findUnique({
      where: {
        guideId_userId: {
          guideId,
          userId: session.user.id
        }
      }
    })

    let rating
    
    if (existingRating) {
      // Update existing rating
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value }
      })
    } else {
      // Create new rating
      rating = await prisma.rating.create({
        data: {
          value,
          guideId,
          userId: session.user.id
        }
      })
    }

    // Get new average rating
    const ratingsData = await prisma.rating.aggregate({
      where: { guideId },
      _avg: { value: true },
      _count: true
    })

    // Revalidate the guide page to show new rating
    revalidatePath(`/guides/${guide.slug}`)
    
    return { 
      success: true, 
      rating,
      averageRating: ratingsData._avg.value,
      totalRatings: ratingsData._count
    }
  } catch (error) {
    console.error('Rating error:', error)
    return { error: 'Failed to submit rating' }
  }
} 