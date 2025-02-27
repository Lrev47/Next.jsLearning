'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import ThemeToggle from './ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    closeUserMenu();
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: 'Components', path: '/components' },
    { name: 'API Reference', path: '/api-reference' },
    { name: 'Examples', path: '/examples' },
  ];

  // Only show admin link if user is admin
  if (isAuthenticated && session?.user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
              onClick={closeMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>NextJS Guide</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
            
            {!isLoading && (
              <div className="ml-4">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 focus:outline-none"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {session.user.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || "User"} 
                            width={32} 
                            height={32} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={closeUserMenu}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/my-guides"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={closeUserMenu}
                        >
                          My Guides
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      as={Link} 
                      href="/login"
                    >
                      Log in
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      as={Link} 
                      href="/register"
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 ml-3 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-950 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            
            {!isLoading && (
              <div className="mt-4 px-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {session.user.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || "User"} 
                            width={40} 
                            height={40} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/my-guides"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={closeMenu}
                    >
                      My Guides
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        closeMenu();
                      }}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      as={Link} 
                      href="/login"
                      onClick={closeMenu}
                    >
                      Log in
                    </Button>
                    <Button 
                      variant="primary" 
                      className="w-full" 
                      as={Link} 
                      href="/register"
                      onClick={closeMenu}
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 