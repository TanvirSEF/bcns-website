"use client";

import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  resetKey?: number; // Key to force reset the component
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className,
  inputClassName,
  placeholder = '0',
  autoFocus = true,
  resetKey = 0,
}: OTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasCalledOnComplete = useRef(false);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length && onComplete && !hasCalledOnComplete.current) {
      hasCalledOnComplete.current = true;
      onComplete(value);
    }
  }, [value, length, onComplete]);

  // Reset the flag when value changes (user starts typing new OTP)
  useEffect(() => {
    if (value.length < length) {
      hasCalledOnComplete.current = false;
    }
  }, [value.length, length]);

  // Reset the component when resetKey changes
  useEffect(() => {
    hasCalledOnComplete.current = false;
  }, [resetKey]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
      setActiveIndex(index);
    }
  };

  const handleInputChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    const newValue = value.split('');
    newValue[index] = digit;
    
    while (newValue.length < length) {
      newValue.push('');
    }
    
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newValue = value.split('');
      
      if (newValue[index]) {
        newValue[index] = '';
      } else if (index > 0) {
        newValue[index - 1] = '';
        focusInput(index - 1);
      }
      
      onChange(newValue.join(''));
    }
    else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }
    else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
    else if (e.key === 'Enter' && value.length === length) {
      e.preventDefault();
      onComplete?.(value);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits) {
      onChange(digits.padEnd(length, ''));
      
      const nextIndex = Math.min(digits.length, length - 1);
      focusInput(nextIndex);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
    
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.select();
    }
  };

  const handleClick = (index: number) => {
    focusInput(index);
  };

  return (
    <div className={cn("flex gap-2 sm:gap-3", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onClick={() => handleClick(index)}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            // Base styles
            "w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold",
            "border-2 rounded-xl transition-all duration-200",
            "bg-white/80 backdrop-blur-sm",
            
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
            
            // Active/filled styles
            value[index] 
              ? "border-blue-500 bg-blue-50/50 text-blue-900" 
              : "border-gray-300 hover:border-gray-400",
            
            // Current active input
            activeIndex === index && !value[index] && "border-blue-400 bg-blue-50/30",
            
            // Disabled styles
            disabled && "opacity-50 cursor-not-allowed bg-gray-100",
            
            // Mobile optimizations
            "touch-manipulation select-all",
            
            // Custom className
            inputClassName
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-describedby="otp-description"
        />
      ))}
    </div>
  );
}

// Helper component for better accessibility
export function OTPInputGroup({
  children,
  label,
  description,
  error,
}: {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {description && (
        <p id="otp-description" className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
