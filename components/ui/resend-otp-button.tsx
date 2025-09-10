"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResendOTPButtonProps {
  /** Function to call when resending OTP */
  onResend: () => Promise<void>;
  /** Cooldown period in seconds */
  cooldownSeconds?: number;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg';
  /** Custom text for different states */
  text?: {
    ready?: string;
    cooldown?: string;
    sending?: string;
    success?: string;
    error?: string;
  };
  /** Callback when resend is successful */
  onSuccess?: () => void;
  /** Callback when resend fails */
  onError?: (error: string) => void;
}

type ResendState = 'ready' | 'cooldown' | 'sending' | 'success' | 'error';

export function ResendOTPButton({
  onResend,
  cooldownSeconds = 30,
  disabled = false,
  className,
  variant = 'outline',
  size = 'default',
  text = {},
  onSuccess,
  onError,
}: ResendOTPButtonProps) {
  const [state, setState] = useState<ResendState>('ready');
  const [remainingTime, setRemainingTime] = useState(0);
  const [error, setError] = useState<string>('');

  const defaultText = {
    ready: 'Resend Code',
    cooldown: `Resend in ${remainingTime}s`,
    sending: 'Sending...',
    success: 'Code Sent!',
    error: 'Failed to Send',
    ...text,
  };

  useEffect(() => {
    if (state === 'cooldown' && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setState('ready');
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state, remainingTime]);

  useEffect(() => {
    if (state === 'success') {
      const timer = setTimeout(() => {
        setState('ready');
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state]);

  useEffect(() => {
    if (state === 'error') {
      const timer = setTimeout(() => {
        setState('ready');
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state]);

  const handleResend = async () => {
    if (state !== 'ready' || disabled) return;

    setState('sending');
    setError('');

    try {
      await onResend();
      setState('success');
      onSuccess?.();
      
      setTimeout(() => {
        setState('cooldown');
        setRemainingTime(cooldownSeconds);
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
      setState('error');
      onError?.(errorMessage);
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'ready':
        return (
          <>
            <RefreshCw className="w-4 h-4" />
            {defaultText.ready}
          </>
        );
      
      case 'cooldown':
        return (
          <>
            <Clock className="w-4 h-4" />
            {defaultText.cooldown?.replace('${remainingTime}', remainingTime.toString()) || `Resend in ${remainingTime}s`}
          </>
        );
      
      case 'sending':
        return (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            {defaultText.sending}
          </>
        );
      
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            {defaultText.success}
          </>
        );
      
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            {defaultText.error}
          </>
        );
      
      default:
        return defaultText.ready;
    }
  };

  const getButtonVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return variant;
    }
  };

  const isButtonDisabled = disabled || state === 'cooldown' || state === 'sending';

  return (
    <div className="space-y-2">
      <Button
        onClick={handleResend}
        disabled={isButtonDisabled}
        variant={getButtonVariant() as any}
        size={size}
        className={cn(
          "transition-all duration-200 gap-2",
          state === 'success' && "bg-green-600 hover:bg-green-700 text-white",
          state === 'error' && "bg-red-600 hover:bg-red-700 text-white",
          className
        )}
      >
        {getButtonContent()}
      </Button>
      
      {/* Error message */}
      {state === 'error' && error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// Simplified version with just cooldown
export function SimpleResendButton({
  onResend,
  cooldownSeconds = 30,
  disabled = false,
  className,
}: {
  onResend: () => void | Promise<void>;
  cooldownSeconds?: number;
  disabled?: boolean;
  className?: string;
}) {
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (isOnCooldown && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsOnCooldown(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOnCooldown, remainingTime]);

  const handleClick = async () => {
    if (isOnCooldown || disabled) return;

    try {
      await onResend();
      setIsOnCooldown(true);
      setRemainingTime(cooldownSeconds);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isOnCooldown}
      variant="ghost"
      size="sm"
      className={cn(
        "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
        className
      )}
    >
      {isOnCooldown ? (
        <>
          <Clock className="w-4 h-4 mr-1" />
          Resend in {remainingTime}s
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4 mr-1" />
          Resend Code
        </>
      )}
    </Button>
  );
}

// Hook for resend functionality
export function useResendOTP(
  resendFunction: () => Promise<void>,
  cooldownSeconds: number = 30
) {
  const [state, setState] = useState<ResendState>('ready');
  const [remainingTime, setRemainingTime] = useState(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (state === 'cooldown' && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setState('ready');
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state, remainingTime]);

  const resend = async () => {
    if (state !== 'ready') return;

    setState('sending');
    setError('');

    try {
      await resendFunction();
      setState('success');
      
      setTimeout(() => {
        setState('cooldown');
        setRemainingTime(cooldownSeconds);
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
      setState('error');
      
      setTimeout(() => {
        setState('ready');
        setError('');
      }, 3000);
    }
  };

  return {
    state,
    remainingTime,
    error,
    resend,
    canResend: state === 'ready',
    isLoading: state === 'sending',
  };
}
