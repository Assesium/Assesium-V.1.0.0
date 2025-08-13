import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  status: 'Processing' | 'Completed' | 'Failed' | 'In Review';
  className?: string;
}

export default function ProgressBar({ progress, status, className = '' }: ProgressBarProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Failed':
        return 'bg-red-500';
      case 'In Review':
        return 'bg-yellow-500';
      case 'Processing':
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusGradient = () => {
    switch (status) {
      case 'Completed':
        return 'from-green-500 to-green-600';
      case 'Failed':
        return 'from-red-500 to-red-600';
      case 'In Review':
        return 'from-yellow-500 to-yellow-600';
      case 'Processing':
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${getStatusGradient()}`}
      />
    </div>
  );
}