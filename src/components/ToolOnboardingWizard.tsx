import { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Upload, 
  Link, 
  TestTube,
  FileText,
  Shield,
  AlertCircle
} from 'lucide-react';
import type { Tool, ToolDocument, ToolIntegration } from '../services/mockService';

interface ToolOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (tool: Partial<Tool>) => void;
}

const steps = [
  { id: 'basic_info', title: 'Basic Information', icon: FileText },
  { id: 'documents', title: 'Documents & Contracts', icon: Upload },
  { id: 'integration', title: 'Integration Setup', icon: Link },
  { id: 'testing', title: 'Testing & Validation', icon: TestTube },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle }
];

export default function ToolOnboardingWizard({ isOpen, onClose, onComplete }: ToolOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Tool>>({
    name: '',
    vendor: '',
    category: '',
    annual_cost_usd: 0,
    license_type: '',
    agents_installed: 0,
    utilisation_percent: 0,
    overlap_tags: [],
    controls_covered: [],
    last_active_date: new Date().toISOString().split('T')[0],
    renew_date: '',
    contract_terms: '',
    demo_notes: '',
    risk_coverage: 0,
    overlap_score: 0,
    status: 'onboarding',
    onboarding_status: 'basic_info',
    documents: [],
    integrations: [],
    owner_id: '',
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString()
  });

  const [documents, setDocuments] = useState<ToolDocument[]>([]);
  const [integrations, setIntegrations] = useState<ToolIntegration[]>([]);
  const [testingResults, setTestingResults] = useState<Record<string, any>>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const completeTool = {
      ...formData,
      documents,
      integrations,
      onboarding_status: 'approved' as const,
      status: 'active' as const
    };
    onComplete(completeTool);
    onClose();
  };

  const handleFileUpload = (files: FileList, type: ToolDocument['type']) => {
    Array.from(files).forEach(file => {
      const newDoc: ToolDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        file_url: URL.createObjectURL(file),
        upload_date: new Date().toISOString(),
        size: file.size,
        status: 'pending'
      };
      setDocuments(prev => [...prev, newDoc]);
    });
  };

  const handleIntegrationAdd = (integration: Omit<ToolIntegration, 'id'>) => {
    const newIntegration: ToolIntegration = {
      ...integration,
      id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setIntegrations(prev => [...prev, newIntegration]);
  };

  const testIntegration = async (integrationId: string) => {
    // Mock integration test
    setTestingResults(prev => ({
      ...prev,
      [integrationId]: { success: true, message: 'Connection successful', response_time: 150 }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Add New Security Tool</h2>
              <p className="text-neutral-600 mt-1">Complete the onboarding process to add a new tool to your inventory</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-primary-500 border-primary-500 text-white' 
                          : 'bg-white border-neutral-300 text-neutral-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-neutral-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-neutral-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {currentStep === 0 && (
              <BasicInfoStep 
                formData={formData} 
                setFormData={setFormData} 
              />
            )}
            {currentStep === 1 && (
              <DocumentsStep 
                documents={documents}
                onFileUpload={handleFileUpload}
                onRemoveDocument={(id) => setDocuments(prev => prev.filter(doc => doc.id !== id))}
              />
            )}
            {currentStep === 2 && (
              <IntegrationStep 
                integrations={integrations}
                onAddIntegration={handleIntegrationAdd}
                onRemoveIntegration={(id) => setIntegrations(prev => prev.filter(int => int.id !== id))}
              />
            )}
            {currentStep === 3 && (
              <TestingStep 
                integrations={integrations}
                testingResults={testingResults}
                onTestIntegration={testIntegration}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep 
                formData={formData}
                documents={documents}
                integrations={integrations}
                testingResults={testingResults}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Onboarding
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function BasicInfoStep({ formData, setFormData }: { 
  formData: Partial<Tool>; 
  setFormData: (data: Partial<Tool>) => void; 
}) {
  const categories = ['CSPM', 'SIEM', 'EDR', 'IAM', 'SCA', 'WAF', 'DLP', 'Vulnerability Management'];
  const licenseTypes = ['Per User', 'Per Endpoint', 'Per GB', 'Unlimited', 'Tiered', 'Custom'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Tool Information</h3>
        <p className="text-neutral-600 mb-6">Provide the essential details about the security tool you're adding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tool Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., CrowdStrike Falcon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Vendor *
          </label>
          <input
            type="text"
            value={formData.vendor || ''}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., CrowdStrike"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            License Type *
          </label>
          <select
            value={formData.license_type || ''}
            onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select License Type</option>
            {licenseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Annual Cost (USD) *
          </label>
          <input
            type="number"
            value={formData.annual_cost_usd || ''}
            onChange={(e) => setFormData({ ...formData, annual_cost_usd: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Agents/Users Installed
          </label>
          <input
            type="number"
            value={formData.agents_installed || ''}
            onChange={(e) => setFormData({ ...formData, agents_installed: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Renewal Date
          </label>
          <input
            type="date"
            value={formData.renew_date || ''}
            onChange={(e) => setFormData({ ...formData, renew_date: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contract Terms
          </label>
          <input
            type="text"
            value={formData.contract_terms || ''}
            onChange={(e) => setFormData({ ...formData, contract_terms: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., 3-year enterprise license"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description & Notes
        </label>
        <textarea
          value={formData.demo_notes || ''}
          onChange={(e) => setFormData({ ...formData, demo_notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Additional notes about this tool..."
        />
      </div>
    </div>
  );
}

function DocumentsStep({ 
  documents, 
  onFileUpload, 
  onRemoveDocument 
}: { 
  documents: ToolDocument[]; 
  onFileUpload: (files: FileList, type: ToolDocument['type']) => void;
  onRemoveDocument: (id: string) => void;
}) {
  const documentTypes: { value: ToolDocument['type']; label: string; description: string }[] = [
    { value: 'contract', label: 'Contract', description: 'Main service agreement' },
    { value: 'sla', label: 'SLA', description: 'Service Level Agreement' },
    { value: 'sow', label: 'SOW', description: 'Statement of Work' },
    { value: 'license', label: 'License', description: 'Software license agreement' },
    { value: 'other', label: 'Other', description: 'Other relevant documents' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Documents & Contracts</h3>
        <p className="text-neutral-600 mb-6">Upload relevant documents for this security tool.</p>
      </div>

      {/* Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map(type => (
          <div key={type.value} className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h4 className="font-medium text-neutral-900 mb-1">{type.label}</h4>
            <p className="text-sm text-neutral-600 mb-3">{type.description}</p>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && onFileUpload(e.target.files, type.value)}
              className="hidden"
              id={`upload-${type.value}`}
              accept=".pdf,.doc,.docx,.txt"
            />
            <label
              htmlFor={`upload-${type.value}`}
              className="btn-secondary cursor-pointer"
            >
              Upload Files
            </label>
          </div>
        ))}
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Uploaded Documents</h4>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-neutral-400 mr-3" />
                  <div>
                    <div className="font-medium text-neutral-900">{doc.name}</div>
                    <div className="text-sm text-neutral-600">
                      {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveDocument(doc.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationStep({ 
  integrations, 
  onAddIntegration, 
  onRemoveIntegration 
}: { 
  integrations: ToolIntegration[]; 
  onAddIntegration: (integration: Omit<ToolIntegration, 'id'>) => void;
  onRemoveIntegration: (id: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIntegration, setNewIntegration] = useState<Omit<ToolIntegration, 'id'>>({
    name: '',
    type: 'api',
    endpoint: '',
    credentials: { type: 'api_key', encrypted: false },
    status: 'pending',
    last_test: ''
  });

  const integrationTypes = [
    { value: 'api', label: 'REST API', description: 'Connect via REST API endpoints' },
    { value: 'log_source', label: 'Log Source', description: 'Collect logs from the tool' },
    { value: 'webhook', label: 'Webhook', description: 'Receive real-time notifications' },
    { value: 'database', label: 'Database', description: 'Direct database connection' },
    { value: 'file_upload', label: 'File Upload', description: 'Upload data files' }
  ];

  const handleAddIntegration = () => {
    onAddIntegration(newIntegration);
    setNewIntegration({
      name: '',
      type: 'api',
      endpoint: '',
      credentials: { type: 'api_key', encrypted: false },
      status: 'pending',
      last_test: ''
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Integration Setup</h3>
        <p className="text-neutral-600 mb-6">Configure how this tool will integrate with your security infrastructure.</p>
      </div>

      {/* Existing Integrations */}
      {integrations.length > 0 && (
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Configured Integrations</h4>
          <div className="space-y-3">
            {integrations.map(integration => (
              <div key={integration.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link className="w-5 h-5 text-neutral-400 mr-3" />
                    <div>
                      <div className="font-medium text-neutral-900">{integration.name}</div>
                      <div className="text-sm text-neutral-600">
                        {integration.type} • {integration.endpoint}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      integration.status === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {integration.status}
                    </span>
                    <button
                      onClick={() => onRemoveIntegration(integration.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Integration Form */}
      {showAddForm ? (
        <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
          <h4 className="font-medium text-neutral-900 mb-4">Add New Integration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Integration Name
              </label>
              <input
                type="text"
                value={newIntegration.name}
                onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., API Connection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type
              </label>
              <select
                value={newIntegration.type}
                onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as ToolIntegration['type'] })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {integrationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Endpoint URL
              </label>
              <input
                type="url"
                value={newIntegration.endpoint}
                onChange={(e) => setNewIntegration({ ...newIntegration, endpoint: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://api.example.com/v1/endpoint"
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddIntegration}
              className="btn-primary"
            >
              Add Integration
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-secondary flex items-center"
        >
          <Link className="w-4 h-4 mr-2" />
          Add Integration
        </button>
      )}
    </div>
  );
}

function TestingStep({ 
  integrations, 
  testingResults, 
  onTestIntegration 
}: { 
  integrations: ToolIntegration[]; 
  testingResults: Record<string, any>;
  onTestIntegration: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Testing & Validation</h3>
        <p className="text-neutral-600 mb-6">Test your integrations to ensure they're working correctly.</p>
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-8">
          <TestTube className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No integrations configured yet. Go back to add some integrations first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {integrations.map(integration => (
            <div key={integration.id} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <TestTube className="w-5 h-5 text-neutral-400 mr-3" />
                  <div>
                    <div className="font-medium text-neutral-900">{integration.name}</div>
                    <div className="text-sm text-neutral-600">{integration.type} • {integration.endpoint}</div>
                  </div>
                </div>
                <button
                  onClick={() => onTestIntegration(integration.id)}
                  className="btn-primary flex items-center"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </button>
              </div>
              
              {testingResults[integration.id] && (
                <div className={`p-3 rounded-lg ${
                  testingResults[integration.id].success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {testingResults[integration.id].success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className={`font-medium ${
                      testingResults[integration.id].success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testingResults[integration.id].message}
                    </span>
                    {testingResults[integration.id].response_time && (
                      <span className="ml-auto text-sm text-neutral-600">
                        {testingResults[integration.id].response_time}ms
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewStep({ 
  formData, 
  documents, 
  integrations, 
  testingResults 
}: { 
  formData: Partial<Tool>; 
  documents: ToolDocument[]; 
  integrations: ToolIntegration[]; 
  testingResults: Record<string, any>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Review & Submit</h3>
        <p className="text-neutral-600 mb-6">Review all the information before completing the onboarding process.</p>
      </div>

      {/* Tool Information */}
      <div className="p-4 border border-neutral-200 rounded-lg">
        <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Tool Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-neutral-600">Name:</span> {formData.name}</div>
          <div><span className="text-neutral-600">Vendor:</span> {formData.vendor}</div>
          <div><span className="text-neutral-600">Category:</span> {formData.category}</div>
          <div><span className="text-neutral-600">Cost:</span> ${formData.annual_cost_usd?.toLocaleString()}</div>
          <div><span className="text-neutral-600">License:</span> {formData.license_type}</div>
          <div><span className="text-neutral-600">Agents:</span> {formData.agents_installed}</div>
        </div>
      </div>

      {/* Documents */}
      <div className="p-4 border border-neutral-200 rounded-lg">
        <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Documents ({documents.length})
        </h4>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="text-sm text-neutral-600">
                • {doc.name} ({doc.type})
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">No documents uploaded</p>
        )}
      </div>

      {/* Integrations */}
      <div className="p-4 border border-neutral-200 rounded-lg">
        <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Integrations ({integrations.length})
        </h4>
        {integrations.length > 0 ? (
          <div className="space-y-2">
            {integrations.map(integration => (
              <div key={integration.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">
                  {integration.name} ({integration.type})
                </span>
                {testingResults[integration.id] && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    testingResults[integration.id].success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {testingResults[integration.id].success ? 'Tested' : 'Failed'}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">No integrations configured</p>
        )}
      </div>
    </div>
  );
}
