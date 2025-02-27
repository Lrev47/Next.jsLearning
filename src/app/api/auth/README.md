# Authentication Documentation

This directory contains the authentication mechanism for our Next.js application, powered by NextAuth.js with custom extensions for credential-based authentication.

## Overview

Our application uses NextAuth.js for authentication with:

1. **Credential-based Authentication**: Email and password login
2. **Session Management**: Persistent sessions with database storage
3. **Authorization Roles**: User, Author, and Admin role-based permissions
4. **Custom Registration**: Email and password registration with validation

## Directory Structure

```
/auth
├── [...nextauth]/    # NextAuth.js configuration and handlers
│   └── route.js      # NextAuth API route
└── register/         # Custom registration endpoint
    └── route.js      # Registration handler
```

## NextAuth Configuration

The NextAuth configuration is defined in `[...nextauth]/route.js` and includes:

### Providers

```javascript
providers: [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      // Email/password validation logic
    }
  })
]
```

### Callbacks

```javascript
callbacks: {
  // Session callback adds user role to the session
  async session({ session, token }) {
    if (session.user && token.sub) {
      session.user.id = token.sub;
      session.user.role = token.role;
    }
    return session;
  },
  
  // JWT callback stores user ID and role in the token
  async jwt({ token, user }) {
    if (user) {
      token.sub = user.id;
      token.role = user.role;
    }
    return token;
  }
}
```

### Session Strategy

```javascript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

## User Registration

The custom registration endpoint (`/api/auth/register`) handles new user creation:

### Registration Flow

1. **Request Validation**: Validates email, password, and name
2. **Email Uniqueness**: Checks if email is already registered
3. **Password Hashing**: Securely hashes password with bcrypt
4. **User Creation**: Creates new user in the database
5. **Response**: Returns success or error message

```javascript
// Example registration handler
export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    return NextResponse.json(
      { message: 'User registered successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    // Error handling
  }
}
```

## Authentication in Client Components

In client components, authentication is used through React hooks:

```javascript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  
  if (status === 'authenticated') {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
```

## Session and Route Protection

The application uses middleware to protect routes based on authentication status:

```javascript
// middleware.js
export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define protected paths and authentication checks
  const isProtectedPath = 
    path.startsWith('/admin') || 
    path.startsWith('/my-guides') ||
    path.startsWith('/profile');
  
  // Check if the user is authenticated
  const { auth } = getToken({ req: request });
  
  // Redirect to login if accessing protected path while unauthenticated
  if (isProtectedPath && !auth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to home if accessing auth paths while authenticated
  if ((path === '/login' || path === '/register') && auth) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}
```

## Authorization Checks in API Routes

API routes use `getServerSession` to authenticate requests and check user roles:

```javascript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  // Get session
  const session = await getServerSession(authOptions);
  
  // Check authentication
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check authorization for admin-only routes
  if (path.includes('/admin') && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with authorized request
  // ...
}
```

## Authentication Pages

The application includes the following authentication pages:

1. **Login Page** (`/app/login/page.js`):
   - Email/password login form
   - "Remember me" option
   - Link to registration page
   - Error handling for invalid credentials

2. **Registration Page** (`/app/register/page.js`):
   - New user registration form
   - Password strength requirements
   - Email validation
   - Error handling for duplicate emails

3. **Profile Page** (`/app/profile/page.js`):
   - User profile management
   - Password update functionality
   - Authentication-protected

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are signed with a secure secret
- Session expiration is set to 30 days by default
- CSRF protection is enabled
- Secure HTTP-only cookies store session data
- Rate limiting is implemented for login attempts

## Extending Authentication

To add new authentication providers:

1. Install the required NextAuth provider package
2. Add the provider to the NextAuth configuration in `[...nextauth]/route.js`
3. Update the UI components to include the new login option

```javascript
// Example adding GitHub provider
import GitHubProvider from 'next-auth/providers/github';

// In the authOptions object
providers: [
  CredentialsProvider({
    // existing configuration
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET
  })
]
``` 