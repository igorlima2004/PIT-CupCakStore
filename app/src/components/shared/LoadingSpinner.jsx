
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, size = "default" }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-12 w-12',
    lg: 'h-24 w-24',
  };

  return (
    <div className={cn('flex justify-center items-center w-full', className)}>
      <Loader2 className={cn('animate-spin text-pink-500', sizeClasses[size])} />
    </div>
  );
};

export default LoadingSpinner;
  