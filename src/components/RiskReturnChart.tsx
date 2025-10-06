import { BarChart3, TrendingUp, Shield } from 'lucide-react';
import type { Allocation } from '../types';

interface RiskReturnChartProps {
  allocation: Allocation;
}

interface AssetClass {
  name: string;
  allocation: number;
  expectedReturn: number;
  risk: number;
  color: string;
  icon: typeof TrendingUp;
}

export function RiskReturnChart({ allocation }: RiskReturnChartProps) {
  const assetClasses: AssetClass[] = [
    {
      name: 'Stocks',
      allocation: allocation.stocks,
      expectedReturn: 9.5,
      risk: 18,
      color: 'rgb(59, 130, 246)',
      icon: TrendingUp,
    },
    {
      name: 'Bonds',
      allocation: allocation.bonds,
      expectedReturn: 4.5,
      risk: 6,
      color: 'rgb(34, 197, 94)',
      icon: Shield,
    },
    {
      name: 'Cash',
      allocation: allocation.cash,
      expectedReturn: 2.0,
      risk: 1,
      color: 'rgb(245, 158, 11)',
      icon: Shield,
    },
  ];

  const maxRisk = Math.max(...assetClasses.map(a => a.risk));
  const maxReturn = Math.max(...assetClasses.map(a => a.expectedReturn));

  const portfolioReturn = assetClasses.reduce(
    (sum, asset) => sum + (asset.expectedReturn * asset.allocation) / 100,
    0
  );

  const portfolioRisk = Math.sqrt(
    assetClasses.reduce(
      (sum, asset) => sum + Math.pow((asset.risk * asset.allocation) / 100, 2),
      0
    )
  );

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Risk vs Return Analysis</h3>
      </div>

      <div className="relative h-80 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-8 mb-6">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0 opacity-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-gray-300"></div>
        <div className="absolute bottom-4 left-4 top-4 w-0.5 bg-gray-300"></div>

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">
          Risk (Volatility %)
        </div>
        <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium">
          Expected Return (%)
        </div>

        <div className="relative w-full h-full">
          {assetClasses.map((asset) => {
            const Icon = asset.icon;
            const x = (asset.risk / maxRisk) * 70 + 10;
            const y = 85 - (asset.expectedReturn / maxReturn) * 70;

            return (
              <div
                key={asset.name}
                className="absolute group cursor-pointer transition-transform hover:scale-110"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:shadow-xl"
                  style={{
                    backgroundColor: asset.color,
                    opacity: 0.2 + (asset.allocation / 100) * 0.8,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: asset.color }} />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="text-xs font-semibold text-gray-700">{asset.name}</div>
                  <div className="text-xs text-gray-500">{asset.allocation.toFixed(1)}%</div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                  Return: {asset.expectedReturn}% | Risk: {asset.risk}%
                </div>
              </div>
            );
          })}

          <div
            className="absolute group cursor-pointer"
            style={{
              left: `${(portfolioRisk / maxRisk) * 70 + 10}%`,
              top: `${85 - (portfolioReturn / maxReturn) * 70}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-blue-200 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="text-xs font-bold text-blue-600">Portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Expected Return</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{portfolioReturn.toFixed(2)}%</div>
          <div className="text-xs text-gray-500 mt-1">Annual portfolio return</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-gray-700">Portfolio Risk</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{portfolioRisk.toFixed(2)}%</div>
          <div className="text-xs text-gray-500 mt-1">Standard deviation</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold">Risk-Return Trade-off:</span> Higher potential returns
          typically come with increased volatility. Your portfolio is positioned at{' '}
          {portfolioReturn.toFixed(1)}% expected annual return with {portfolioRisk.toFixed(1)}%
          volatility, balancing growth potential with risk management.
        </p>
      </div>
    </div>
  );
}
