import { PieChart, TrendingUp } from 'lucide-react';
import type { Allocation } from '../types';

interface AllocationChartProps {
  allocation: Allocation;
  title: string;
}

export function AllocationChart({ allocation, title }: AllocationChartProps) {
  const total = allocation.stocks + allocation.bonds + allocation.cash;
  const stocksPercent = (allocation.stocks / total) * 100;
  const bondsPercent = (allocation.bonds / total) * 100;
  const cashPercent = (allocation.cash / total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-6">
        <div className="relative h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="40"
              strokeDasharray={`${(stocksPercent / 100) * 502.65} 502.65`}
              className="transition-all duration-1000"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="40"
              strokeDasharray={`${(bondsPercent / 100) * 502.65} 502.65`}
              strokeDashoffset={`-${(stocksPercent / 100) * 502.65}`}
              className="transition-all duration-1000"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="40"
              strokeDasharray={`${(cashPercent / 100) * 502.65} 502.65`}
              strokeDashoffset={`-${((stocksPercent + bondsPercent) / 100) * 502.65}`}
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="font-semibold text-gray-700">Stocks</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">{allocation.stocks.toFixed(1)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="font-semibold text-gray-700">Bonds</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">{allocation.bonds.toFixed(1)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-600"></div>
              <span className="font-semibold text-gray-700">Cash</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-lg font-bold text-amber-600">{allocation.cash.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
