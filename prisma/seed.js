const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', admin.id)

  // Create regular user
  const userPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('Regular user created:', user.id)

  // Create categories
  const categories = [
    { name: 'Beginner', slug: 'beginner', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    { name: 'Fundamental', slug: 'fundamental', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
    { name: 'Advanced', slug: 'advanced', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
    { name: 'Deployment', slug: 'deployment', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
    { name: 'Quality', slug: 'quality', color: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }
  console.log('Categories created')

  // Create sample guides
  const guidesData = [
    {
      title: 'Getting Started with Next.js',
      slug: 'getting-started',
      description: 'Learn how to set up and start a new Next.js project from scratch.',
      content: `# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering, static site generation, and more. This guide will help you get started with Next.js.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:
- Node.js 18.17 or later
- macOS, Windows (including WSL), or Linux

## Creating a New Project

The easiest way to get started with Next.js is to use the \`create-next-app\` CLI tool. This tool sets up everything automatically for you.

\`\`\`bash
# Create a new Next.js project with create-next-app
npx create-next-app@latest my-nextjs-app
\`\`\`

You'll be asked several questions about your project setup. After completing these, your project will be created with the chosen configuration.

## Starting the Development Server

After the installation is complete, navigate to your project directory and start the development server:

\`\`\`bash
cd my-nextjs-app
npm run dev
\`\`\`

Open http://localhost:3000 in your browser to see your new Next.js application.
`,
      published: true,
      categoryId: 1, // Will be filled in the code after category creation
      authorId: admin.id,
    },
    {
      title: 'Next.js Routing',
      slug: 'routing',
      description: 'Understand how the App Router works and how to implement nested layouts.',
      content: `# Next.js Routing

Next.js provides a file-system based router that is built on top of React Server Components. This guide will help you understand how routing works in Next.js with the App Router.

## App Router Basics

In Next.js, the App Router uses a folder structure to define routes:

- Each folder represents a route segment
- \`page.js\` files are used to make a route segment publicly accessible
- \`layout.js\` files define shared UI for a segment and its children

## Creating Routes

To create a route, add a \`page.js\` file inside a folder:

\`\`\`jsx
// app/page.js (root route)
export default function Home() {
  return <h1>Home Page</h1>
}

// app/about/page.js (/about route)
export default function About() {
  return <h1>About Page</h1>
}
\`\`\`

## Nested Layouts

One of the most powerful features of the App Router is nested layouts:

\`\`\`jsx
// app/layout.js (root layout)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>Site Header</header>
        {children}
        <footer>Site Footer</footer>
      </body>
    </html>
  )
}

// app/blog/layout.js (blog layout)
export default function BlogLayout({ children }) {
  return (
    <div>
      <nav>Blog Navigation</nav>
      {children}
    </div>
  )
}
\`\`\`

## Dynamic Routes

You can create dynamic routes using folder names with square brackets:

\`\`\`jsx
// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  return <h1>Blog Post: {params.slug}</h1>
}
\`\`\`

This powerful routing system allows for complex applications with optimized code splitting and loading.
`,
      published: true,
      categoryId: 2,
      authorId: admin.id,
    },
    {
      title: 'Data Fetching in Next.js',
      slug: 'data-fetching',
      description: 'Learn different methods for fetching data in Next.js applications.',
      content: `# Data Fetching in Next.js

Next.js provides multiple ways to fetch data in your application. This guide explores the different data fetching strategies available.

## Server Component Data Fetching

In React Server Components, you can fetch data directly in the component:

\`\`\`jsx
// app/users/page.js
async function getUsers() {
  const res = await fetch('https://api.example.com/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
\`\`\`

## Static Data with generateStaticParams

For static pages with dynamic routes, use \`generateStaticParams\`:

\`\`\`jsx
// app/posts/[slug]/page.js
export async function generateStaticParams() {
  const posts = await getPosts()
  
  return posts.map(post => ({
    slug: post.slug
  }))
}

export default async function Post({ params }) {
  const post = await getPostBySlug(params.slug)
  return <article>{/* Post content */}</article>
}
\`\`\`

## Client-Side Data Fetching

For client components that need to fetch data on the client:

\`\`\`jsx
'use client'

import { useState, useEffect } from 'react'

export default function ClientPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) return <p>Loading...</p>
  
  return <div>{/* Render data */}</div>
}
\`\`\`

## SWR for Data Fetching

Using SWR provides caching, revalidation, and other features:

\`\`\`jsx
'use client'

import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Dashboard() {
  const { data, error, isLoading } = useSWR('/api/dashboard', fetcher)
  
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>
  
  return <div>{/* Render data */}</div>
}
\`\`\`

These data fetching methods give you flexibility to choose the right approach for each use case in your Next.js application.
`,
      published: true,
      categoryId: 2,
      authorId: admin.id,
    },
    {
      title: 'API Routes in Next.js',
      slug: 'api-routes',
      description: 'Create API endpoints within your Next.js application.',
      content: `# API Routes in Next.js

Next.js allows you to create API endpoints within your application using Route Handlers. This guide will show you how to create and use API routes.

## Basic API Route

To create an API endpoint, add a \`route.js\` file in the app directory:

\`\`\`javascript
// app/api/hello/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' })
}
\`\`\`

This creates an API endpoint at \`/api/hello\` that returns a JSON response.

## Dynamic API Routes

You can create dynamic API routes using folder names with square brackets:

\`\`\`javascript
// app/api/users/[id]/route.js
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const id = params.id
  // Fetch user with the given ID
  return NextResponse.json({ id, name: 'John Doe' })
}
\`\`\`

## Supporting Different HTTP Methods

Route handlers can support different HTTP methods:

\`\`\`javascript
// app/api/posts/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  // Get all posts
  return NextResponse.json([
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' }
  ])
}

export async function POST(request) {
  const body = await request.json()
  // Create a new post
  return NextResponse.json({ id: 3, ...body }, { status: 201 })
}
\`\`\`

## Request and Response Handling

Route handlers give you full control over the request and response:

\`\`\`javascript
// app/api/example/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  
  // Process the query parameter
  return NextResponse.json({ result: \`Searched for: \${query}\` })
}
\`\`\`

## Error Handling

Handle errors properly in your API routes:

\`\`\`javascript
// app/api/data/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch data from database or external API
    // If something goes wrong...
    throw new Error('Failed to fetch data')
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
\`\`\`

API routes in Next.js provide a powerful way to build backend functionality directly within your Next.js application.
`,
      published: true,
      categoryId: 2,
      authorId: admin.id,
    },
    {
      title: 'Styling in Next.js',
      slug: 'styling',
      description: 'Explore different ways to style your Next.js application.',
      content: `# Styling in Next.js

Next.js supports various styling approaches. This guide will help you understand the different options available for styling your Next.js application.

## Global CSS

You can import global CSS files in your \`app/layout.js\` file:

\`\`\`jsx
// app/layout.js
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
\`\`\`

## CSS Modules

CSS Modules allow you to scope CSS to a specific component:

\`\`\`jsx
// Button.module.css
.button {
  background-color: blue;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
}

// Button.jsx
import styles from './Button.module.css'

export default function Button({ children }) {
  return <button className={styles.button}>{children}</button>
}
\`\`\`

## Tailwind CSS

Next.js works well with Tailwind CSS:

\`\`\`jsx
// app/page.js
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-900">Hello, Next.js!</h1>
      <p className="mt-4 text-xl text-gray-600">Welcome to my Next.js application</p>
      <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Get Started
      </button>
    </div>
  )
}
\`\`\`

## CSS-in-JS

You can use CSS-in-JS libraries like styled-components or emotion:

\`\`\`jsx
'use client'

import styled from 'styled-components'

const StyledHeader = styled.h1\`
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
\`

export default function Page() {
  return <StyledHeader>Styled with styled-components</StyledHeader>
}
\`\`\`

Each approach has its own benefits and use cases. Choose the one that best fits your project's needs.
`,
      published: false,
      categoryId: 2,
      authorId: admin.id,
    },
  ]

  // Get categories by slug for reference
  const categoryMap = {}
  const dbCategories = await prisma.category.findMany()
  dbCategories.forEach((category, index) => {
    categoryMap[category.slug] = category.id
  })

  // Create guides with correct category IDs
  for (const guide of guidesData) {
    const categorySlug = Object.keys(categoryMap)[guide.categoryId - 1] // Adjust index
    guide.categoryId = categoryMap[categorySlug]

    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: guide,
      create: guide,
    })
  }
  console.log('Sample guides created')

  // Add some comments
  const comments = [
    {
      content: 'This guide was super helpful! Thanks for explaining everything so clearly.',
      userId: user.id,
      guideId: null, // Will be filled after guide creation
    },
    {
      content: 'I was stuck on routing for days and this solved my problem. Great work!',
      userId: user.id,
      guideId: null,
    },
    {
      content: 'Could you add more examples about dynamic routes? That would be helpful.',
      userId: admin.id,
      guideId: null,
    },
  ]

  // Get guides for comments
  const guides = await prisma.guide.findMany({
    where: { published: true },
    take: 3,
  })

  for (let i = 0; i < comments.length; i++) {
    await prisma.comment.create({
      data: {
        ...comments[i],
        guideId: guides[i % guides.length].id,
      },
    })
  }
  console.log('Sample comments created')

  // Add ratings
  for (let i = 0; i < guides.length; i++) {
    await prisma.rating.create({
      data: {
        value: 4 + (i % 2), // 4 or 5 stars
        userId: user.id,
        guideId: guides[i].id,
      },
    })

    if (i < 2) { // Add admin ratings to first 2 guides
      await prisma.rating.create({
        data: {
          value: 5,
          userId: admin.id,
          guideId: guides[i].id,
        },
      })
    }
  }
  console.log('Sample ratings created')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 