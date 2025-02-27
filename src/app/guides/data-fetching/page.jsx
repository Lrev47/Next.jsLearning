import Code from '@/components/ui/Code';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Next.js Data Fetching Guide | Next.js Guide',
  description: 'Learn how to fetch data in Next.js using Server Components, Client Components, and API routes.',
};

export default function DataFetchingGuidePage() {
  const serverComponentCode = `// app/users/page.js
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
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}`;

  const staticDataFetchingCode = `// app/posts/page.js
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) => res.json())
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

async function getPost(slug) {
  const res = await fetch(\`https://api.example.com/posts/\${slug}\`)
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug)
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}`;

  const revalidationCode = `// Revalidate at most every 60 seconds
fetch('https://api.example.com/data', { next: { revalidate: 60 } })

// Revalidate on-demand only
fetch('https://api.example.com/data', { next: { revalidate: 0 } })

// Force cache
fetch('https://api.example.com/data', { cache: 'force-cache' })

// Skip cache
fetch('https://api.example.com/data', { cache: 'no-store' })`;

  const clientComponentCode = `'use client'

import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        const json = await res.json()
        setData(json)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Client-side Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}`;

  const sWRCode = `'use client'

import useSWR from 'swr'

// Custom fetcher function
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR('/api/user/profile', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading profile</div>

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  )
}`;

  const reactQueryCode = `'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function Profile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/user/profile').then(res => res.json()),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Profile />
    </QueryClientProvider>
  )
}`;

  const apiRouteCode = `// app/api/users/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]
  
  return NextResponse.json(users)
}

export async function POST(request) {
  const body = await request.json()
  
  // Process the data (e.g., save to database)
  console.log('Received data:', body)
  
  return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Data Fetching in Next.js
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Learn how to fetch and manage data in Next.js using Server Components, Client Components, and API routes.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Introduction</h2>
          <p>
            Next.js provides multiple ways to fetch data for your application. With the introduction of React Server Components
            in Next.js 13, data fetching has become more powerful and flexible than ever before.
          </p>
          <p>
            In this guide, we'll explore different data fetching strategies in Next.js:
          </p>
          <ul>
            <li>Server-side data fetching with React Server Components</li>
            <li>Static data fetching with generateStaticParams</li>
            <li>Client-side data fetching in Client Components</li>
            <li>Using data fetching libraries like SWR and React Query</li>
            <li>Creating and using API routes</li>
          </ul>

          <h2>Server Components Data Fetching</h2>
          <p>
            React Server Components allow you to fetch data directly in your components on the server. This approach has several benefits:
          </p>
          <ul>
            <li>Data fetching happens on the server, reducing client-side JavaScript</li>
            <li>You can use async/await syntax directly in your components</li>
            <li>Sensitive information like API keys stays on the server</li>
            <li>Improved performance as data is fetched closer to the data source</li>
          </ul>

          <Code code={serverComponentCode} language="javascript" filename="Server Component Data Fetching" />

          <h2>Static Data Fetching</h2>
          <p>
            For content that doesn't change frequently, you can use static data fetching to generate pages at build time.
            This is done using the <code>generateStaticParams</code> function.
          </p>

          <Code code={staticDataFetchingCode} language="javascript" filename="Static Data Fetching" />

          <h2>Data Caching and Revalidation</h2>
          <p>
            Next.js provides powerful caching mechanisms to optimize performance. You can control how and when data is cached
            using the <code>fetch</code> API options.
          </p>

          <Code code={revalidationCode} language="javascript" filename="Caching and Revalidation Options" />

          <h2>Client-side Data Fetching</h2>
          <p>
            For interactive components that need to fetch data after the page loads, you can use client-side data fetching
            in Client Components.
          </p>

          <Code code={clientComponentCode} language="javascript" filename="Client Component Data Fetching" />

          <h2>Using SWR for Data Fetching</h2>
          <p>
            SWR (Stale-While-Revalidate) is a React hooks library for data fetching created by the Next.js team. It handles caching,
            revalidation, focus tracking, refetching on interval, and more.
          </p>

          <Code code={sWRCode} language="javascript" filename="Data Fetching with SWR" />

          <h2>Using React Query</h2>
          <p>
            React Query is a powerful data fetching and state management library that provides caching, background updates,
            and stale data handling.
          </p>

          <Code code={reactQueryCode} language="javascript" filename="Data Fetching with React Query" />

          <h2>API Routes</h2>
          <p>
            Next.js allows you to create API endpoints within your application using Route Handlers. These can be used to
            fetch data from external APIs, interact with databases, or perform server-side operations.
          </p>

          <Code code={apiRouteCode} language="javascript" filename="API Route Example" />

          <h2>Best Practices</h2>
          <p>
            When fetching data in Next.js, consider these best practices:
          </p>
          <ul>
            <li>Use Server Components for initial data fetching when possible</li>
            <li>Implement proper error handling and loading states</li>
            <li>Choose the appropriate caching strategy based on your data's nature</li>
            <li>Consider using libraries like SWR or React Query for complex client-side data fetching</li>
            <li>Keep sensitive information server-side by using API routes or Server Components</li>
          </ul>

          <h2>Next Steps</h2>
          <p>
            Now that you understand data fetching in Next.js, you can:
          </p>

          <div className="not-prose my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/guides/routing" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">Routing</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Learn about Next.js file-based routing system.</p>
              </div>
            </Link>
            <Link href="/guides/api-routes" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">API Routes</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Create API endpoints within your Next.js application.</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <Button as={Link} href="/guides">
              View All Guides
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 