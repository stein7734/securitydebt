import { useState, useEffect } from 'react';
import { BarChart3, Search, Zap } from 'lucide-react';
import { mockService } from '../services/mockService';
import type { DashboardData } from '../services/mockService';
import DebtScoreCard from '../components/DebtScoreCard';
import FinancialSummaryCard from '../components/FinancialSummaryCard';
import InventoryTable from '../components/InventoryTable';
import RecommendationCard from '../components/RecommendationCard';
import ActivityFeed from '../components/ActivityFeed';
import BenchmarksPanel from '../components/BenchmarksPanel';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await mockService.getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-neutral-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-6 text-center">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Failed to load dashboard</h3>
        <p className="text-neutral-600">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Security Debt Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome to {data.company.name} • {data.company.industry} • {data.company.employee_count} employees
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DebtScoreCard 
            score={data.debtScore}
            trend={data.debtScoreTrend}
            company={data.company}
          />
        </div>
        <div>
          <FinancialSummaryCard 
            totalSpend={data.totalSpend}
            estimatedWaste={data.estimatedWaste}
            projectedSavings={data.projectedSavings}
            company={data.company}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center p-4 rounded-lg">
            <BarChart3 className="w-5 h-5 mr-2 text-white" />
            Generate Executive Report
          </button>
          <button className="btn-secondary flex items-center justify-center p-4 rounded-lg">
            <Search className="w-5 h-5 mr-2 text-neutral-600" />
            Analyze Tool Overlap
          </button>
          <button className="btn-secondary flex items-center justify-center p-4 rounded-lg">
            <Zap className="w-5 h-5 mr-2 text-neutral-600" />
            Create Consolidation Plan
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Top Tools by Spend */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Tools by Annual Spend</h3>
            <InventoryTable 
              tools={data.tools.slice(0, 5)}
              compact={true}
            />
          </div>

          {/* Recent Recommendations */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Recommendations</h3>
            <div className="space-y-4">
              {data.recommendations.slice(0, 3).map((recommendation) => (
                <RecommendationCard 
                  key={recommendation.id}
                  recommendation={recommendation}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <ActivityFeed />

          {/* Benchmarks */}
          <BenchmarksPanel />
        </div>
      </div>
    </div>
  );
}
