/**
 * Loading Skeleton Components for BCNS Website
 * 
 * Provides consistent loading states across the application with
 * accessible, animated skeleton components.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Base skeleton component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    />
  );
}

// Text skeleton with different sizes
interface TextSkeletonProps {
  lines?: number;
  className?: string;
  variant?: 'sm' | 'base' | 'lg' | 'xl';
}

export function TextSkeleton({ 
  lines = 1, 
  className, 
  variant = 'base' 
}: TextSkeletonProps) {
  const heights = {
    sm: 'h-3',
    base: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            heights[variant],
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarSkeleton({ size = 'md', className }: AvatarSkeletonProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      className={cn(
        'rounded-full',
        sizes[size],
        className
      )}
    />
  );
}

// Button skeleton
interface ButtonSkeletonProps {
  variant?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function ButtonSkeleton({ variant = 'default', className }: ButtonSkeletonProps) {
  const variants = {
    sm: 'h-8 w-20',
    default: 'h-10 w-24',
    lg: 'h-12 w-28',
  };

  return (
    <Skeleton
      className={cn(
        'rounded-md',
        variants[variant],
        className
      )}
    />
  );
}

// Card skeleton
interface CardSkeletonProps {
  showHeader?: boolean;
  showFooter?: boolean;
  contentLines?: number;
  className?: string;
}

export function CardSkeleton({ 
  showHeader = true, 
  showFooter = false, 
  contentLines = 3,
  className 
}: CardSkeletonProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        <TextSkeleton lines={contentLines} />
        {showFooter && (
          <div className="flex justify-between items-center pt-4">
            <ButtonSkeleton variant="sm" />
            <Skeleton className="h-4 w-16" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Table skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  showHeader = true,
  className 
}: TableSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {showHeader && (
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// List skeleton
interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ListSkeleton({ 
  items = 5, 
  showAvatar = false, 
  showActions = false,
  className 
}: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          {showAvatar && <AvatarSkeleton />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <ButtonSkeleton variant="sm" />
              <ButtonSkeleton variant="sm" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Form skeleton
interface FormSkeletonProps {
  fields?: number;
  showSubmit?: boolean;
  className?: string;
}

export function FormSkeleton({ 
  fields = 4, 
  showSubmit = true,
  className 
}: FormSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {showSubmit && (
        <div className="flex justify-end space-x-2 pt-4">
          <ButtonSkeleton />
          <ButtonSkeleton />
        </div>
      )}
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <ButtonSkeleton />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton contentLines={5} />
        </div>
        <div>
          <CardSkeleton contentLines={3} />
        </div>
      </div>
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <AvatarSkeleton size="xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <FormSkeleton fields={6} />
        </CardContent>
      </Card>
    </div>
  );
}

// Gallery skeleton
export function GallerySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <ButtonSkeleton />
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Navigation skeleton
export function NavigationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  skeleton,
  className 
}: LoadingOverlayProps) {
  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        {skeleton || <Skeleton className="h-32 w-full" />}
      </div>
    );
  }

  return <>{children}</>;
}

// Inline loading component
interface InlineLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function InlineLoading({ 
  size = 'md', 
  text = 'Loading...', 
  className 
}: InlineLoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', sizes[size])} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// Full page loading component
export function FullPageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
