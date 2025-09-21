import { CheckCircle, Clock, AlertCircle, User, Calendar, FileText } from 'lucide-react';

interface PlaybookStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    owner: string;
    estimatedTime: string;
    status: 'pending' | 'in-progress' | 'completed';
    dependencies: string[];
    deliverables: string[];
  };
  stepNumber: number;
  totalSteps: number;
}

export default function PlaybookStep({ step, stepNumber, totalSteps }: PlaybookStepProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-neutral-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getProgressPercentage = () => {
    switch (step.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50;
      case 'pending':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className={`card p-6 border-2 ${getStatusColor(step.status)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center">
              <span className="text-sm font-bold">{stepNumber}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
              {getStatusIcon(step.status)}
            </div>
            <p className="text-neutral-600 mb-4">{step.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Progress</span>
          <span className="text-sm text-neutral-500">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              step.status === 'completed' ? 'bg-green-500' :
              step.status === 'in-progress' ? 'bg-blue-500' : 'bg-neutral-300'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Step Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-600">Owner:</span>
          <span className="text-sm font-medium text-neutral-900">{step.owner}</span>
        </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">Est. Time:</span>
            <span className="text-sm font-medium text-neutral-900">{step.estimatedTime}</span>
          </div>
      </div>

      {/* Dependencies */}
      {step.dependencies.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Dependencies</h4>
          <div className="flex flex-wrap gap-2">
            {step.dependencies.map((dep, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                Step {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Deliverables</h4>
        <ul className="space-y-1">
          {step.deliverables.map((deliverable, index) => (
            <li key={index} className="flex items-center text-sm text-neutral-600">
              <FileText className="w-4 h-4 text-neutral-400 mr-2" />
              {deliverable}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-sm text-neutral-500">
          Step {stepNumber} of {totalSteps}
        </div>
        <div className="flex space-x-2">
          {step.status === 'pending' && (
            <button className="btn-secondary text-sm">
              Start Step
            </button>
          )}
          {step.status === 'in-progress' && (
            <button className="btn-primary text-sm">
              Mark Complete
            </button>
          )}
          {step.status === 'completed' && (
            <button className="btn-secondary text-sm">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
