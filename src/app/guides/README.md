# Guide Management Documentation

This directory contains components and pages related to guide management in the application. Guides are the core content type that users can create, view, edit, and interact with.

## Overview

The guide management system includes:
- Guide listing and browsing
- Individual guide viewing
- Guide creation and editing
- Comment and rating functionality
- Category-based filtering

## Directory Structure

```
/guides
├── page.jsx                # Main guides listing page
├── new/                    # Guide creation
│   └── page.jsx            # New guide form
├── [slug]/                 # Dynamic route for viewing guides
│   ├── page.jsx            # Individual guide view
│   └── edit/               # Guide editing route
│       └── page.jsx        # Edit guide form
└── README.md               # This documentation
```

## Guide Listing Page (`/guides/page.jsx`)

The main guide browsing interface:

### Features
- Lists all published guides
- Filters by category
- Search functionality
- Pagination
- Sorting options (newest, most viewed, highest rated)

### Implementation Details
- Uses server-side data fetching with pagination
- Filter and search parameters through URL search params
- Responsive grid layout for guide cards

### Code Structure
```javascript
export default function GuidesPage({ searchParams }) {
  // Pagination, filter, and search parameters
  const { page, category, search, sort } = searchParams;
  
  // Data fetching, rendering guide cards
  // ...
}
```

## Individual Guide View (`/guides/[slug]/page.jsx`)

Displays a single guide with its full content:

### Features
- Full guide content with markdown rendering
- Author information
- Category labeling
- Comments section
- Rating system
- View counter
- Edit button (for author/admin)

### Implementation Details
- Client component with `useEffect` for data fetching
- Increments view count on load
- Session-aware comment and rating submission
- Real-time UI updates after interactions

```javascript
'use client';

export default function GuidePage({ params }) {
  const { slug } = params;
  const { data: session } = useSession();
  
  // Guide data state, comments state, rating state
  const [guide, setGuide] = useState(null);
  
  // Fetch guide data
  useEffect(() => {
    // Fetch guide by slug
    // ...
  }, [slug]);
  
  // Handle comment submission
  const handleCommentSubmit = async (comment) => {
    // Submit comment via API
    // Update UI
    // ...
  };
  
  // Handle rating submission
  const handleRating = async (rating) => {
    // Submit rating via API
    // Update UI
    // ...
  };
  
  // Render guide content, comments, rating interface
  // ...
}
```

## Guide Creation (`/guides/new/page.jsx`)

Form for creating new guides:

### Features
- Title, slug, description, and content fields
- Category selection
- Published/draft toggle
- Markdown editor with preview
- Form validation

### Implementation Details
- Client component with form state management
- Automatic slug generation from title
- Session check to ensure authentication
- API interaction for guide creation

```javascript
'use client';

export default function NewGuidePage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    categoryId: '',
    published: false
  });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    // Submit to API
    // Redirect on success
    // ...
  };
  
  // Render form with input fields, validation, and submit button
  // ...
}
```

## Guide Editing (`/guides/[slug]/edit/page.jsx`)

Interface for modifying existing guides:

### Features
- Same form fields as creation
- Pre-filled with existing guide data
- Permission checking (author/admin only)
- Update or delete options

### Implementation Details
- Similar to creation page but with data fetching
- Authorization checks to prevent unauthorized edits
- Confirmation dialog for deletion
- Success/error feedback

```javascript
'use client';

export default function EditGuidePage({ params }) {
  const { slug } = params;
  const { data: session } = useSession();
  
  // Fetch guide data
  useEffect(() => {
    // Load guide data for editing
    // Check permissions
    // ...
  }, [slug, session]);
  
  // Handle form submission (update)
  const handleSubmit = async (e) => {
    // Submit updated data to API
    // ...
  };
  
  // Handle guide deletion
  const handleDelete = async () => {
    // Confirm deletion
    // Send delete request
    // Redirect on success
    // ...
  };
  
  // Render edit form with save and delete options
  // ...
}
```

## Comments and Ratings

These features are implemented in both the individual guide view component and dedicated API endpoints:

### Comments
- Displayed in chronological order (newest first)
- Author information and timestamp
- Text-only content
- Auth-protected submission

### Ratings
- 1-5 star scale
- Average rating display
- User can rate once (update allowed)
- Visual star component

## Categories

Guides are organized by categories:

- Each guide can belong to one category
- Categories have names, slugs, and color codes
- Category filtering in the guide listing page
- Visual category badges on guide cards and pages

## API Integration

The guide management pages interact with several API endpoints:

- `/api/guides` - List and create guides
- `/api/guides/by-slug/[slug]` - Get guide by slug
- `/api/guides/[id]` - Update and delete guides
- `/api/guides/[id]/comments` - Manage comments
- `/api/guides/[id]/ratings` - Handle ratings
- `/api/categories` - Get categories for selection

## Component Structure

The guide management system uses several reusable components:

1. **GuideCard** - Card component for guide listings
2. **GuideForm** - Shared form for creation and editing
3. **CommentSection** - Comments display and submission
4. **StarRating** - Visual rating component
5. **Markdown** - Markdown rendering for guide content

## Permissions and Authorization

Access controls are implemented throughout the guide system:

- **Viewing**: All guides marked as published are publicly viewable
- **Creating**: Authenticated users can create guides
- **Editing**: Limited to the guide author or admin users
- **Deleting**: Limited to the guide author or admin users
- **Comments/Ratings**: Authenticated users can comment and rate

## Data Validation

Form validation is implemented at multiple levels:

1. **Client-side validation**: Form inputs validated before submission
2. **API validation**: Request data validated before processing
3. **Database constraints**: Schema constraints for data integrity

## Extending Guide Features

To add new guide features:

1. **Add field to database schema**: Update `prisma/schema.prisma`
2. **Update API endpoints**: Modify the relevant handlers in `/api/guides/`
3. **Modify UI components**: Update forms and displays in guide components
4. **Run migrations**: Apply database changes with prisma migrations 