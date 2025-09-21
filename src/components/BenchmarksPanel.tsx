import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Users, DollarSign } from 'lucide-react';
import { mockService } from '../services/mockService';

interface BenchmarkData {
  industry: string;
  companySize: number;
  securitySpend: number;
  spendPerEmployee: number;
  benchmarks: {
    spendPerEmployee: {
      percentile25: number;
      percentile50: number;
      percentile75: number;
      percentile90: number;
      current: number;
    };
    toolsPerEmployee: {
      percentile25: number;
      percentile50: number;
      percentile75: number;
      percentile90: number;
      current: number;
    };
    utilizationRate: {
      percentile25: number;
      percentile50: number;
      percentile75: number;
      percentile90: number;
      current: number;
    };
  };
}

export default function BenchmarksPanel() {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBenchmarks = async () => {
      try {
        setLoading(true);
        const data = await mockService.getBenchmarks();
        setBenchmarkData(data);
      } catch (error) {
        console.error('Failed to load benchmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBenchmarks();
  }, []);

  const getPercentilePosition = (current: number, percentiles: { percentile25: number; percentile50: number; percentile75: number; percentile90: number }) => {
    if (current <= percentiles.percentile25) return 25;
    if (current <= percentiles.percentile50) return 50;
    if (current <= percentiles.percentile75) return 75;
    if (current <= percentiles.percentile90) return 90;
    return 95;
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile <= 25) return 'text-green-600';
    if (percentile <= 50) return 'text-blue-600';
    if (percentile <= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (current: number, median: number) => {
    if (current > median) return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (current < median) return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <Minus className="w-4 h-4 text-neutral-500" />;
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!benchmarkData) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Industry Benchmarks</h3>
        <p className="text-neutral-600">Failed to load benchmark data</p>
      </div>
    );
  }

  const spendPercentile = getPercentilePosition(benchmarkData.benchmarks.spendPerEmployee.current, benchmarkData.benchmarks.spendPerEmployee);
  const toolsPercentile = getPercentilePosition(benchmarkData.benchmarks.toolsPerEmployee.current, benchmarkData.benchmarks.toolsPerEmployee);
  const utilizationPercentile = getPercentilePosition(benchmarkData.benchmarks.utilizationRate.current, benchmarkData.benchmarks.utilizationRate);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Industry Benchmarks</h3>
        <span className="text-sm text-neutral-500">{benchmarkData.industry}</span>
      </div>

      <div className="space-y-6">
        {/* Spend per Employee */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-neutral-400 mr-2" />
              <span className="text-sm font-medium text-neutral-700">Spend per Employee</span>
            </div>
            <div className="flex items-center">
              {getTrendIcon(benchmarkData.benchmarks.spendPerEmployee.current, benchmarkData.benchmarks.spendPerEmployee.percentile50)}
              <span className={`ml-1 text-sm font-medium ${getPercentileColor(spendPercentile)}`}>
                {spendPercentile}th percentile
              </span>
            </div>
          </div>
          <div className="text-lg font-semibold text-neutral-900 mb-2">
            ${benchmarkData.benchmarks.spendPerEmployee.current.toFixed(0)}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>25th: ${benchmarkData.benchmarks.spendPerEmployee.percentile25}</span>
              <span>50th: ${benchmarkData.benchmarks.spendPerEmployee.percentile50}</span>
              <span>75th: ${benchmarkData.benchmarks.spendPerEmployee.percentile75}</span>
              <span>90th: ${benchmarkData.benchmarks.spendPerEmployee.percentile90}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (spendPercentile / 90) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tools per Employee */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-neutral-400 mr-2" />
              <span className="text-sm font-medium text-neutral-700">Tools per Employee</span>
            </div>
            <div className="flex items-center">
              {getTrendIcon(benchmarkData.benchmarks.toolsPerEmployee.current, benchmarkData.benchmarks.toolsPerEmployee.percentile50)}
              <span className={`ml-1 text-sm font-medium ${getPercentileColor(toolsPercentile)}`}>
                {toolsPercentile}th percentile
              </span>
            </div>
          </div>
          <div className="text-lg font-semibold text-neutral-900 mb-2">
            {benchmarkData.benchmarks.toolsPerEmployee.current.toFixed(1)}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>25th: {benchmarkData.benchmarks.toolsPerEmployee.percentile25}</span>
              <span>50th: {benchmarkData.benchmarks.toolsPerEmployee.percentile50}</span>
              <span>75th: {benchmarkData.benchmarks.toolsPerEmployee.percentile75}</span>
              <span>90th: {benchmarkData.benchmarks.toolsPerEmployee.percentile90}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (toolsPercentile / 90) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Utilization Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Target className="w-4 h-4 text-neutral-400 mr-2" />
              <span className="text-sm font-medium text-neutral-700">Avg Utilization</span>
            </div>
            <div className="flex items-center">
              {getTrendIcon(benchmarkData.benchmarks.utilizationRate.current, benchmarkData.benchmarks.utilizationRate.percentile50)}
              <span className={`ml-1 text-sm font-medium ${getPercentileColor(utilizationPercentile)}`}>
                {utilizationPercentile}th percentile
              </span>
            </div>
          </div>
          <div className="text-lg font-semibold text-neutral-900 mb-2">
            {benchmarkData.benchmarks.utilizationRate.current.toFixed(0)}%
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>25th: {benchmarkData.benchmarks.utilizationRate.percentile25}%</span>
              <span>50th: {benchmarkData.benchmarks.utilizationRate.percentile50}%</span>
              <span>75th: {benchmarkData.benchmarks.utilizationRate.percentile75}%</span>
              <span>90th: {benchmarkData.benchmarks.utilizationRate.percentile90}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (utilizationPercentile / 90) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          Based on {benchmarkData.industry} companies with {benchmarkData.companySize} employees
        </div>
      </div>
    </div>
  );
}
