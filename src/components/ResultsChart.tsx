import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: number[];
}

export const ResultsChart = ({ data }: Props) => {
  const counts: Record<number, number> = {};
  data.forEach(val => counts[val] = (counts[val] || 0) + 1);

  const chartData = {
    labels: Object.keys(counts),
    datasets: [{
      label: 'Número de Cenários',
      data: Object.values(counts),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
    </div>
  );
};
