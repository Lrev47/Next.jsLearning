import Code from '@/components/ui/Code';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Next.js Routing Guide | Next.js Guide',
  description: 'Learn how file-based routing works in Next.js App Router and how to implement complex routing patterns.',
};

export default function RoutingGuidePage() {
  const basicRoutingCode = `// app/page.js -> "/"
export default function HomePage() {
  return <h1>Home Page</h1>
}

// app/about/page.js -> "/about"
export default function AboutPage() {
  return <h1>About Page</h1>
}

// app/blog/page.js -> "/blog"
export default function BlogPage() {
  return <h1>Blog Index Page</h1>
}`;

  const dynamicRoutesCode = `// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  return <h1>Blog Post: {params.slug}</h1>
}

// URL: /blog/hello-world
// Output: Blog Post: hello-world`;

  const nestedRoutesCode = `// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard Home</a></li>
          <li><a href="/dashboard/settings">Settings</a></li>
          <li><a href="/dashboard/analytics">Analytics</a></li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}

// app/dashboard/page.js -> "/dashboard"
export default function DashboardPage() {
  return <h1>Dashboard Home</h1>
}

// app/dashboard/settings/page.js -> "/dashboard/settings"
export default function SettingsPage() {
  return <h1>Settings Page</h1>
}`;

  const catchAllRoutesCode = `// app/docs/[...slug]/page.js
export default function DocsPage({ params }) {
  // params.slug is an array
  // e.g., for URL /docs/getting-started/installation
  // params.slug = ['getting-started', 'installation']
  
  return (
    <div>
      <h1>Documentation</h1>
      <p>Current path: {params.slug.join('/')}</p>
    </div>
  )
}`;

  const optionalCatchAllCode = `// app/[[...slug]]/page.js
export default function Page({ params }) {
  // params.slug is undefined for /
  // params.slug is an array for /a, /a/b, etc.
  
  if (!params.slug) {
    return <h1>Home Page</h1>
  }
  
  return <h1>Slug: {params.slug.join('/')}</h1>
}`;

  const routeGroupsCode = `// app/(marketing)/about/page.js -> "/about"
export default function AboutPage() {
  return <h1>About Us</h1>
}

// app/(marketing)/contact/page.js -> "/contact"
export default function ContactPage() {
  return <h1>Contact Us</h1>
}

// app/(shop)/products/page.js -> "/products"
export default function ProductsPage() {
  return <h1>Our Products</h1>
}`;

  const parallelRoutesCode = `// app/layout.js
export default function Layout({ children, auth }) {
  return (
    <html>
      <body>
        <div className="container">
          {/* This slot comes from the @auth folder */}
          {auth}
          {/* This slot comes from the default folder structure */}
          {children}
        </div>
      </body>
    </html>
  )
}

// app/page.js -> Main content
// app/@auth/login/page.js -> Shown in the "auth" slot`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js Routing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Learn how file-based routing works in Next.js App Router and how to implement complex routing patterns.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Introduction to App Router</h2>
          <p>
            Next.js 13 introduced the App Router, a new routing system built on top of React Server Components. 
            It features nested routes, layouts, loading states, error handling, and more.
          </p>
          <p>
            The App Router uses a file-system based router where:
          </p>
          <ul>
            <li>Folders define routes</li>
            <li>Files define UI</li>
          </ul>

          <h2>Basic Routing</h2>
          <p>
            Routes in Next.js are defined by folders in the <code>app</code> directory. Each folder represents a route segment
            that maps to a URL segment. To make a route accessible, you need to create a <code>page.js</code> file inside
            the folder.
          </p>

          <Code code={basicRoutingCode} language="javascript" filename="Basic Routing Example" />

          <h2>Dynamic Routes</h2>
          <p>
            Next.js allows you to create dynamic routes using square brackets <code>[param]</code> in the folder name. The value inside
            the brackets will be available as a parameter to your page component.
          </p>

          <Code code={dynamicRoutesCode} language="javascript" filename="Dynamic Routes Example" />

          <h2>Nested Routes and Layouts</h2>
          <p>
            Routes can be nested by creating folders inside other folders. You can also create shared layouts for
            nested routes using <code>layout.js</code> files.
          </p>

          <Code code={nestedRoutesCode} language="javascript" filename="Nested Routes Example" />

          <h2>Catch-all Routes</h2>
          <p>
            Catch-all routes allow you to match multiple route segments. You can create a catch-all route by adding 
            an ellipsis inside the brackets <code>[...param]</code>.
          </p>

          <Code code={catchAllRoutesCode} language="javascript" filename="Catch-all Routes Example" />

          <h2>Optional Catch-all Routes</h2>
          <p>
            You can make a catch-all route optional by including the parameter in double square brackets <code>[[...param]]</code>.
            This will match both the base path and any nested paths.
          </p>

          <Code code={optionalCatchAllCode} language="javascript" filename="Optional Catch-all Routes Example" />

          <h2>Route Groups</h2>
          <p>
            You can create route groups by placing folders in parentheses <code>(groupName)</code>. Route groups allow you to
            organize routes without affecting the URL structure.
          </p>

          <Code code={routeGroupsCode} language="javascript" filename="Route Groups Example" />

          <h2>Parallel Routes</h2>
          <p>
            Parallel routes allow you to simultaneously show multiple pages in the same view. This is useful for split-screen layouts, 
            modals, and tabs. You can create a parallel route by prefixing a folder with <code>@</code>.
          </p>

          <Code code={parallelRoutesCode} language="javascript" filename="Parallel Routes Example" />

          <h2>Next Steps</h2>
          <p>
            Now that you understand routing in Next.js, you can:
          </p>

          <div className="not-prose my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/guides/data-fetching" className="block group">
              <div className="h-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">Data Fetching</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Learn how to fetch data in your routes.</p>
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