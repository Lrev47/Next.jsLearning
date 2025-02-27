# Next.js Knowledge Sharing Platform

A full-stack web application built with Next.js, Prisma, SQLite, and Next Auth for sharing and managing guides and knowledge resources.

## Project Overview

This platform allows users to create, read, update, and delete guides on various topics. It features a robust authentication system, commenting functionality, rating system, and comprehensive admin controls. The application is built with a modern tech stack and follows best practices for code organization and architecture.

## Key Features

- **User Authentication**: Secure login and registration with Next Auth
- **Guide Management**: Create, read, update, and delete guides with markdown support
- **Category Organization**: Organize guides by categories with color coding
- **Comments & Ratings**: Interactive feedback system for guides
- **Admin Dashboard**: Comprehensive admin controls for managing users, guides, and categories
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **SEO Friendly**: Optimized routes and metadata for better search engine visibility

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (easily replaceable with PostgreSQL, MySQL, or other databases)
- **Authentication**: NextAuth.js
- **Content Formatting**: Markdown with React Markdown

## Project Structure

The application follows a clear, modular structure:

- `/prisma`: Database schema and migrations
- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and shared libraries
- `/public`: Static assets

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

## Documentation

Detailed documentation for each part of the application can be found in README files within their respective directories:

- [Database Models](/prisma/README.md)
- [API Routes](/src/app/api/README.md)
- [Authentication](/src/app/api/auth/README.md)
- [Guide Management](/src/app/guides/README.md)
- [UI Components](/src/components/README.md)

## License

[MIT License](LICENSE)

## Contributors

- Your Name - Initial work
