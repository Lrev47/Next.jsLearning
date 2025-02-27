import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata = {
  title: 'Next.js Guides | Next.js Guide',
  description: 'Comprehensive guides for learning Next.js development, from beginner to advanced topics.',
};

export default function GuidesPage() {
  const guides = [
    {
      id: 'getting-started',
      title: 'Getting Started with Next.js',
      description: 'Learn how to set up and start a new Next.js project from scratch.',
      category: 'Beginner',
      href: '/guides/getting-started',
      implemented: true,
    },
    {
      id: 'routing',
      title: 'Next.js Routing',
      description: 'Understand how the App Router works and how to implement nested layouts.',
      category: 'Fundamental',
      href: '/guides/routing',
      implemented: true,
    },
    {
      id: 'data-fetching',
      title: 'Data Fetching',
      description: 'Learn different methods for fetching data in Next.js applications.',
      category: 'Fundamental',
      href: '/guides/data-fetching',
      implemented: true,
    },
    {
      id: 'styling',
      title: 'Styling in Next.js',
      description: 'Explore different ways to style your Next.js application.',
      category: 'Fundamental',
      href: '/guides/styling',
      implemented: false,
    },
    {
      id: 'deployment',
      title: 'Deploying Next.js',
      description: 'Learn how to deploy your Next.js application to production.',
      category: 'Deployment',
      href: '/guides/deployment',
      implemented: false,
    },
    {
      id: 'optimizations',
      title: 'Performance Optimization',
      description: 'Techniques for optimizing your Next.js application for speed and efficiency.',
      category: 'Advanced',
      href: '/guides/optimizations',
      implemented: false,
    },
    {
      id: 'authentication',
      title: 'Authentication in Next.js',
      description: 'Implement user authentication in your Next.js application.',
      category: 'Advanced',
      href: '/guides/authentication',
      implemented: false,
    },
    {
      id: 'seo',
      title: 'SEO with Next.js',
      description: 'Optimize your Next.js application for search engines.',
      category: 'Advanced',
      href: '/guides/seo',
      implemented: false,
    },
    {
      id: 'testing',
      title: 'Testing Next.js Applications',
      description: 'Learn how to test your Next.js application.',
      category: 'Quality',
      href: '/guides/testing',
      implemented: false,
    },
    {
      id: 'internationalization',
      title: 'Internationalization (i18n)',
      description: 'Add support for multiple languages in your Next.js application.',
      category: 'Advanced',
      href: '/guides/internationalization',
      implemented: false,
    },
    {
      id: 'accessibility',
      title: 'Accessibility (a11y)',
      description: 'Make your Next.js application accessible to all users.',
      category: 'Quality',
      href: '/guides/accessibility',
      implemented: false,
    },
    {
      id: 'api-routes',
      title: 'API Routes',
      description: 'Create API endpoints within your Next.js application.',
      category: 'Fundamental',
      href: '/guides/api-routes',
      implemented: true,
    },
  ];

  const categories = {
    Beginner: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    Fundamental: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    Advanced: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    Deployment: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    Quality: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  };

  // Filter guides to show implemented ones first
  const sortedGuides = [...guides].sort((a, b) => {
    if (a.implemented && !b.implemented) return -1;
    if (!a.implemented && b.implemented) return 1;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js Guides
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive guides to help you master Next.js development, from beginner to advanced topics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGuides.map((guide) => (
            <Link href={guide.implemented ? guide.href : '#'} key={guide.id} className={`block group ${!guide.implemented ? 'cursor-not-allowed opacity-70' : ''}`}>
              <Card className={`h-full transition-all ${guide.implemented ? 'hover:shadow-md hover:border-primary-500 dark:hover:border-primary-400' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className={`text-xl ${guide.implemented ? 'group-hover:text-primary-600 dark:group-hover:text-primary-400' : ''}`}>
                      {guide.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      {!guide.implemented && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          Coming Soon
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories[guide.category]}`}>
                        {guide.category}
                      </span>
                    </div>
                  </div>
                  <CardDescription>
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className={`text-sm font-medium ${guide.implemented ? 'text-primary-600 dark:text-primary-400 group-hover:underline' : 'text-gray-400 dark:text-gray-500'}`}>
                    {guide.implemented ? 'Read Guide →' : 'Coming Soon'}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 