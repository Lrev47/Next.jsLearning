# UI Components Documentation

This directory contains all the reusable UI components used throughout the application. These components are organized into logical groups based on their purpose and functionality.

## Overview

Our component architecture follows a modular approach:

- **UI Components**: Core UI elements like buttons, cards, inputs
- **Layout Components**: Page layout elements like headers, footers, sidebars
- **Feature Components**: Feature-specific components like guide cards, comment sections
- **Provider Components**: Context providers and wrappers for global state

## Directory Structure

```
/components
├── ui/                  # Core UI components
│   ├── button.jsx       # Button component
│   ├── card.jsx         # Card component
│   ├── spinner.jsx      # Loading spinner
│   ├── markdown.jsx     # Markdown renderer
│   ├── star-rating.jsx  # Star rating component
│   └── ...              # Other UI components
├── layout/              # Layout components
│   ├── header.jsx       # Global header
│   ├── footer.jsx       # Global footer
│   ├── sidebar.jsx      # Sidebar navigation
│   └── ...              # Other layout components
├── home/                # Home page specific components
│   ├── hero.jsx         # Hero section
│   ├── featured.jsx     # Featured guides section
│   └── ...              # Other home page components
├── providers/           # Context providers
│   ├── theme-provider.jsx  # Theme context provider
│   └── ...              # Other providers
└── README.md            # This documentation
```

## Core UI Components

### Button (`ui/button.jsx`)

A versatile button component with various styles and states.

#### Props
- `variant`: primary, secondary, outline, ghost, link
- `size`: sm, md, lg
- `disabled`: boolean
- `asChild`: boolean (for using with Link)
- All standard button HTML attributes

#### Usage
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button asChild variant="link">
  <Link href="/somewhere">Navigate</Link>
</Button>
```

### Card (`ui/card.jsx`)

A card component with header, content, and footer sections.

#### Components
- `Card`: Main container
- `CardHeader`: Card header section
- `CardTitle`: Card title
- `CardDescription`: Card description
- `CardContent`: Card content area
- `CardFooter`: Card footer section

#### Usage
```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description here</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Spinner (`ui/spinner.jsx`)

A loading spinner component with customizable size.

#### Props
- `size`: sm, md, lg, xl
- `className`: Additional CSS classes

#### Usage
```jsx
<Spinner size="md" />

{loading && <Spinner size="sm" className="ml-2" />}
```

### Markdown (`ui/markdown.jsx`)

A component for rendering markdown content with syntax highlighting.

#### Props
- `children`: Markdown content as string
- `className`: Additional CSS classes

#### Features
- Syntax highlighting for code blocks
- GitHub Flavored Markdown support
- Security sanitization
- Link handling with target="_blank"

#### Usage
```jsx
<Markdown className="prose dark:prose-invert">
  {`# Heading

  This is some **markdown** content with a [link](https://example.com).

  \`\`\`javascript
  // Code with syntax highlighting
  function example() {
    return 'Hello World';
  }
  \`\`\`
  `}
</Markdown>
```

### Star Rating (`ui/star-rating.jsx`)

Interactive star rating component for user feedback.

#### Props
- `value`: Current rating value (0-5)
- `onChange`: Callback for rating change
- `size`: sm, md, lg
- `readOnly`: boolean
- `disabled`: boolean
- `max`: Maximum rating (default: 5)

#### Usage
```jsx
// Interactive
<StarRating 
  value={rating} 
  onChange={setRating} 
  size="lg" 
/>

// Read-only
<StarRating 
  value={3.5} 
  readOnly 
  size="sm" 
/>
```

## Layout Components

### Header (`layout/header.jsx`)

The application's global header with navigation and user menu.

#### Features
- Responsive design
- Navigation links
- User authentication status
- Dark/light mode toggle
- Search functionality

### Footer (`layout/footer.jsx`)

The application's global footer with links and information.

### Sidebar (`layout/sidebar.jsx`)

Sidebar navigation component for admin and user dashboards.

## Feature-Specific Components

### Guide Card (`home/guide-card.jsx`)

Card component for displaying guide previews in listings.

#### Props
- `guide`: Guide data object
- `compact`: boolean for compact view

#### Features
- Title and description display
- Author information
- Category badge
- Rating display
- View count

### Comment Section (`guides/comment-section.jsx`)

Component for displaying and submitting comments.

#### Props
- `comments`: Array of comment objects
- `guideId`: ID of the guide
- `onCommentAdded`: Callback function

## Provider Components

### Theme Provider (`providers/theme-provider.jsx`)

Provides theme context for dark/light mode switching.

#### Features
- System preference detection
- Theme persistence
- Theme toggling functionality

### Session Provider (`providers/session-provider.jsx`)

Wraps the application with NextAuth.js session provider.

## Component Design Principles

Our components follow these design principles:

1. **Composability**: Components can be combined to create complex UI
2. **Reusability**: Components are designed to be reused across the application
3. **Accessibility**: ARIA attributes and keyboard navigation
4. **Responsive**: Adapts to different screen sizes
5. **Themeable**: Supports dark and light mode

## Using the Components

To use these components in your pages:

```jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function ExamplePage() {
  const [loading, setLoading] = useState(false);
  
  const handleClick = () => {
    setLoading(true);
    // Do something
  };
  
  return (
    <Card>
      <CardContent>
        <h2>Example Component Usage</h2>
        <Button onClick={handleClick} disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" /> Loading...</> : 'Click Me'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Component Styling

Components are styled using:

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: For component-specific styles
- **CSS Variables**: For theming support

## Extending Components

To create a new reusable component:

1. Create a new file in the appropriate directory
2. Design the component with props for customization
3. Add TypeScript types for props (optional)
4. Include a brief JSDoc comment describing the component
5. Export the component as the default export

Example:

```jsx
/**
 * Alert component for displaying messages
 * @param {Object} props - Component props
 * @param {'info'|'warning'|'error'|'success'} props.variant - Alert variant
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} props.className - Additional CSS classes
 */
export default function Alert({ 
  variant = 'info', 
  children, 
  className,
  ...props 
}) {
  return (
    <div 
      className={cn('alert', `alert-${variant}`, className)}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
}
```

## Component Testing

Components can be tested using React Testing Library. Tests should focus on:

1. Component rendering
2. User interactions
3. State changes
4. Accessibility

## Accessibility

Our components follow WCAG guidelines:

- All interactive elements are keyboard accessible
- Proper ARIA roles and attributes
- Sufficient color contrast
- Focus management for modals and dialogs 