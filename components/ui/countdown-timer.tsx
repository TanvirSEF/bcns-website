"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  /** Duration in seconds */
  duration: number;
  /** Callback when timer expires */
  onExpire?: () => void;
  /** Callback with remaining time in seconds */
  onTick?: (remainingSeconds: number) => void;
  /** Whether the timer is active */
  isActive?: boolean;
  /** Custom className */
  className?: string;
  /** Show warning when time is low (in seconds) */
  warningThreshold?: number;
  /** Format: 'MM:SS' or 'M:SS' */
  format?: 'MM:SS' | 'M:SS';
  /** Auto-start timer on mount */
  autoStart?: boolean;
}

export function CountdownTimer({
  duration,
  onExpire,
  onTick,
  isActive = true,
  className,
  warningThreshold = 60, // 1 minute
  format = 'MM:SS',
  autoStart = true,
}: CountdownTimerProps) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart && isActive);

  // Reset timer when duration changes
  useEffect(() => {
    setRemainingTime(duration);
    if (autoStart && isActive) {
      setIsRunning(true);
    }
  }, [duration, isActive, autoStart]);

  // Handle timer expiration
  const handleExpire = useCallback(() => {
    setIsRunning(false);
    onExpire?.();
  }, [onExpire]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || !isActive) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        
        // Call onTick callback
        onTick?.(newTime);
        
        // Check if expired
        if (newTime <= 0) {
          handleExpire();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isActive, onTick, handleExpire]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (format === 'MM:SS') {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  // Determine if we should show warning
  const isWarning = remainingTime <= warningThreshold && remainingTime > 0;
  const isExpired = remainingTime <= 0;


  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
        isExpired 
          ? "bg-red-100 text-red-700 border border-red-200" 
          : isWarning 
          ? "bg-amber-100 text-amber-700 border border-amber-200 animate-pulse" 
          : "bg-blue-100 text-blue-700 border border-blue-200"
      )}>
        {isExpired ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        
        <span className={cn(
          "font-mono text-sm font-semibold",
          isWarning && "animate-pulse"
        )}>
          {formatTime(remainingTime)}
        </span>
      </div>
      
      {/* Status text */}
      <span className={cn(
        "text-xs",
        isExpired 
          ? "text-red-600" 
          : isWarning 
          ? "text-amber-600" 
          : "text-gray-600"
      )}>
        {isExpired 
          ? "Expired" 
          : isWarning 
          ? "Expires soon" 
          : "remaining"
        }
      </span>
    </div>
  );
}

// Extended version with more controls
export function CountdownTimerWithControls({
  duration,
  onExpire,
  onTick,
  className,
  warningThreshold = 60,
  format = 'MM:SS',
  showControls = false,
}: CountdownTimerProps & { showControls?: boolean }) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        onTick?.(newTime);
        
        if (newTime <= 0) {
          setIsRunning(false);
          onExpire?.();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTick, onExpire]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (format === 'MM:SS') {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const isWarning = remainingTime <= warningThreshold && remainingTime > 0;
  const isExpired = remainingTime <= 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn(
        "flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
        "bg-gradient-to-r backdrop-blur-sm border",
        isExpired 
          ? "from-red-50 to-red-100 border-red-200 text-red-700" 
          : isWarning 
          ? "from-amber-50 to-amber-100 border-amber-200 text-amber-700" 
          : "from-blue-50 to-blue-100 border-blue-200 text-blue-700"
      )}>
        {isExpired ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <Clock className="w-5 h-5" />
        )}
        
        <div className="text-center">
          <div className={cn(
            "font-mono text-2xl font-bold",
            isWarning && !isExpired && "animate-pulse"
          )}>
            {formatTime(remainingTime)}
          </div>
          <div className="text-xs opacity-75">
            {isExpired ? "Code Expired" : "Time Remaining"}
          </div>
        </div>
      </div>

      {showControls && !isExpired && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={() => {
              setRemainingTime(duration);
              setIsRunning(true);
            }}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

// Hook for using countdown timer logic
export function useCountdownTimer(
  duration: number,
  options: {
    onExpire?: () => void;
    onTick?: (remainingSeconds: number) => void;
    autoStart?: boolean;
  } = {}
) {
  const { onExpire, onTick, autoStart = true } = options;
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        onTick?.(newTime);
        
        if (newTime <= 0) {
          setIsRunning(false);
          onExpire?.();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTick, onExpire]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setRemainingTime(duration);
    setIsRunning(autoStart);
  };

  return {
    remainingTime,
    isRunning,
    isExpired: remainingTime <= 0,
    start,
    pause,
    reset,
  };
}
