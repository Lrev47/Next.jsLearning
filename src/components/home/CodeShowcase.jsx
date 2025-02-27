'use client';

import { useState } from 'react';
import Code from '../ui/Code';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodeShowcase() {
  const [activeExample, setActiveExample] = useState('app');

  const examples = {
    app: {
      title: 'App Router',
      description: 'Next.js 13+ App Router with nested layouts and server components',
      code: `// app/layout.js (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>My Website</header>
        <main>{children}</main>
        <footer>© {new Date().getFullYear()}</footer>
      </body>
    </html>
  )
}

// app/dashboard/layout.js (Nested Layout)
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      <div>{children}</div>
    </div>
  )
}

// app/dashboard/page.js (Page)
export default function Dashboard() {
  return <h1>Dashboard Home</h1>
}`,
    },
    api: {
      title: 'API Routes',
      description: 'Build API endpoints directly in your Next.js application',
      code: `// app/api/users/route.js
import { NextResponse } from 'next/server'

// GET handler
export async function GET(request) {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ]
  
  return NextResponse.json(users)
}

// POST handler
export async function POST(request) {
  const data = await request.json()
  
  // Process data, save to database, etc.
  const newUser = { id: 3, name: data.name }
  
  return NextResponse.json(newUser, { status: 201 })
}`,
    },
    ssr: {
      title: 'Server-side Rendering',
      description: 'Fetch data and render HTML on the server for each request',
      code: `// app/blog/[slug]/page.js
async function getPost(slug) {
  const res = await fetch(
    \`https://api.example.com/posts/\${slug}\`,
    { next: { revalidate: 60 } } // Revalidate every 60 seconds
  )
  
  if (!res.ok) {
    // Handle error or return notFound()
    throw new Error('Failed to fetch post')
  }
  
  return res.json()
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}`,
    },
    streaming: {
      title: 'Streaming & Suspense',
      description: 'Stream UI from the server and progressively render components',
      code: `// app/dashboard/page.js
import { Suspense } from 'react'
import Loading from './loading'
import UserProfile from './UserProfile'
import RecentActivity from './RecentActivity'
import Analytics from './Analytics'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Critical UI renders immediately */}
      <UserProfile />
      
      {/* Less important UI streams in */}
      <Suspense fallback={<Loading />}>
        <RecentActivity />
      </Suspense>
      
      {/* Analytics can take even longer */}
      <Suspense fallback={<Loading label="Loading analytics..." />}>
        <Analytics />
      </Suspense>
    </div>
  )
}`,
    },
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Built for Modern Development Workflows
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Next.js provides a streamlined developer experience with all the tools you need to build fast, scalable React applications.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeExample === key
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExample}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {examples[activeExample].title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {examples[activeExample].description}
                </p>
              </div>
              <Code
                code={examples[activeExample].code}
                language="javascript"
                filename={`Example: ${examples[activeExample].title}`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
} 