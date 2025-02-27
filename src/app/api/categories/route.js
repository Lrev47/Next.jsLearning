import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/categories - Get all categories
export async function GET(request) {
  try {
    // Get all categories with count of guides in each category
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            guides: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, slug, color } = body

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      )
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        color
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 