'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800',
  outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  link: 'bg-transparent underline-offset-4 hover:underline text-primary-600 dark:text-primary-400 hover:bg-transparent',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg',
};

const Button = forwardRef(({
  children,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={twMerge(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants }; 