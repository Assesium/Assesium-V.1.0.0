import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, HardDrive, Network } from 'lucide-react';

interface MetricProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

const MetricCard = ({ label, value, icon, color, trend, trendValue }: MetricProps) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    // If the difference is very small, just set the value directly
    if (Math.abs(value - displayValue) < 0.1) {
      setDisplayValue(value);
      return;
    }
    
    // Reset displayValue when value changes significantly
    if (Math.abs(value - displayValue) > 10) {
      setDisplayValue(value);
      return;
    }
    
    const duration = 4000; // 4 seconds animation (increased from 2 seconds)
    const steps = 120; // 120 steps for smoother animation (increased from 60)
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
  }, [value, displayValue]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${color} rounded-2xl shadow-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={displayValue}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-white mt-1"
            >
              {Math.round(displayValue)}%
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="bg-white/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-1 flex items-center text-xs text-white/90">
          <span className={`flex items-center ${trend === 'up' ? 'text-green-200' : trend === 'down' ? 'text-red-200' : 'text-blue-200'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default function AIProcessingMetrics() {
  const metrics: MetricProps[] = [
    {
      label: 'CPU Usage',
      value: 58,
      icon: <Cpu className="h-5 w-5 text-white" />,
      color: 'from-blue-500 via-blue-600 to-indigo-700',
      trend: 'up',
      trendValue: '+5% from last hour'
    },
    {
      label: 'Memory Usage',
      value: 72,
      icon: <Brain className="h-5 w-5 text-white" />,
      color: 'from-purple-500 via-purple-600 to-fuchsia-700',
      trend: 'stable',
      trendValue: 'Optimal'
    },
    {
      label: 'Storage',
      value: 45,
      icon: <HardDrive className="h-5 w-5 text-white" />,
      color: 'from-pink-500 via-pink-600 to-rose-700',
      trend: 'down',
      trendValue: '-2% from last hour'
    },
    {
      label: 'Network',
      value: 32,
      icon: <Network className="h-5 w-5 text-white" />,
      color: 'from-cyan-500 via-cyan-600 to-teal-700',
      trend: 'stable',
      trendValue: 'Normal'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
