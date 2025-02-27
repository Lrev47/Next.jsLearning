import Code from '@/components/ui/Code';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Next.js API Routes Guide | Next.js Guide',
  description: 'Learn how to create and use API Routes in Next.js to build your own API endpoints.',
};

export default function ApiRoutesGuidePage() {
  const basicApiRouteCode = `// app/api/hello/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello, Next.js!' })
}`;

  const dynamicApiRouteCode = `// app/api/users/[id]/route.js
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const id = params.id
  
  // Fetch user data from a database
  const userData = await fetchUserById(id)
  
  if (!userData) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(userData)
}`;

  const httpMethodsCode = `// app/api/users/route.js
import { NextResponse } from 'next/server'

// GET /api/users - Get all users
export async function GET() {
  const users = await fetchAllUsers()
  return NextResponse.json(users)
}

// POST /api/users - Create a new user
export async function POST(request) {
  const body = await request.json()
  
  // Validate the request body
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Name and email are required' },
      { status: 400 }
    )
  }
  
  // Create the user in the database
  const newUser = await createUser(body)
  
  return NextResponse.json(newUser, { status: 201 })
}

// PUT /api/users - Update a user
export async function PUT(request) {
  const body = await request.json()
  
  // Update the user in the database
  const updatedUser = await updateUser(body)
  
  return NextResponse.json(updatedUser)
}

// DELETE /api/users - Delete a user
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }
  
  // Delete the user from the database
  await deleteUser(id)
  
  return NextResponse.json({ message: 'User deleted successfully' })
}`;

  const requestDataCode = `// app/api/example/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const age = searchParams.get('age')
  
  return NextResponse.json({ name, age })
}

export async function POST(request) {
  // Get JSON body
  const body = await request.json()
  
  // Process the data
  console.log('Received data:', body)
  
  return NextResponse.json({ received: body })
}

export async function PUT(request) {
  // Get form data
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  
  return NextResponse.json({ name, email })
}`;

  const headersCode = `// app/api/headers/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Get request headers
  const authorization = request.headers.get('authorization')
  const contentType = request.headers.get('content-type')
  
  // Set response headers
  const response = NextResponse.json({ 
    message: 'Headers example' 
  })
  
  response.headers.set('x-custom-header', 'custom-value')
  response.headers.set('Cache-Control', 'max-age=3600')
  
  return response
}`;

  const cookiesCode = `// app/api/cookies/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request) {
  // Get cookies
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  
  // Set a cookie
  const response = NextResponse.json({ 
    currentTheme: theme?.value || 'light'
  })
  
  response.cookies.set('visited', 'true', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
  
  return response
}`;

  const middlewareCode = `// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname starts with /api
  if (pathname.startsWith('/api')) {
    // Check for authentication token
    const token = request.headers.get('authorization')
    
    if (!token || !isValidToken(token)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}

// Example token validation function
function isValidToken(token) {
  // Implement your token validation logic
  return token.startsWith('Bearer ')
}`;

  const corsCode = `// app/api/cors-example/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const response = NextResponse.json({ message: 'CORS enabled endpoint' })
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 204 })
  
  // Set CORS headers for preflight requests
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}`;

  const errorHandlingCode = `// app/api/error-example/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate an API call that might fail
    const data = await fetchDataFromExternalAPI()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    
    // Return appropriate error response
    return NextResponse.json(
      { error: 'Failed to fetch data', message: error.message },
      { status: 500 }
    )
  }
}

// Example function that might throw an error
async function fetchDataFromExternalAPI() {
  const random = Math.random()
  
  if (random < 0.5) {
    throw new Error('External API is unavailable')
  }
  
  return { success: true, data: 'Sample data' }
}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            API Routes in Next.js
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Learn how to create and use API Routes in Next.js to build your own API endpoints.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Introduction to API Routes</h2>
          <p>
            Next.js allows you to create API endpoints within your application using Route Handlers. 
            These API routes enable you to build your own API directly within your Next.js application, 
            without needing a separate backend server.
          </p>
          <p>
            API routes are defined in the <code>app</code> directory under the <code>api</code> folder. 
            Each file in this directory becomes an API endpoint that can handle HTTP requests.
          </p>

          <h2>Basic API Route</h2>
          <p>
            Let's start with a simple API route that returns a JSON response:
          </p>

          <Code code={basicApiRouteCode} language="javascript" filename="Basic API Route" />

          <p>
            This creates an API endpoint at <code>/api/hello</code> that responds to GET requests with a JSON message.
          </p>

          <h2>Dynamic API Routes</h2>
          <p>
            Similar to page routes, API routes can be dynamic. You can create dynamic API routes using square brackets <code>[param]</code>:
          </p>

          <Code code={dynamicApiRouteCode} language="javascript" filename="Dynamic API Route" />

          <p>
            This creates API endpoints like <code>/api/users/1</code>, <code>/api/users/2</code>, etc., where the ID is available in the <code>params</code> object.
          </p>

          <h2>HTTP Methods</h2>
          <p>
            API routes can handle different HTTP methods (GET, POST, PUT, DELETE, etc.) by exporting the corresponding functions:
          </p>

          <Code code={httpMethodsCode} language="javascript" filename="HTTP Methods Example" />

          <p>
            Each exported function corresponds to an HTTP method, allowing you to create a RESTful API with a single file.
          </p>

          <h2>Handling Request Data</h2>
          <p>
            You can access various types of request data in your API routes:
          </p>

          <Code code={requestDataCode} language="javascript" filename="Handling Request Data" />

          <h2>Working with Headers</h2>
          <p>
            API routes allow you to access request headers and set response headers:
          </p>

          <Code code={headersCode} language="javascript" filename="Working with Headers" />

          <h2>Working with Cookies</h2>
          <p>
            Next.js provides utilities for working with cookies in API routes:
          </p>

          <Code code={cookiesCode} language="javascript" filename="Working with Cookies" />

          <h2>API Middleware</h2>
          <p>
            You can use middleware to add functionality that runs before your API routes, such as authentication:
          </p>

          <Code code={middlewareCode} language="javascript" filename="API Middleware" />

          <h2>Enabling CORS</h2>
          <p>
            If your API needs to be accessed from different domains, you'll need to enable CORS (Cross-Origin Resource Sharing):
          </p>

          <Code code={corsCode} language="javascript" filename="Enabling CORS" />

          <h2>Error Handling</h2>
          <p>
            Proper error handling is essential for robust API routes:
          </p>

          <Code code={errorHandlingCode} language="javascript" filename="Error Handling" />

          <h2>Best Practices</h2>
          <p>
            When building API routes in Next.js, consider these best practices:
          </p>
          <ul>
            <li>Validate input data to prevent security vulnerabilities</li>
            <li>Implement proper error handling with appropriate status codes</li>
            <li>Use middleware for cross-cutting concerns like authentication</li>
            <li>Keep your API routes organized by following RESTful principles</li>
            <li>Consider rate limiting for public APIs</li>
            <li>Use environment variables for sensitive information</li>
          </ul>

          <h2>Next Steps</h2>
          <p>
            Now that you understand API routes in Next.js, you can:
          </p>

          <div className="not-prose my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/guides/routing" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">Routing</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Learn about Next.js file-based routing system.</p>
              </div>
            </Link>
            <Link href="/guides/data-fetching" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">Data Fetching</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Learn how to fetch data in your Next.js application.</p>
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