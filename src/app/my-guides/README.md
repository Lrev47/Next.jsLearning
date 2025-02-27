# My Guides Documentation

This directory contains the "My Guides" feature, which allows users to manage guides they have created.

## Overview

The "My Guides" page provides an authenticated user interface for viewing, managing, and creating personal guides. It serves as a dashboard for content creators to:

- View all guides they've authored
- Monitor guide performance (views, comments, ratings)
- Create new guides
- Edit existing guides
- Delete guides
- Track publication status

## Implementation Details

The feature is implemented as a client-side rendered page that fetches user-specific guides from the API.

### Page Structure

The main component `page.jsx` includes:

```jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// ... other imports

export default function MyGuidesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          // process response and update state
          // ...
        } catch (error) {
          // handle error
          // ...
        }
      };

      fetchGuides();
    }
  }, [status, session]);

  // Guide management functions
  const handleDelete = async (id) => {
    // Delete implementation
    // ...
  };

  // Render the UI with guides table or empty state
  // ...
}
```

### Key Features

1. **Authentication Protection**:
   - Redirects unauthenticated users to login
   - Uses NextAuth.js session to verify authentication

2. **User-Specific Data Fetching**:
   - Fetches only guides authored by the current user
   - API endpoint: `/api/users/${userId}/guides`

3. **Guide Management**:
   - Table view of all user guides
   - Status indicators (Published/Draft)
   - View counts and comment counts
   - Actions dropdown for each guide

4. **Empty State Handling**:
   - Displays friendly UI when user has no guides
   - Encourages creation of first guide

5. **Guide Deletion**:
   - Confirmation dialog before deletion
   - Optimistic UI update after successful deletion

### UI Components

The page uses several UI components:

- `Table` - For displaying guides in tabular format
- `Button` - For actions like create, view, edit, delete
- `Badge` - For status indicators
- `Spinner` - For loading states
- `DropdownMenu` - For action menus
- `Alert` - For error messages

### API Integration

The page interacts with these API endpoints:

1. **Fetch User Guides**:
   - `GET /api/users/${userId}/guides`
   - Returns guides authored by the specified user
   - Includes metadata (views, comments count, etc.)

2. **Delete Guide**:
   - `DELETE /api/guides/${guideId}`
   - Deletes a specific guide
   - Requires authorization (must be author or admin)

### Authorization Logic

The page implements several permission checks:

- Only authenticated users can access the page
- Users can only see and manage their own guides
- Delete operations verify ownership on the server

### State Management

The page manages several state variables:

- `guides`: Array of user's guides
- `loading`: Boolean for loading state
- `error`: String for error messages
- `deleteLoading`: Tracks which guide is being deleted

### Navigation

The page provides navigation to:

- Create new guide (`/guides/new`)
- View a specific guide (`/guides/[slug]`)
- Edit a specific guide (`/guides/[slug]/edit`)

## User Experience

The "My Guides" page is designed to provide a smooth user experience:

1. **Loading State**: Displays a spinner while fetching guides
2. **Error Handling**: Shows error messages when operations fail
3. **Empty State**: Provides guidance when no guides exist
4. **Responsive Design**: Works on mobile and desktop devices
5. **Optimistic Updates**: UI updates immediately after actions

## Integration with Other Features

The "My Guides" page connects with other parts of the application:

- **Authentication System**: For user identification and protection
- **Guide Creation**: Links to the guide creation page
- **Guide Editing**: Links to the edit page for each guide
- **Guide Viewing**: Links to the public view of each guide

## Extension Points

To extend the "My Guides" feature:

1. **Bulk Actions**: Add functionality to perform actions on multiple guides
2. **Filtering/Sorting**: Add options to filter by status or sort by metrics
3. **Analytics**: Add more detailed performance metrics for each guide
4. **Pagination**: Implement pagination for users with many guides

## Security Considerations

The "My Guides" feature implements several security measures:

1. **Route Protection**: Redirects unauthenticated users
2. **API Authorization**: All API calls verify user ownership
3. **Confirmation Dialogs**: Prevents accidental deletion
4. **Error Handling**: Gracefully handles server errors 