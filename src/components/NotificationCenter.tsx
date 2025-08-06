import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationCenter({ notifications, onDismiss }: NotificationCenterProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getGradient = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-100';
      case 'error':
        return 'from-red-50 to-rose-50 border-red-100';
      case 'warning':
        return 'from-yellow-50 to-amber-50 border-yellow-100';
      default:
        return 'from-blue-50 to-indigo-50 border-blue-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 min-w-[320px] max-w-[420px]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-gradient-to-br ${getGradient(notification.type)} border rounded-xl shadow-lg p-4`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}