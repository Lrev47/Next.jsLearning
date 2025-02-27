'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EditGuidePage({ params }) {
  const { slug } = params;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [guide, setGuide] = useState(null);
  const [title, setTitle] = useState('');
  const [guideSlug, setGuideSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(`/guides/${slug}/edit`));
    }
  }, [status, router, slug]);

  // Fetch guide data
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchGuide = async () => {
        try {
          const response = await fetch(`/api/guides/by-slug/${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch guide');
          }
          const data = await response.json();
          
          // Check if user is author or admin
          if (data.author.id !== session.user.id && session.user.role !== 'ADMIN') {
            router.push('/403');
            return;
          }
          
          setGuide(data);
          setTitle(data.title);
          setGuideSlug(data.slug);
          setDescription(data.description);
          setContent(data.content);
          setCategoryId(data.category?.id || '');
          setPublished(data.published);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching guide:', error);
          setError('Failed to fetch guide. Please try again.');
          setLoading(false);
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error('Error fetching categories:', error);
          setError('Failed to fetch categories. Please try again.');
        }
      };

      fetchGuide();
      fetchCategories();
    }
  }, [status, session, slug, router]);

  // Generate slug from title
  useEffect(() => {
    if (!guide) return; // Don't auto-generate slug when editing existing guide
    
    const generateSlug = () => {
      return title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    };

    if (title && title !== guide.title) {
      setGuideSlug(generateSlug());
    }
  }, [title, guide]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/guides/${guide.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug: guideSlug,
          description,
          content,
          categoryId: categoryId || null,
          published,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update guide');
      }

      setSuccess('Guide updated successfully!');
      setTimeout(() => {
        router.push(`/guides/${guideSlug}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating guide:', error);
      setError(error.message || 'Failed to update guide. Please try again.');
    } finally {
      setSaving(false);
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
    <div className="container max-w-4xl py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Guide</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/guides/${slug}`}>Cancel</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my-guides">My Guides</Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={guideSlug}
            onChange={(e) => setGuideSlug(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">
            This will be used in the URL: /guides/{guideSlug}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={15}
            className="font-mono"
          />
          <p className="text-sm text-gray-500">
            Supports Markdown formatting
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Publish this guide</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : 'Update Guide'}
          </Button>
        </div>
      </form>
    </div>
  );
} 