import { AlertCircle } from 'lucide-react';

interface StockIndicatorProps {
  remaining: number;
  total: number;
}

export function StockIndicator({ remaining, total }: StockIndicatorProps) {
  const percentage = (remaining / total) * 100;
  const isLow = percentage <= 20;
  const isCritical = percentage <= 10;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {(isLow || isCritical) && (
            <AlertCircle className={`w-4 h-4 ${isCritical ? 'text-red-400' : 'text-terra-400'}`} />
          )}
          <span className={`text-sm font-semibold ${isCritical ? 'text-red-400' : isLow ? 'text-terra-400' : 'text-sage-400'}`}>
            Остават само {remaining} от {total} броя
          </span>
        </div>
        <span className="text-sm font-bold text-sage-300">{percentage.toFixed(0)}%</span>
      </div>

      <div className="w-full bg-forest-950 rounded-full h-2 overflow-hidden border border-forest-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : isLow
              ? 'bg-gradient-to-r from-terra-500 to-terra-600'
              : 'bg-gradient-to-r from-forest-500 to-forest-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
