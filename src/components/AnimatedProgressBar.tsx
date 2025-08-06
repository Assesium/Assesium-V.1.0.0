import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  value: number;
  color?: string;
  height?: string;
  className?: string;
  duration?: number;
  showPercentage?: boolean;
}

export default function AnimatedProgressBar({
  value,
  color = 'bg-green-500',
  height = 'h-2',
  className = '',
  duration = 3000, // Faster animation (3 seconds)
  showPercentage = false
}: AnimatedProgressBarProps) {
  // Initialize with actual value to avoid empty progress bar
  const [displayValue, setDisplayValue] = useState(value || 0);

  useEffect(() => {
    // Handle undefined or null values
    if (value === undefined || value === null) {
      setDisplayValue(0);
      return;
    }
    
    // If the difference is very small, just set the value directly
    if (Math.abs(value - displayValue) < 0.5) {
      setDisplayValue(value);
      return;
    }
    
    // Reset displayValue when value changes significantly
    if (Math.abs(value - displayValue) > 10) {
      // Start from a more reasonable value for smoother transition
      setDisplayValue(Math.max(0, value - 10));
      return;
    }
    
    const steps = 60; // Fewer steps for more responsive animation
    const stepDuration = duration / steps;
    const increment = (value - displayValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setDisplayValue(prev => prev + increment);
        currentStep++;
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, displayValue, duration]);

  return (
    <div className="relative w-full">
      <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(displayValue)}%
          </span>
        </div>
      )}
    </div>
  );
}