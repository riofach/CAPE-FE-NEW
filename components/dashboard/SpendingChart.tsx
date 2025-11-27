import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
  data: Array<{
    category: { name: string; colorHex: string } | null;
    total: number;
    percentage: number;
  }>;
  isLoading?: boolean;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-32 h-32 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 text-slate-500"
      >
        <span className="text-5xl mb-3">📊</span>
        <p className="font-medium">Belum ada data spending</p>
        <p className="text-sm text-slate-400">Mulai catat pengeluaranmu!</p>
      </motion.div>
    );
  }

  const chartData = {
    labels: data.map(d => d.category?.name || 'Lainnya'),
    datasets: [{
      data: data.map(d => d.total),
      backgroundColor: data.map(d => d.category?.colorHex || '#94a3b8'),
      borderColor: '#f0f4f8',
      borderWidth: 4,
      hoverBorderWidth: 6,
      hoverOffset: 8,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 14,
        cornerRadius: 12,
        titleFont: { 
          size: 14, 
          weight: 'bold' as const,
          family: "'Quicksand', sans-serif"
        },
        bodyFont: { 
          size: 13,
          family: "'Quicksand', sans-serif"
        },
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 6,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = data[context.dataIndex]?.percentage || 0;
            return ` Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart' as const
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-64 relative"
    >
      <Doughnut data={chartData} options={options} />
      {/* Center Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-700">
            {data.length}
          </p>
          <p className="text-xs text-slate-500">Kategori</p>
        </div>
      </div>
    </motion.div>
  );
};
