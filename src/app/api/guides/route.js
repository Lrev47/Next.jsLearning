import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

// GET /api/guides - Get all guides
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      published: true,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // Get guides with pagination
    const guides = await prisma.guide.findMany({
      where,
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
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // Get total count for pagination
    const total = await prisma.guide.count({ where })

    return NextResponse.json({
      guides,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guides' },
      { status: 500 }
    )
  }
}

// POST /api/guides - Create a new guide
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { title, slug, description, content, categoryId, published } = data

    // Validate required fields
    if (!title || !slug || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug is already in use
    const existingGuide = await prisma.guide.findUnique({
      where: { slug },
    })

    if (existingGuide) {
      return NextResponse.json(
        { error: 'Slug already in use' },
        { status: 409 }
      )
    }

    // Create guide
    const guide = await prisma.guide.create({
      data: {
        title,
        slug,
        description,
        content,
        published: published || false,
        author: {
          connect: { id: session.user.id },
        },
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
      },
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
    })

    return NextResponse.json(guide, { status: 201 })
  } catch (error) {
    console.error('Error creating guide:', error)
    return NextResponse.json(
      { error: 'Failed to create guide' },
      { status: 500 }
    )
  }
} 