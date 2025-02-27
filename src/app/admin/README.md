# Admin Dashboard Documentation

This directory contains the admin dashboard components and pages of the application, providing administrative tools for managing users, guides, categories, and analytics.

## Overview

The admin dashboard is a protected area accessible only to users with the `ADMIN` role. It provides a comprehensive set of tools for:

- User management
- Guide moderation
- Category management
- Analytics and reporting
- System settings

## Directory Structure

```
/admin
├── page.jsx                   # Main admin dashboard home
├── layout.jsx                 # Admin dashboard layout with sidebar
├── guides/                    # Guide management section
│   ├── page.jsx               # Guides list with bulk actions
│   └── [id]/                  # Individual guide management
│       └── page.jsx           # Edit specific guide
├── users/                     # User management section
│   ├── page.jsx               # Users list with filtering
│   └── [id]/                  # Individual user management
│       └── page.jsx           # Edit user details
├── categories/                # Category management
│   ├── page.jsx               # Categories list
│   └── [id]/                  # Edit category
│       └── page.jsx           # Category edit form
└── README.md                  # This documentation
```

## Access Control

The admin dashboard is protected at multiple levels:

1. **Route Protection**: Middleware checks for admin role
2. **API Protection**: Admin-only API routes verify admin role
3. **UI Protection**: Admin-only UI elements are conditionally rendered

```javascript
// Example middleware check
export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Check if path is admin route
  if (path.startsWith('/admin')) {
    const { auth, role } = getToken({ req: request });
    
    // Redirect non-admin users
    if (!auth || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }
  
  return NextResponse.next();
}
```

## Admin Dashboard Home (`/admin/page.jsx`)

The main dashboard page provides:

- Summary statistics (users, guides, views, etc.)
- Recent activity feed
- Quick action buttons
- Performance metrics

### Implementation Details

```javascript
'use client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    guides: 0,
    comments: 0,
    totalViews: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch stats and recent activity
      // ...
    };
    
    fetchDashboardData();
  }, []);
  
  // Render dashboard with cards, charts, and activity feed
  // ...
}
```

## Guide Management (`/admin/guides`)

Provides tools for managing all guides in the system:

### Features

- List all guides (including drafts)
- Filter by status, category, author
- Search functionality
- Bulk actions (publish, unpublish, delete)
- Detailed view and stats for each guide

### Implementation Details

```javascript
'use client';

export default function AdminGuides({ searchParams }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch guides with admin-specific data
  useEffect(() => {
    const fetchGuides = async () => {
      const response = await fetch('/api/admin/guides?' + new URLSearchParams(searchParams));
      // Process response
      // ...
    };
    
    fetchGuides();
  }, [searchParams]);
  
  // Handle bulk actions
  const handleBulkAction = async (action, selectedIds) => {
    // Process bulk action
    // ...
  };
  
  // Render guides table with actions
  // ...
}
```

## User Management (`/admin/users`)

Tools for managing user accounts:

### Features

- List all users
- Filter by role, status, activity
- Edit user details (name, email, role)
- Disable/enable accounts
- View user activity

### Implementation Details

```javascript
'use client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  
  // Fetch users data
  useEffect(() => {
    // ...
  }, []);
  
  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    // Update user role
    // ...
  };
  
  // Handle account status change
  const handleStatusChange = async (userId, isActive) => {
    // Update account status
    // ...
  };
  
  // Render users table with actions
  // ...
}
```

## Category Management (`/admin/categories`)

Interface for managing content categories:

### Features

- List all categories
- Create new categories
- Edit category details (name, slug, color)
- View guides in each category
- Delete categories

### Implementation Details

```javascript
'use client';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  
  // Fetch categories
  // ...
  
  // Handle category create/edit/delete
  // ...
  
  // Render categories management UI
  // ...
}
```

## API Integration

The admin dashboard interacts with specialized admin API endpoints:

- `/api/admin/stats` - Dashboard statistics
- `/api/admin/guides` - Enhanced guide management
- `/api/admin/users` - User management 
- `/api/admin/categories` - Category management

These endpoints provide additional data and functionality beyond the standard API routes, specifically for admin purposes.

## Admin-Only Components

Several UI components are specific to the admin dashboard:

1. **AdminLayout** - Layout with admin navigation sidebar
2. **StatisticsCard** - Display key metrics
3. **ActivityFeed** - Show recent system activity
4. **BulkActionBar** - Perform actions on multiple items
5. **AdminTable** - Enhanced table with sorting, filtering, and actions

## Data Visualization

The admin dashboard includes several data visualization components:

- User registration trends
- Guide creation and view statistics
- Category distribution
- Rating analytics

```javascript
// Example chart component
<LineChart
  data={userStats}
  xKey="date"
  yKey="count"
  title="User Registrations"
  color="#0ea5e9"
/>
```

## User Activity Tracking

The admin dashboard displays detailed user activity:

- Login history
- Content creation
- Comments and ratings
- Guide views

## Extending the Admin Dashboard

To add new admin features:

1. **Create a new page/section** in the admin directory
2. **Add navigation item** in the admin layout sidebar
3. **Create admin-specific API endpoints** as needed
4. **Update permissions** to ensure access control

## Security Considerations

The admin dashboard implements several security measures:

- All requests require admin role verification
- Sensitive operations require confirmation
- Activity logging for audit purposes
- Rate limiting on admin API endpoints
- Input validation and sanitization 