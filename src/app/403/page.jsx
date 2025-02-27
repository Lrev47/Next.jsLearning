import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Access Denied - Next.js Guide',
  description: 'You do not have permission to access this page.',
};

export default function ForbiddenPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl font-bold text-red-500 mb-4">403</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You do not have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as={Link} href="/">
              Return Home
            </Button>
            <Button variant="outline" as={Link} href="/guides">
              Browse Guides
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 