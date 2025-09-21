import { 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Calendar
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Contract Renewal Due',
    description: 'Prisma Cloud contract expires in 30 days',
    timestamp: '2 hours ago',
    icon: Calendar,
    color: 'text-red-600'
  },
  {
    id: '2',
    type: 'success',
    title: 'Tool Optimization Complete',
    description: 'Successfully consolidated 3 SIEM tools',
    timestamp: '1 day ago',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: '3',
    type: 'info',
    title: 'New Recommendation Available',
    description: 'AI identified potential $150K savings opportunity',
    timestamp: '2 days ago',
    icon: TrendingUp,
    color: 'text-blue-600'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Low Utilization Alert',
    description: 'Microsoft Sentinel utilization below 40%',
    timestamp: '3 days ago',
    icon: AlertTriangle,
    color: 'text-yellow-600'
  },
  {
    id: '5',
    type: 'info',
    title: 'Budget Review Scheduled',
    description: 'Q1 security budget review meeting tomorrow',
    timestamp: '4 days ago',
    icon: DollarSign,
    color: 'text-blue-600'
  },
  {
    id: '6',
    type: 'success',
    title: 'Security Score Improved',
    description: 'Debt score decreased by 5 points this month',
    timestamp: '1 week ago',
    icon: Shield,
    color: 'text-green-600'
  }
];

export default function ActivityFeed() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center ${activity.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                <p className="text-sm text-neutral-600">{activity.description}</p>
                <p className="text-xs text-neutral-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
          Load More Activity
        </button>
      </div>
    </div>
  );
}