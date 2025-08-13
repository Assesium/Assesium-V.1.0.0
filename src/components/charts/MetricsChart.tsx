import { DynamicChart } from './DynamicChart';
import { ChartData } from 'chart.js';

interface MetricsChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }[];
  };
}

export function MetricsChart({ data }: MetricsChartProps) {
  const chartData: ChartData<'radar'> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      fill: true,
      backgroundColor: dataset.backgroundColor || `rgba(67, 97, 238, ${0.2 + index * 0.2})`,
      borderColor: dataset.borderColor || '#4361ee',
      borderWidth: 2,
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
        display: true,
        text: 'AI Processing Metrics',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: 'rgba(255, 255, 255, 0.95)'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: 'rgba(255, 255, 255, 0.95)'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: 'rgba(255, 255, 255, 0.95)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
    maintainAspectRatio: false
  };

  return <DynamicChart type="radar" data={chartData} options={options} />;
}