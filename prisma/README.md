# Database Documentation

This directory contains all the database-related files for our application, including the Prisma schema, migrations, and seed script.

## Overview

Our application uses Prisma ORM with SQLite as the database. The schema defines several models that represent the core entities of our knowledge sharing platform:

- **User**: Application users with different roles (user, author, admin)
- **Guide**: The main content pieces containing educational material
- **Category**: Organizational structure for guides
- **Comment**: User feedback on guides
- **Rating**: Numerical evaluation of guides (1-5 stars)
- **Session**: Authentication sessions for users

## Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed password for email/password auth
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  guides        Guide[]   // Guides authored by user
  comments      Comment[]
  ratings       Rating[]

  @@map("users")
}

enum UserRole {
  USER
  AUTHOR
  ADMIN
}
```

- **Purpose**: Stores user information and authentication details
- **Key Fields**:
  - `id`: Unique identifier using CUID
  - `email`: Unique email address for authentication
  - `password`: Hashed password for security
  - `role`: User permission level (USER, AUTHOR, ADMIN)
- **Relationships**:
  - One-to-many relationship with Guides (as author)
  - One-to-many relationship with Comments
  - One-to-many relationship with Ratings

### Guide Model

```prisma
model Guide {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  content     String   // Markdown or rich text content
  published   Boolean  @default(false)
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  authorId    String?
  author      User?     @relation(fields: [authorId], references: [id], onDelete: SetNull)
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  comments    Comment[]
  ratings     Rating[]
}
```

- **Purpose**: Stores educational content created by users
- **Key Fields**:
  - `id`: Unique identifier
  - `title`: Guide title
  - `slug`: URL-friendly unique identifier (used in routing)
  - `description`: Short summary of the guide
  - `content`: Full markdown content of the guide
  - `published`: Whether the guide is publicly visible
  - `viewCount`: Number of times the guide has been viewed
- **Relationships**:
  - Many-to-one with User (author)
  - Many-to-one with Category
  - One-to-many with Comments
  - One-to-many with Ratings
- **Notes**: 
  - The `onDelete: SetNull` ensures that if an author or category is deleted, the guide is preserved

### Category Model

```prisma
model Category {
  id        String   @id @default(cuid()) 
  name      String   @unique
  slug      String   @unique
  color     String?  // CSS color class
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  guides    Guide[]
}
```

- **Purpose**: Organizes guides into topical categories
- **Key Fields**:
  - `id`: Unique identifier
  - `name`: Display name for the category
  - `slug`: URL-friendly identifier
  - `color`: CSS color code for visual distinction
- **Relationships**:
  - One-to-many with Guides

### Comment Model

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  guideId   String
  guide     Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- **Purpose**: Stores user comments on guides
- **Key Fields**:
  - `id`: Unique identifier
  - `content`: The comment text
  - `createdAt`: When the comment was created
- **Relationships**:
  - Many-to-one with Guide
  - Many-to-one with User
- **Notes**:
  - `onDelete: Cascade` ensures comments are deleted if the guide or user is deleted

### Rating Model

```prisma
model Rating {
  id        String   @id @default(cuid())
  value     Int      // 1-5 rating
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  guideId   String
  guide     Guide    @relation(fields: [guideId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([guideId, userId]) // One rating per guide per user
}
```

- **Purpose**: Stores numerical ratings (1-5) for guides
- **Key Fields**:
  - `id`: Unique identifier
  - `value`: Numerical rating (1-5)
- **Relationships**:
  - Many-to-one with Guide
  - Many-to-one with User
- **Constraints**:
  - Unique constraint ensures each user can only rate a guide once

## Database Seeding

The `seed.js` file contains scripts to populate the database with initial data:

- Admin user (admin@example.com)
- Regular user (user@example.com)
- Sample categories
- Sample guides with content
- Sample comments and ratings

To run the seed script:

```bash
npx prisma db seed
# or
npm run prisma:seed
```

## Migrations

Migrations are managed automatically by Prisma. To create a new migration after modifying the schema:

```bash
npx prisma migrate dev --name <migration-name>
```

## Interaction with Application

- **Authentication**: The User model is used by NextAuth.js for authentication
- **API Routes**: All database interactions happen through Prisma Client in API routes
- **Data Display**: Guide data is fetched and displayed in various pages
- **Forms**: Create/update operations for guides, comments, and ratings use dedicated API endpoints

## Extending the Database

To extend the database:

1. Modify the `schema.prisma` file
2. Generate a migration: `npx prisma migrate dev --name <migration-name>`
3. Update the seed script if necessary
4. Update the relevant API routes to handle the new/modified models 