import { DollarSign, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import type { Company } from '../services/mockService';

interface FinancialSummaryCardProps {
  totalSpend: number;
  estimatedWaste: number;
  projectedSavings: number;
  company: Company;
}

export default function FinancialSummaryCard({ 
  totalSpend, 
  estimatedWaste, 
  projectedSavings, 
  company 
}: FinancialSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const wastePercentage = (estimatedWaste / totalSpend) * 100;
  const savingsPercentage = (projectedSavings / totalSpend) * 100;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Financial Summary</h3>
      
      <div className="space-y-4">
        {/* Total Spend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-neutral-400 mr-2" />
            <span className="text-sm text-neutral-600">Total Security Spend</span>
          </div>
          <span className="text-lg font-semibold text-neutral-900">
            {formatCurrency(totalSpend)}
          </span>
        </div>

        {/* Estimated Waste */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm text-neutral-600">Estimated Annual Waste</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-red-600">
              {formatCurrency(estimatedWaste)}
            </span>
            <div className="text-xs text-red-500">
              {wastePercentage.toFixed(1)}% of spend
            </div>
          </div>
        </div>

        {/* Projected Savings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-neutral-600">Projected Savings</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(projectedSavings)}
            </span>
            <div className="text-xs text-green-500">
              {savingsPercentage.toFixed(1)}% of spend
            </div>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Budget Utilization</span>
            <span className="text-sm font-medium text-neutral-900">
              {((totalSpend / (company.annual_revenue * company.security_budget_pct)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ 
                width: `${Math.min(100, (totalSpend / (company.annual_revenue * company.security_budget_pct)) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            of {company.security_budget_pct * 100}% security budget
          </div>
        </div>

        {/* ROI Potential */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">ROI Potential</span>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">
                {((projectedSavings / estimatedWaste) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Return on optimization investment
          </div>
        </div>
      </div>
    </div>
  );
}
