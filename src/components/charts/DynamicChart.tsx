import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define vibrant colors for dark mode and light mode
const getChartColors = (isDarkMode: boolean) => {
  // Use vibrant, gradient-friendly colors that pop visually
  // These colors are selected to work well in both light and dark modes
  return [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#ef4444', // Red
    '#3b82f6'  // Blue
  ];
};

// Define gradient colors for pie/doughnut charts
const getPieChartGradients = (ctx: CanvasRenderingContext2D, isDarkMode: boolean) => {
  // Create vibrant gradient colors that pop in both light and dark modes
  return [
    createGradient(ctx, ['#4361ee', '#4cc9f0']), // Blue gradient
    createGradient(ctx, ['#f72585', '#ff0a54']), // Pink gradient
    createGradient(ctx, ['#7209b7', '#560bad']), // Purple gradient
    createGradient(ctx, ['#4cc9f0', '#06b6d4']), // Cyan gradient
    createGradient(ctx, ['#ffbe0b', '#fb8500']), // Orange gradient
    createGradient(ctx, ['#10b981', '#059669']), // Emerald gradient
    createGradient(ctx, ['#ef4444', '#dc2626']), // Red gradient
    createGradient(ctx, ['#8b5cf6', '#7c3aed'])  // Violet gradient
  ];
};

// Helper function to create gradient
const createGradient = (ctx: CanvasRenderingContext2D, colors: string[]) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  return gradient;
};

const getDefaultOptions = (isDarkMode: boolean): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        font: {
          size: 12,
          family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }
      }
    },
    tooltip: {
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(0, 0, 0, 0.8)',
      titleColor: 'rgba(255, 255, 255, 1)',
      bodyColor: 'rgba(255, 255, 255, 0.9)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold',
        family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      },
      bodyFont: {
        size: 13,
        family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      },
      cornerRadius: 4,
      displayColors: true,
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        font: {
          size: 12,
          family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }
      }
    },
    y: {
      grid: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        font: {
          size: 12,
          family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }
      }
    }
  }
});

interface DynamicChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'radar';
  data: ChartData<any>;
  options?: ChartOptions<any>;
  className?: string;
}

export function DynamicChart({ type, data, options = {}, className = '' }: DynamicChartProps) {
  const chartRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Update theme state when it changes
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      setIsReady(true);
    };

    // Initial theme check
    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Get colors based on theme
  const colors = getChartColors(isDarkMode);

  // Update chart data with theme colors
  const themedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: Array.isArray(dataset.backgroundColor) 
        ? (isDarkMode ? dataset.backgroundColor.map(color => color.replace(/\d+\)$/, '0.8)')) : dataset.backgroundColor) 
        : colors[index % colors.length] + (type === 'line' ? '20' : ''),
      borderColor: type === 'doughnut' ? (isDarkMode ? '#FFFFFF' : '#FFFFFF') : (dataset.borderColor || colors[index % colors.length]),
      borderWidth: type === 'doughnut' ? 2 : (dataset.borderWidth || (isDarkMode ? 2 : 1.5))
    }))
  };

  // Merge options
  const chartOptions = {
    ...getDefaultOptions(isDarkMode),
    ...options
  };

  // Update chart on theme change
  useEffect(() => {
    if (!isReady) return;
    
    const chart = chartRef.current?.chartInstance;
    if (chart) {
      chart.update();
    }
  }, [isDarkMode, isReady]);

  const ChartComponent = {
    line: Line,
    bar: Bar,
    doughnut: Doughnut,
    radar: Radar
  }[type];

  if (!ChartComponent) {
    console.error(`Chart type "${type}" is not supported`);
    return null;
  }

  if (!isReady) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`w-full h-[300px] outline-none ${className}`} style={{outline: 'none'}}>
      <ChartComponent
        ref={chartRef}
        data={themedData}
        options={chartOptions}
      />
    </div>
  );
}