# API Routes Documentation

This directory contains all the backend API routes for our Next.js application. These routes handle data operations, authentication, and other server-side functionality.

## Overview

Our API follows RESTful design principles and is organized by resource type. Each API route leverages Next.js App Router's file-based routing system where:

- Routes are defined in `route.js` files
- Dynamic parameters use square brackets (e.g., `[id]`, `[slug]`)
- HTTP methods are exported as functions from route files (GET, POST, PATCH, DELETE)

## Core API Structure

```
/api
├── auth/              # Authentication routes
│   ├── [...nextauth]/ # NextAuth.js configuration
│   └── register/      # User registration 
├── guides/            # Guide management
│   ├── route.js       # List and create guides
│   ├── [id]/          # Operations on a specific guide by ID
│   │   ├── route.js   # Get, update, delete guide
│   │   ├── comments/  # Comments for a specific guide
│   │   └── ratings/   # Ratings for a specific guide
│   └── by-slug/[slug] # Fetch guide by slug
├── users/             # User management
│   ├── route.js       # List users
│   └── [id]/          # Operations on a specific user
│       └── guides/    # Guides by a specific user
├── categories/        # Category management
└── admin/             # Admin-only endpoints
```

## Authentication Routes

### NextAuth (`/api/auth/[...nextauth]`)

Handles authentication flows including:
- Email/password sign-in
- Session management
- User role verification

```javascript
// Example usage in frontend:
const { data: session } = useSession();
```

### Registration (`/api/auth/register`)

Handles new user registration with validation.

**Endpoint**: `POST /api/auth/register`
**Payload**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword"
}
```

## Guide Management Routes

### Guides List and Creation (`/api/guides`)

- **GET**: Fetch all guides with pagination, filtering, and search
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `category`: Filter by category slug
    - `search`: Search in title and description
    - `author`: Filter by author ID
    - `published`: Filter by publication status

- **POST**: Create a new guide
  - Required fields:
    - `title`: Guide title
    - `description`: Short description
    - `content`: Markdown content
  - Optional fields:
    - `categoryId`: Associated category
    - `published`: Publication status (default: false)
    - `slug`: Custom URL slug (auto-generated if not provided)

### Guide By ID (`/api/guides/[id]`)

Operations on a specific guide:

- **GET**: Fetch a single guide with all related data
- **PATCH**: Update guide fields
- **DELETE**: Remove a guide (requires author or admin permission)

### Guide By Slug (`/api/guides/by-slug/[slug]`)

- **GET**: Fetch a guide using its slug (used for public-facing pages)
  - Increments view count on successful fetching

### Comments (`/api/guides/[id]/comments`)

- **GET**: Fetch comments for a specific guide
- **POST**: Add a new comment to a guide

### Ratings (`/api/guides/[id]/ratings`)

- **POST**: Rate a guide or update existing rating
  - Enforces one rating per user per guide

## User Management Routes

### Users List (`/api/users`)

- **GET**: List all users (admin only)

### User Details (`/api/users/[id]`)

- **GET**: Fetch user details
- **PATCH**: Update user details (self or admin only)

### User Guides (`/api/users/[id]/guides`)

- **GET**: Fetch guides authored by a specific user

## Category Management Routes

### Categories List and Creation (`/api/categories`)

- **GET**: List all categories
- **POST**: Create a new category (admin only)

### Category Details (`/api/categories/[id]`)

- **GET**: Fetch category details
- **PATCH**: Update category (admin only)
- **DELETE**: Remove a category (admin only)

## Admin Routes

Admin-only routes for bulk operations and dashboard data:

### Admin Guides (`/api/admin/guides`)

- **GET**: List all guides with extended metadata (for admin dashboard)
- **PATCH**: Bulk update guides

### Admin Users (`/api/admin/users`)

- **GET**: List all users with extended metadata
- **PATCH**: Bulk update users (e.g., role changes)

## Authentication and Authorization

Most API routes implement authorization checks:

```javascript
// Example authorization check
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check resource ownership or admin status
  if (resource.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with authorized operation
  // ...
}
```

## Error Handling

API routes follow a consistent error handling pattern:

```javascript
try {
  // Operation logic
} catch (error) {
  console.error('Error description:', error);
  return NextResponse.json(
    { error: 'User-friendly error message' },
    { status: <appropriate-status-code> }
  );
}
```

Common status codes:
- 200: Success
- 201: Resource created
- 400: Bad request (validation error)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (authenticated but not allowed)
- 404: Resource not found
- 500: Server error

## Data Validation

Input validation is performed using:

1. Basic field validation in the API route
2. Prisma schema constraints for database-level validation

## Using the API

These API routes are primarily used by the frontend components through fetch requests:

```javascript
// Example frontend API call
const submitComment = async () => {
  const response = await fetch(`/api/guides/${guideId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: commentText }),
  });
  
  if (!response.ok) {
    // Handle error
  }
  
  const data = await response.json();
  // Update UI with new comment
};
``` 