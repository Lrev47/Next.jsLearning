'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';

export default function MyGuidesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/my-guides');
    }
  }, [status, router]);

  // Fetch user guides
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchGuides = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}/guides`);
          if (!response.ok) {
            throw new Error('Failed to fetch guides');
          }
          const data = await response.json();
          setGuides(data.guides);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching guides:', error);
          setError('Failed to fetch guides. Please try again.');
          setLoading(false);
        }
      };

      fetchGuides();
    }
  }, [status, session]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this guide?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/guides/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete guide');
      }

      // Remove the deleted guide from the state
      setGuides(guides.filter(guide => guide.id !== id));
    } catch (error) {
      console.error('Error deleting guide:', error);
      setError('Failed to delete guide. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Guides</h1>
        <Button asChild>
          <Link href="/guides/new">Create New Guide</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {guides.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No guides yet</h2>
          <p className="text-gray-500 mb-6">
            You haven't created any guides yet. Start by creating your first guide!
          </p>
          <Button asChild>
            <Link href="/guides/new">Create Your First Guide</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">{guide.title}</TableCell>
                  <TableCell>
                    {guide.published ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {guide.category ? (
                      <Badge
                        style={{
                          backgroundColor: guide.category.color || '#888',
                          color: '#fff',
                        }}
                      >
                        {guide.category.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>{guide.views || 0}</TableCell>
                  <TableCell>{guide._count?.comments || 0}</TableCell>
                  <TableCell>{formatDate(guide.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    {deleteLoading === guide.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/guides/${guide.slug}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/guides/${guide.slug}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(guide.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 