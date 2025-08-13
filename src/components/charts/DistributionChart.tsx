import { DynamicChart } from './DynamicChart';
import { ChartData } from 'chart.js';

interface DistributionChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
    }[];
  };
}

export function DistributionChart({ data }: DistributionChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      borderWidth: 0,
      hoverOffset: 4,
      hoverBorderWidth: 0
    }))
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Processing Results Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'right' as const
      }
    },
    cutout: '60%',
    maintainAspectRatio: false
  };

  return <DynamicChart type="doughnut" data={chartData} options={options} />;
}