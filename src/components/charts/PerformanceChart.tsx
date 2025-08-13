import { DynamicChart } from './DynamicChart';
import { ChartData } from 'chart.js';

interface PerformanceChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
  };
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData: ChartData<'line'> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointBackgroundColor: dataset.borderColor || '#4361ee',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: dataset.borderColor || '#4361ee',
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
      pointHoverRadius: 6,
      pointHitRadius: 10
    }))
  };

  const options = {
    plugins: {
      title: {
        display: false // Remove title as it's shown in the parent component
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(255, 255, 255, 0.95)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: false // Remove axis title for cleaner look
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            size: 11
          },
          padding: 8
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        border: {
          display: false
        }
      },
      x: {
        title: {
          display: false // Remove axis title for cleaner look
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            size: 11
          },
          padding: 8
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return <DynamicChart type="line" data={chartData} options={options} />;
}