import { 
  Clock, 
  ArrowRight,
  DollarSign,
  Shield,
  Users
} from 'lucide-react';
import type { Recommendation } from '../services/mockService';

interface RecommendationCardProps {
  recommendation: Recommendation;
  compact?: boolean;
  onCreatePlaybook?: (recommendationId: string) => void;
}

export default function RecommendationCard({ 
  recommendation, 
  compact = false,
  onCreatePlaybook 
}: RecommendationCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  if (compact) {
    return (
      <div className="p-4 bg-white border border-neutral-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-neutral-900 text-sm">{recommendation.title}</h4>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
            {recommendation.priority}
          </span>
        </div>
        <p className="text-sm text-neutral-600 mb-3">{recommendation.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-green-600">
              <DollarSign className="w-4 h-4 mr-1" />
              {formatCurrency(recommendation.estimated_savings)}
            </div>
              <div className="flex items-center text-neutral-500">
                <Clock className="w-4 h-4 mr-1" />
                {recommendation.timeline}
              </div>
          </div>
          <button 
            onClick={() => onCreatePlaybook?.(recommendation.id)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Create Playbook →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-neutral-900">{recommendation.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
              {recommendation.priority}
            </span>
          </div>
          <p className="text-neutral-600 mb-4">{recommendation.description}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-5 h-5 text-green-600 mr-1" />
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(recommendation.estimated_savings)}
            </span>
          </div>
          <div className="text-xs text-green-600">Annual Savings</div>
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Shield className="w-5 h-5 text-blue-600 mr-1" />
            <span className="text-lg font-semibold text-blue-600">
              {(recommendation.estimated_risk_delta * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-blue-600">Risk Impact</div>
        </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-5 h-5 text-yellow-600 mr-1" />
              <span className="text-lg font-semibold text-yellow-600">
                {recommendation.timeline}
              </span>
            </div>
            <div className="text-xs text-yellow-600">Timeline</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-purple-600 mr-1" />
              <span className="text-lg font-semibold text-purple-600">
                {recommendation.tools_affected.length}
              </span>
            </div>
            <div className="text-xs text-purple-600">Tools Affected</div>
          </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Business Impact</h4>
          <p className="text-sm text-neutral-600">{recommendation.business_impact}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Confidence</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-neutral-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-primary-500 h-2 rounded-full" 
                  style={{ width: `${recommendation.confidence * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                {(recommendation.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Effort Required</h4>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getEffortColor(recommendation.effort_estimate)}`}>
              {recommendation.effort_estimate}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Technical Requirements</h4>
        <div className="flex flex-wrap gap-2">
          {recommendation.technical_requirements.map((req, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Dependencies */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Dependencies</h4>
        <ul className="space-y-1">
          {recommendation.dependencies.map((dep, index) => (
            <li key={index} className="flex items-center text-sm text-neutral-600">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mr-2"></div>
              {dep}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-sm text-neutral-500">
          Affects {recommendation.tools_affected.length} tools
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary text-sm">
            View Details
          </button>
          <button 
            onClick={() => onCreatePlaybook?.(recommendation.id)}
            className="btn-primary text-sm flex items-center"
          >
            Create Playbook
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
