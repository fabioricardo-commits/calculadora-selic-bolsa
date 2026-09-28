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
import { LineChart, BarChart2 } from 'lucide-react';

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

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Investido (Aportes)',
        data: result.monthlyData.map(d => d.totalInvested),
        borderColor: '#64748b', // Slate 500
        backgroundColor: 'rgba(100, 116, 139, 0.05)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Patrimônio Selic (Renda Fixa)',
        data: result.monthlyData.map(d => d.selicNetBalance),
        borderColor: '#38bdf8', // Sky 400
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return undefined;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointRadius: (ctx: any) => (ctx.dataIndex === result.monthlyData.length - 1 ? 6 : 0),
        pointBackgroundColor: '#38bdf8',
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3,
      },
      {
        label: `Patrimônio Ação (${result.stockTicker})`,
        data: result.monthlyData.map(d => d.stockNetBalance),
        borderColor: '#c084fc', // Purple 400
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return undefined;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(192, 132, 252, 0.25)');
          gradient.addColorStop(1, 'rgba(192, 132, 252, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointRadius: (ctx: any) => (ctx.dataIndex === result.monthlyData.length - 1 ? 6 : 0),
        pointBackgroundColor: '#c084fc',
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3,
      },
    ],
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
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          boxWidth: 8,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
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
          maxRotation: 0,
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-400" />
            Evolução do Patrimônio ao Longo do Tempo
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparação mês a mês entre Selic, {result.stockTicker} e total aportado.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <span className="w-3 h-0.5 bg-sky-400 rounded-full"></span> Selic
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
            <span className="w-3 h-0.5 bg-purple-400 rounded-full"></span> {result.stockTicker}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <span className="w-3 h-0.5 bg-slate-500 border-dashed border-t rounded-full"></span> Aportes
          </div>
        </div>
      </div>

      <div className="h-80 md:h-96 w-full pt-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
