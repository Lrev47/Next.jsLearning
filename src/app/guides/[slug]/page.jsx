'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';

export default function GuidePage({ params }) {
  const { slug } = params;
  const { data: session, status } = useSession();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch guide data
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`/api/guides/by-slug/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Guide not found');
          }
          throw new Error('Failed to fetch guide');
        }
        const data = await response.json();
        setGuide(data);
        
        // If user is logged in, check if they've already rated this guide
        if (status === 'authenticated' && data.ratings) {
          const existingRating = data.ratings.find(r => r.userId === session.user.id);
          if (existingRating) {
            setUserRating(existingRating.value);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching guide:', error);
        setError(error.message || 'Failed to fetch guide. Please try again.');
        setLoading(false);
      }
    };

    fetchGuide();
  }, [slug, status, session]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/guides/${guide.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const newComment = await response.json();
      
      // Add the new comment to the guide
      setGuide({
        ...guide,
        comments: [
          {
            ...newComment,
            user: {
              id: session.user.id,
              name: session.user.name,
              image: session.user.image,
            }
          },
          ...guide.comments,
        ],
      });
      
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleRatingSubmit = async (rating) => {
    if (!session) return;
    
    setSubmittingRating(true);
    try {
      const response = await fetch(`/api/guides/${guide.id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      const data = await response.json();
      setUserRating(rating);
      
      // Update the ratings in the guide
      const updatedRatings = guide.ratings.filter(r => r.userId !== session.user.id);
      updatedRatings.push({
        id: data.id,
        rating: rating,
        userId: session.user.id,
      });
      
      setGuide({
        ...guide,
        ratings: updatedRatings,
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/guides">Back to Guides</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container py-10">
        <Alert>
          <AlertDescription>Guide not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/guides">Back to Guides</Link>
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating(guide.ratings);
  const isAuthor = session?.user?.id === guide.author.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Guide Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{guide.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={guide.author.image} alt={guide.author.name} />
                    <AvatarFallback>{guide.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{guide.author.name}</span>
                </div>
                <div>
                  {formatDate(guide.createdAt)}
                </div>
                {guide.category && (
                  <Badge
                    style={{
                      backgroundColor: guide.category.color || '#888',
                      color: '#fff',
                    }}
                  >
                    {guide.category.name}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-medium">{averageRating}</span>
                  <StarRating value={parseFloat(averageRating)} readOnly size="sm" />
                  <span className="text-xs">({guide.ratings.length})</span>
                </div>
                <div>
                  {guide.views} views
                </div>
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/guides/${slug}/edit`}>Edit</Link>
                </Button>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {guide.description}
          </p>
        </div>

        {/* Guide Content */}
        <div className="prose dark:prose-invert max-w-none mb-10">
          <Markdown>{guide.content}</Markdown>
        </div>

        {/* Rating Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate this guide</CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <StarRating 
                  value={userRating} 
                  onChange={handleRatingSubmit} 
                  disabled={submittingRating}
                  size="lg"
                />
                {submittingRating && <Spinner size="sm" />}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Please sign in to rate this guide
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/login?callbackUrl=/guides/${slug}`}>Sign In</Link>
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Average rating: {averageRating} ({guide.ratings.length} ratings)
            </p>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Comments ({guide.comments.length})</h2>
          
          {/* Comment Form */}
          {status === 'authenticated' ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="mb-2"
                rows={3}
                required
              />
              <Button type="submit" disabled={submittingComment}>
                {submittingComment ? <><Spinner size="sm" className="mr-2" /> Submitting...</> : 'Submit Comment'}
              </Button>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-500 mb-2">
                Please sign in to leave a comment
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/login?callbackUrl=/guides/${slug}`}>Sign In</Link>
              </Button>
            </div>
          )}
          
          {/* Comments List */}
          {guide.comments.length > 0 ? (
            <div className="space-y-4">
              {guide.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.user.image} alt={comment.user.name} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.user.name}</div>
                          <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
} 