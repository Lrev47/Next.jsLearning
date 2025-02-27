'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';

export function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  disabled = false,
  className,
  ...props
}) {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  const starSize = sizes[size] || sizes.md;
  
  const handleMouseEnter = (index) => {
    if (readOnly || disabled) return;
    setHoverValue(index);
  };
  
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverValue(0);
  };
  
  const handleClick = (index) => {
    if (readOnly || disabled) return;
    if (onChange) {
      onChange(index);
    }
  };
  
  const renderStar = (index) => {
    const filled = hoverValue ? index <= hoverValue : index <= value;
    const half = !filled && index <= value + 0.5;
    
    return (
      <button
        key={index}
        type="button"
        className={cn(
          'inline-flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer',
          readOnly || disabled ? 'cursor-default' : 'cursor-pointer',
          disabled && 'opacity-50',
        )}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
        disabled={readOnly || disabled}
        aria-label={`Rate ${index} out of ${max}`}
      >
        {half ? (
          <StarHalf 
            className={cn(
              starSize,
              'text-yellow-400 fill-yellow-400',
            )} 
          />
        ) : (
          <Star 
            className={cn(
              starSize,
              filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600',
            )} 
            fill={filled ? 'currentColor' : 'none'}
          />
        )}
      </button>
    );
  };
  
  return (
    <div 
      className={cn('inline-flex', className)} 
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {[...Array(max)].map((_, index) => renderStar(index + 1))}
    </div>
  );
} 