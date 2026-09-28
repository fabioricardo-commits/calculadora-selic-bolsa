import React from 'react';
import { CalculationResult } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ComparisonChartProps {
  result: CalculationResult;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ result }) => {
  const labels = result.monthlyData.map(d => d.dateStr);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Base datasets: Total Invested & Selic
  const datasets: any[] = [
    {
      label: 'Total Investido (Aportes)',
      data: result.monthlyData.map(d => d.totalInvested),
      borderColor: '#64748b',
      backgroundColor: 'rgba(100, 116, 139, 0.05)',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0.1,
    },
    {
      label: 'Tesouro Selic (Renda Fixa)',
      data: result.monthlyData.map(d => d.selicNetBalance),
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 5,
      fill: true,
      tension: 0.2,
    },
  ];

  // Combined Portfolio dataset if multiple stocks selected
  if (result.stockResults.length > 1) {
    datasets.push({
      label: 'Carteira de Ações (Média)',
      data: result.monthlyData.map(d => d.portfolioNetBalance),
      borderColor: '#bc13fe',
      backgroundColor: 'rgba(188, 19, 254, 0.15)',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.3,
    });
  }

  // Individual stock datasets
  result.stockResults.forEach((s) => {
    datasets.push({
      label: `Ação ${s.ticker}`,
      data: result.monthlyData.map(d => d.stockBalances[s.ticker] ?? 0),
      borderColor: s.color,
      backgroundColor: 'transparent',
      borderWidth: result.stockResults.length > 1 ? 1.5 : 3,
      borderDash: result.stockResults.length > 1 ? [2, 2] : [],
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: false,
      tension: 0.3,
    });
  });

  const data = {
    labels,
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11,
            weight: 600,
          },
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: '#090d16',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y ?? 0;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#1e293b',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: {
          color: '#1e293b',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          callback: (value) => formatCurrency(typeof value === 'number' ? value : parseFloat(value as string) || 0),
        },
      },
    },
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-400" />
            Evolução do Patrimônio e Curva de Risco
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparação mês a mês de Selic vs {result.stockResults.map(s => s.ticker).join(', ')}.
          </p>
        </div>
      </div>

      <div className="h-80 md:h-96 w-full pt-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
