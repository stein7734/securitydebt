import { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockService } from '../services/mockService';
import type { DashboardData } from '../services/mockService';

export default function ExecutiveReportPreview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await mockService.getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleExportPDF = async () => {
    try {
      const blob = await mockService.exportReport('pdf');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'security-debt-executive-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-neutral-200 rounded"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Failed to load report data
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Executive Report Preview</h3>
        <button 
          onClick={handleExportPDF}
          className="btn-primary flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>

      {/* Report Content */}
      <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center border-b border-neutral-200 pb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Security Debt Analysis Report
          </h1>
          <p className="text-neutral-600">
            {data.company.name} • {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Executive Summary */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Executive Summary
          </h2>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-neutral-700 leading-relaxed">
              Our security tool portfolio analysis reveals significant opportunities for optimization. 
              With a current Security Debt Score of <strong>{data.debtScore}</strong>, we have identified 
              potential savings of <strong>{formatCurrency(data.projectedSavings)}</strong> through 
              strategic tool consolidation and optimization. The analysis covers {data.tools.length} tools 
              across multiple security domains, with an estimated waste of {formatCurrency(data.estimatedWaste)} 
              annually due to tool overlap and underutilization.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">{data.debtScore}</div>
              <div className="text-sm text-red-600 font-medium">Security Debt Score</div>
              <div className="text-xs text-neutral-500 mt-1">0-100 scale</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {formatCurrency(data.estimatedWaste)}
              </div>
              <div className="text-sm text-yellow-600 font-medium">Annual Waste</div>
              <div className="text-xs text-neutral-500 mt-1">Estimated</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(data.projectedSavings)}
              </div>
              <div className="text-sm text-green-600 font-medium">Potential Savings</div>
              <div className="text-xs text-neutral-500 mt-1">If optimized</div>
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Top Recommendations
            </h2>
          <div className="space-y-3">
            {data.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{rec.title}</div>
                  <div className="text-sm text-neutral-600">{rec.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(rec.estimated_savings)}
                  </div>
                  <div className="text-xs text-neutral-500">Annual Savings</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Risk Assessment
            </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>High Priority:</strong> {data.tools.filter(t => t.overlap_score > 0.7).length} tools 
              show high overlap (&gt;70%), indicating potential redundancy and waste. Immediate action 
              recommended to consolidate overlapping capabilities and reduce operational complexity.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recommended Next Steps</h2>
          <ol className="space-y-2 text-neutral-700">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-sm font-medium flex items-center justify-center mr-3 mt-0.5">1</span>
              Review and approve top 3 consolidation recommendations
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-sm font-medium flex items-center justify-center mr-3 mt-0.5">2</span>
              Create detailed implementation playbooks for approved recommendations
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-sm font-medium flex items-center justify-center mr-3 mt-0.5">3</span>
              Establish monthly review cadence to track optimization progress
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-sm font-medium flex items-center justify-center mr-3 mt-0.5">4</span>
              Implement tool utilization monitoring and alerting
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-500 pt-6 border-t border-neutral-200">
          <p>This report was generated by SecurityDebt.ai on {new Date().toLocaleDateString()}</p>
          <p className="mt-1">For questions or additional analysis, contact your security team</p>
        </div>
      </div>
    </div>
  );
}
