import { X, DollarSign, Users, Shield, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import type { Tool } from '../services/mockService';

interface ToolDetailFlyoutProps {
  tool: Tool;
  onClose: () => void;
}

export default function ToolDetailFlyout({ tool, onClose }: ToolDetailFlyoutProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const getOverlapColor = (score: number) => {
    if (score >= 0.7) return 'text-red-600 bg-red-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getUtilizationColor = (percent: number) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (percent: number) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{tool.name}</h2>
              <p className="text-neutral-600">{tool.vendor} • {tool.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-neutral-400 mr-2" />
                    <span className="text-sm font-medium text-neutral-700">Annual Cost</span>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(tool.annual_cost_usd)}
                  </div>
                </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-neutral-400 mr-2" />
                      <span className="text-sm font-medium text-neutral-700">Agents Deployed</span>
                    </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {tool.agents_installed.toLocaleString()}
                  </div>
                </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-neutral-400 mr-2" />
                      <span className="text-sm font-medium text-neutral-700">Utilization</span>
                    </div>
                  <div className={`text-2xl font-bold ${getUtilizationColor(tool.utilisation_percent)}`}>
                    {tool.utilisation_percent}%
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-neutral-400 mr-2" />
                    <span className="text-sm font-medium text-neutral-700">Risk Coverage</span>
                  </div>
                  <div className={`text-2xl font-bold ${getRiskColor(tool.risk_coverage)}`}>
                    {tool.risk_coverage}%
                  </div>
                </div>
              </div>

              {/* Overlap Score */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Overlap Analysis</h3>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">Overlap Score</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getOverlapColor(tool.overlap_score)}`}>
                      {(tool.overlap_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        tool.overlap_score >= 0.7 ? 'bg-red-500' : 
                        tool.overlap_score >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${tool.overlap_score * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">
                    {tool.overlap_score >= 0.7 ? 'High overlap with other tools' : 
                     tool.overlap_score >= 0.4 ? 'Moderate overlap detected' : 
                     'Low overlap, good tool isolation'}
                  </p>
                </div>
              </div>

              {/* Overlap Tags */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Overlap Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.overlap_tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Controls Covered */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Security Controls Covered</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tool.controls_covered.map((control, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">{control}</span>
                      </div>
                  ))}
                </div>
              </div>

              {/* Contract Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Contract Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">License Type</span>
                    <span className="text-sm text-neutral-900">{tool.license_type}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">Contract Terms</span>
                    <span className="text-sm text-neutral-900">{tool.contract_terms}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">Last Active</span>
                    <span className="text-sm text-neutral-900">
                      {new Date(tool.last_active_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">Renewal Date</span>
                    <span className="text-sm text-neutral-900">
                      {new Date(tool.renew_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Notes */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Notes</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{tool.demo_notes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="text-sm text-neutral-500">
              Last updated: {new Date(tool.last_active_date).toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary">
                <FileText className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button className="btn-primary">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Create Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
