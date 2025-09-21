import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import type { Company } from '../services/mockService';

interface DebtScoreCardProps {
  score: number;
  trend: number[];
  company: Company;
}

export default function DebtScoreCard({ score, trend, company }: DebtScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-green-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-red-50 border-red-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-blue-50 border-blue-200';
    return 'bg-green-50 border-green-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <XCircle className="w-6 h-6 text-red-600" />;
    if (score >= 60) return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    if (score >= 40) return <Minus className="w-6 h-6 text-blue-600" />;
    return <CheckCircle className="w-6 h-6 text-green-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  const trendData = trend.map((value, index) => ({
    month: index + 1,
    score: value
  }));

  const currentTrend = trend.length > 1 ? trend[trend.length - 1] - trend[trend.length - 2] : 0;
  const TrendIcon = currentTrend > 0 ? TrendingUp : currentTrend < 0 ? TrendingDown : Minus;
  const trendColor = currentTrend > 0 ? 'text-red-600' : currentTrend < 0 ? 'text-green-600' : 'text-neutral-500';

  // Calculate breakdown scores
  const spendDebt = Math.min(100, (company.estimated_waste / company.annual_security_spend) * 100);
  const coverageDebt = Math.max(0, 100 - (company.debt_score * 0.6));
  const operationalDebt = Math.max(0, 100 - (company.debt_score * 0.4));

  return (
    <div className={`card p-6 ${getScoreBgColor(score)}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Security Debt Score</h2>
          <p className="text-sm text-neutral-600">Composite risk and efficiency metric</p>
        </div>
        {getScoreIcon(score)}
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)} Risk
          </div>
        </div>

        <div className="flex items-center text-sm">
          <TrendIcon className={`w-4 h-4 mr-1 ${trendColor}`} />
          <span className={trendColor}>
            {Math.abs(currentTrend).toFixed(1)} pts
          </span>
          <span className="text-neutral-500 ml-1">vs last month</span>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-20 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={score >= 60 ? '#dc2626' : '#059669'} 
              strokeWidth={2}
              dot={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-neutral-200 rounded shadow-sm">
                      <p className="text-sm font-medium">
                        Month {payload[0].payload.month}: {payload[0].value} pts
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-700">Score Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Spend Debt</span>
            <span className="text-sm font-medium text-red-600">{spendDebt.toFixed(0)}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${spendDebt}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Coverage Debt</span>
            <span className="text-sm font-medium text-yellow-600">{coverageDebt.toFixed(0)}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${coverageDebt}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Operational Debt</span>
            <span className="text-sm font-medium text-blue-600">{operationalDebt.toFixed(0)}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${operationalDebt}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
