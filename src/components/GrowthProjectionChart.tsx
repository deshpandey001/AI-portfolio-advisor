import { TrendingUp, Calendar } from 'lucide-react';

interface GrowthProjectionChartProps {
  projections: Array<{ year: number; conservative: number; expected: number; optimistic: number }>;
  initialAmount: number;
}

export function GrowthProjectionChart({ projections, initialAmount }: GrowthProjectionChartProps) {
  const maxValue = Math.max(...projections.map(p => p.optimistic));
  const minValue = Math.min(...projections.map(p => p.conservative));
  const range = maxValue - minValue;

  const getYPosition = (value: number) => {
    return 100 - ((value - minValue) / range) * 80;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Portfolio Growth Projection</h3>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Conservative (4% return)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600">Expected (7% return)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-600 rounded"></div>
          <span className="text-sm text-gray-600">Optimistic (10% return)</span>
        </div>
      </div>

      <div className="relative h-80 bg-gradient-to-b from-blue-50/50 to-transparent rounded-lg p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="conservativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expectedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="optimisticGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {projections.map((proj, idx) => {
            if (idx === 0) return null;
            const prevProj = projections[idx - 1];
            const x1 = ((idx - 1) / (projections.length - 1)) * 100;
            const x2 = (idx / (projections.length - 1)) * 100;

            return (
              <g key={idx}>
                <line
                  x1={x1}
                  y1={getYPosition(prevProj.conservative)}
                  x2={x2}
                  y2={getYPosition(proj.conservative)}
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="0.5"
                  className="opacity-70"
                />
                <line
                  x1={x1}
                  y1={getYPosition(prevProj.expected)}
                  x2={x2}
                  y2={getYPosition(proj.expected)}
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="1"
                  className="drop-shadow-sm"
                />
                <line
                  x1={x1}
                  y1={getYPosition(prevProj.optimistic)}
                  x2={x2}
                  y2={getYPosition(proj.optimistic)}
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="0.5"
                  className="opacity-70"
                />
              </g>
            );
          })}

          {projections.map((proj, idx) => {
            const x = (idx / (projections.length - 1)) * 100;
            return (
              <g key={`point-${idx}`}>
                <circle
                  cx={x}
                  cy={getYPosition(proj.expected)}
                  r="1"
                  fill="rgb(59, 130, 246)"
                  className="drop-shadow-md"
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute top-2 right-2 text-xs text-gray-400">
          {formatCurrency(maxValue)}
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {formatCurrency(minValue)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {[10, 20, 30].map((years) => {
          const projection = projections.find(p => p.year === years);
          if (!projection) return null;

          return (
            <div key={years} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-1 mb-2">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-semibold text-gray-600">{years} Years</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(projection.expected)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Expected value
              </div>
            </div>
          );
        })}

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Initial</div>
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(initialAmount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Starting value
          </div>
        </div>
      </div>
    </div>
  );
}
