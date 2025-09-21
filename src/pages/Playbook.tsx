import { useParams } from 'react-router-dom';
import PlaybookStep from '../components/PlaybookStep';

export default function Playbook() {
  const { id } = useParams<{ id: string }>();

  // Mock playbook data - in a real app, this would be fetched based on the ID
  const mockPlaybook = {
    id: id || 'playbook-001',
    title: 'Consolidate CSPM Solutions',
    description: 'Consolidate Prisma Cloud and AWS Security Hub into a single CSPM solution',
    status: 'draft' as 'pending' | 'in-progress' | 'completed',
    steps: [
      {
        id: 'step-1',
        title: 'Assessment & Planning',
        description: 'Conduct comprehensive assessment of current tools and create migration plan',
        owner: 'Security Architect',
        estimatedTime: '2-3 weeks',
        status: 'completed' as 'pending' | 'in-progress' | 'completed',
        dependencies: [],
        deliverables: ['Assessment report', 'Migration plan', 'Risk analysis']
      },
      {
        id: 'step-2',
        title: 'Stakeholder Communication',
        description: 'Notify all stakeholders and obtain necessary approvals',
        owner: 'CISO',
        estimatedTime: '1 week',
        status: 'in-progress' as 'pending' | 'in-progress' | 'completed',
        dependencies: ['step-1'],
        deliverables: ['Communication plan', 'Approval documentation']
      },
      {
        id: 'step-3',
        title: 'Technical Implementation',
        description: 'Execute the technical migration and configuration changes',
        owner: 'Security Engineer',
        estimatedTime: '3-4 weeks',
        status: 'pending' as 'pending' | 'in-progress' | 'completed',
        dependencies: ['step-2'],
        deliverables: ['Migration scripts', 'Configuration updates', 'Test results']
      },
      {
        id: 'step-4',
        title: 'Testing & Validation',
        description: 'Comprehensive testing of new configuration and validation of security controls',
        owner: 'Security Operations',
        estimatedTime: '1-2 weeks',
        status: 'pending' as 'pending' | 'in-progress' | 'completed',
        dependencies: ['step-3'],
        deliverables: ['Test results', 'Validation report', 'Performance metrics']
      },
      {
        id: 'step-5',
        title: 'Decommission & Cleanup',
        description: 'Remove old tools and clean up associated resources',
        owner: 'Security Engineer',
        estimatedTime: '1 week',
        status: 'pending' as 'pending' | 'in-progress' | 'completed',
        dependencies: ['step-4'],
        deliverables: ['Decommission checklist', 'Resource cleanup', 'Documentation update']
      },
      {
        id: 'step-6',
        title: 'Monitoring & Optimization',
        description: 'Monitor new setup and optimize based on performance metrics',
        owner: 'Security Operations',
        estimatedTime: '2-3 weeks',
        status: 'pending' as 'pending' | 'in-progress' | 'completed',
        dependencies: ['step-5'],
        deliverables: ['Monitoring dashboard', 'Performance report', 'Optimization recommendations']
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{mockPlaybook.title}</h1>
        <p className="text-neutral-600 mt-1">{mockPlaybook.description}</p>
      </div>

      <div className="space-y-4">
        {mockPlaybook.steps.map((step, index) => (
          <PlaybookStep
            key={step.id}
            step={step}
            stepNumber={index + 1}
            totalSteps={mockPlaybook.steps.length}
          />
        ))}
      </div>
    </div>
  );
}
