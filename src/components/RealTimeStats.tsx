import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatProps {
  label: string;
  value: number;
  previousValue: number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export default function RealTimeStats({ label, value, previousValue, unit = '', icon, trend, trendValue, gradientFrom, gradientVia, gradientTo }: StatProps) {
  // Initialize with actual value to prevent empty display during loading
  const [displayValue, setDisplayValue] = useState(value || previousValue || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle undefined or null values
    if (value === undefined || value === null) {
      setDisplayValue(previousValue || 0);
      return;
    }
    
    // If the difference is very small, just set the value directly
    if (Math.abs(value - displayValue) < 0.1) {
      setDisplayValue(value);
      return;
    }
    
    // For significant changes, use a smoother transition with loading state
    if (Math.abs(value - displayValue) > value * 0.1) {
      setIsLoading(true);
      // Use a shorter delay before starting animation
      setTimeout(() => {
        setDisplayValue(value);
        setIsLoading(false);
      }, 300);
      return;
    }
    
    const duration = 2000; // Shorter animation (2 seconds) for better responsiveness
    const steps = 60; // Fewer steps for smoother animation
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
  }, [value, displayValue, previousValue]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          <div className="h-12 flex items-center"> {/* Fixed height container to prevent layout shifts */}
            {isLoading ? (
              <div className="text-3xl font-bold text-white mt-2 animate-pulse">
                {Math.round(previousValue || 0).toLocaleString()}{unit}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={Math.round(displayValue)}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold text-white mt-2"
                >
                  {Math.round(displayValue).toLocaleString()}{unit}
                </motion.p>
              </AnimatePresence>
            )}
          </div>
        </div>
        {icon && (
          <div className="bg-white/20 p-2 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-xs text-white/90">
          <span className={`flex items-center ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
}