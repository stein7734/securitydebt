import companyData from '../../mock-data/company.json';
import toolsEnterprise from '../../mock-data/tools_enterprise.json';
import toolsMidmarket from '../../mock-data/tools_midmarket.json';
import toolsStartup from '../../mock-data/tools_startup.json';
import ownersData from '../../mock-data/owners.json';
import recommendationsData from '../../mock-data/recommendations.json';

export type Persona = 'startup' | 'midmarket' | 'enterprise';

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  category: string;
  annual_cost_usd: number;
  license_type: string;
  agents_installed: number;
  utilisation_percent: number;
  overlap_tags: string[];
  controls_covered: string[];
  last_active_date: string;
  renew_date: string;
  contract_terms: string;
  demo_notes: string;
  risk_coverage: number;
  overlap_score: number;
  // Enhanced fields for onboarding (optional for backward compatibility)
  status?: 'active' | 'pending' | 'inactive' | 'onboarding';
  onboarding_status?: 'not_started' | 'basic_info' | 'documents' | 'integration' | 'testing' | 'approved' | 'rejected';
  documents?: ToolDocument[];
  integrations?: ToolIntegration[];
  owner_id?: string;
  created_date?: string;
  last_updated?: string;
}

export interface ToolDocument {
  id: string;
  name: string;
  type: 'contract' | 'sla' | 'sow' | 'license' | 'other';
  file_url: string;
  upload_date: string;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ToolIntegration {
  id: string;
  name: string;
  type: 'api' | 'log_source' | 'webhook' | 'database' | 'file_upload';
  endpoint: string;
  credentials: {
    type: 'api_key' | 'oauth' | 'basic_auth' | 'certificate';
    encrypted: boolean;
  };
  status: 'pending' | 'connected' | 'failed' | 'testing';
  last_test: string;
  test_result?: {
    success: boolean;
    message: string;
    response_time?: number;
  };
}

export interface Company {
  name: string;
  annual_revenue: number;
  security_budget_pct: number;
  number_of_cloud_accounts: number;
  employee_count: number;
  industry: string;
  compliance_requirements: string[];
  security_team_size: number;
  annual_security_spend: number;
  estimated_waste: number;
  debt_score: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  tools_owned: string[];
  budget_responsibility: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: string;
  confidence: number;
  estimated_savings: number;
  estimated_risk_delta: number;
  effort_estimate: string;
  tools_affected: string[];
  category: string;
  business_impact: string;
  technical_requirements: string[];
  timeline: string;
  dependencies: string[];
}

export interface InventoryFilters {
  category?: string;
  search?: string;
  minCost?: number;
  maxCost?: number;
}

export interface DashboardData {
  company: Company;
  tools: Tool[];
  owners: Owner[];
  recommendations: Recommendation[];
  totalSpend: number;
  estimatedWaste: number;
  projectedSavings: number;
  debtScore: number;
  debtScoreTrend: number[];
}

class MockService {
  private currentPersona: Persona = 'enterprise';

  setPersona(persona: Persona) {
    this.currentPersona = persona;
  }

  getPersona(): Persona {
    return this.currentPersona;
  }

  private getToolsForPersona(): Tool[] {
    let tools: any[];
    switch (this.currentPersona) {
      case 'startup':
        tools = toolsStartup;
        break;
      case 'midmarket':
        tools = toolsMidmarket;
        break;
      case 'enterprise':
        tools = toolsEnterprise;
        break;
      default:
        tools = toolsEnterprise;
    }

    // Add default values for new fields to maintain backward compatibility
    return tools.map(tool => ({
      ...tool,
      status: tool.status || 'active',
      onboarding_status: tool.onboarding_status || 'approved',
      documents: tool.documents || [],
      integrations: tool.integrations || [],
      owner_id: tool.owner_id || '',
      created_date: tool.created_date || new Date().toISOString(),
      last_updated: tool.last_updated || new Date().toISOString()
    }));
  }

  private getCompanyForPersona(): Company {
    return companyData[this.currentPersona];
  }

  async getDashboard(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const company = this.getCompanyForPersona();
    const tools = this.getToolsForPersona();
    const owners = ownersData;
    const recommendations = recommendationsData;

    const totalSpend = tools.reduce((sum, tool) => sum + tool.annual_cost_usd, 0);
    const estimatedWaste = company.estimated_waste;
    const projectedSavings = recommendations.reduce((sum, rec) => sum + rec.estimated_savings, 0);
    const debtScore = company.debt_score;

    // Generate mock trend data for debt score
    const debtScoreTrend = Array.from({ length: 12 }, () => {
      const base = debtScore;
      const variation = (Math.random() - 0.5) * 10;
      return Math.max(0, Math.min(100, base + variation));
    });

    return {
      company,
      tools,
      owners,
      recommendations,
      totalSpend,
      estimatedWaste,
      projectedSavings,
      debtScore,
      debtScoreTrend
    };
  }

  async getInventory(page: number = 1, pageSize: number = 10, filters: InventoryFilters = {}): Promise<{
    tools: Tool[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    let tools = this.getToolsForPersona();

    // Apply filters
    if (filters.category) {
      tools = tools.filter(tool => tool.category === filters.category);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.vendor.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.minCost !== undefined) {
      tools = tools.filter(tool => tool.annual_cost_usd >= filters.minCost!);
    }
    if (filters.maxCost !== undefined) {
      tools = tools.filter(tool => tool.annual_cost_usd <= filters.maxCost!);
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTools = tools.slice(startIndex, endIndex);

    return {
      tools: paginatedTools,
      total: tools.length,
      page,
      pageSize
    };
  }

  async getToolById(id: string): Promise<Tool | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const tools = this.getToolsForPersona();
    return tools.find(tool => tool.id === id) || null;
  }

  async getRecommendations(): Promise<Recommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return recommendationsData;
  }

  async createPlaybookFromRecommendation(recoId: string): Promise<{
    id: string;
    recommendationId: string;
    title: string;
    description: string;
    steps: Array<{
      id: string;
      title: string;
      description: string;
      owner: string;
      estimatedTime: string;
      status: string;
      dependencies: string[];
      deliverables: string[];
    }>;
    createdAt: string;
    status: string;
    estimatedDuration: string;
    totalSavings: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const recommendation = recommendationsData.find(rec => rec.id === recoId);
    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    // Generate mock playbook steps
    const steps = [
      {
        id: 'step-1',
        title: 'Assessment & Planning',
        description: 'Conduct comprehensive assessment of current tools and create migration plan',
        owner: 'Security Architect',
        estimatedTime: '2-3 weeks',
        status: 'pending',
        dependencies: [],
        deliverables: ['Assessment report', 'Migration plan', 'Risk analysis']
      },
      {
        id: 'step-2',
        title: 'Stakeholder Communication',
        description: 'Notify all stakeholders and obtain necessary approvals',
        owner: 'CISO',
        estimatedTime: '1 week',
        status: 'pending',
        dependencies: ['step-1'],
        deliverables: ['Communication plan', 'Approval documentation']
      },
      {
        id: 'step-3',
        title: 'Technical Implementation',
        description: 'Execute the technical migration and configuration changes',
        owner: 'Security Engineer',
        estimatedTime: '3-4 weeks',
        status: 'pending',
        dependencies: ['step-2'],
        deliverables: ['Migration scripts', 'Configuration updates', 'Test results']
      },
      {
        id: 'step-4',
        title: 'Testing & Validation',
        description: 'Comprehensive testing of new configuration and validation of security controls',
        owner: 'Security Operations',
        estimatedTime: '1-2 weeks',
        status: 'pending',
        dependencies: ['step-3'],
        deliverables: ['Test results', 'Validation report', 'Performance metrics']
      },
      {
        id: 'step-5',
        title: 'Decommission & Cleanup',
        description: 'Remove old tools and clean up associated resources',
        owner: 'Security Engineer',
        estimatedTime: '1 week',
        status: 'pending',
        dependencies: ['step-4'],
        deliverables: ['Decommission checklist', 'Resource cleanup', 'Documentation update']
      },
      {
        id: 'step-6',
        title: 'Monitoring & Optimization',
        description: 'Monitor new setup and optimize based on performance metrics',
        owner: 'Security Operations',
        estimatedTime: '2-3 weeks',
        status: 'pending',
        dependencies: ['step-5'],
        deliverables: ['Monitoring dashboard', 'Performance report', 'Optimization recommendations']
      }
    ];

    return {
      id: `playbook-${recoId}`,
      recommendationId: recoId,
      title: `Playbook: ${recommendation.title}`,
      description: recommendation.description,
      steps,
      createdAt: new Date().toISOString(),
      status: 'draft',
      estimatedDuration: recommendation.timeline,
      totalSavings: recommendation.estimated_savings
    };
  }

  async exportReport(type: 'pdf' | 'csv'): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (type === 'csv') {
      const tools = this.getToolsForPersona();
      const csvContent = [
        'Tool Name,Vendor,Category,Annual Cost,Utilization %,Risk Coverage,Overlap Score',
        ...tools.map(tool => 
          `"${tool.name}","${tool.vendor}","${tool.category}",${tool.annual_cost_usd},${tool.utilisation_percent},${tool.risk_coverage},${tool.overlap_score}`
        )
      ].join('\n');

      return new Blob([csvContent], { type: 'text/csv' });
    } else {
      // For PDF, we'll return a mock blob
      // In a real implementation, this would generate an actual PDF
      return new Blob(['Mock PDF content'], { type: 'application/pdf' });
    }
  }

  async getBenchmarks(): Promise<{
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
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const company = this.getCompanyForPersona();
    
    return {
      industry: company.industry,
      companySize: company.employee_count,
      securitySpend: company.annual_security_spend,
      spendPerEmployee: company.annual_security_spend / company.employee_count,
      benchmarks: {
        spendPerEmployee: {
          percentile25: 1200,
          percentile50: 1800,
          percentile75: 2500,
          percentile90: 3500,
          current: company.annual_security_spend / company.employee_count
        },
        toolsPerEmployee: {
          percentile25: 0.8,
          percentile50: 1.2,
          percentile75: 1.8,
          percentile90: 2.5,
          current: this.getToolsForPersona().length / company.employee_count
        },
        utilizationRate: {
          percentile25: 45,
          percentile50: 65,
          percentile75: 80,
          percentile90: 90,
          current: this.getToolsForPersona().reduce((sum, tool) => sum + tool.utilisation_percent, 0) / this.getToolsForPersona().length
        }
      }
    };
  }

  // Tool management methods
  async addTool(tool: Partial<Tool>): Promise<Tool> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTool: Tool = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: tool.name || '',
      vendor: tool.vendor || '',
      category: tool.category || '',
      annual_cost_usd: tool.annual_cost_usd || 0,
      license_type: tool.license_type || '',
      agents_installed: tool.agents_installed || 0,
      utilisation_percent: tool.utilisation_percent || 0,
      overlap_tags: tool.overlap_tags || [],
      controls_covered: tool.controls_covered || [],
      last_active_date: tool.last_active_date || new Date().toISOString().split('T')[0],
      renew_date: tool.renew_date || '',
      contract_terms: tool.contract_terms || '',
      demo_notes: tool.demo_notes || '',
      risk_coverage: tool.risk_coverage || 0,
      overlap_score: tool.overlap_score || 0,
      status: tool.status || 'active',
      onboarding_status: tool.onboarding_status || 'approved',
      documents: tool.documents || [],
      integrations: tool.integrations || [],
      owner_id: tool.owner_id || '',
      created_date: tool.created_date || new Date().toISOString(),
      last_updated: tool.last_updated || new Date().toISOString()
    };

    // In a real app, this would save to the backend
    console.log('Tool added:', newTool);
    return newTool;
  }

  async updateTool(id: string, updates: Partial<Tool>): Promise<Tool> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would update the backend
    console.log('Tool updated:', id, updates);
    
    // For demo purposes, return a mock updated tool
    const existingTool = this.getToolsForPersona().find(t => t.id === id);
    if (!existingTool) {
      throw new Error('Tool not found');
    }
    
    return { ...existingTool, ...updates, last_updated: new Date().toISOString() };
  }

  async deleteTool(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would delete from the backend
    console.log('Tool deleted:', id);
  }

  async testIntegration(_toolId: string, _integrationId: string): Promise<{ success: boolean; message: string; response_time?: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock integration test - 80% success rate
    const success = Math.random() > 0.2;
    return {
      success,
      message: success ? 'Connection successful' : 'Connection failed - check credentials',
      response_time: Math.floor(Math.random() * 200) + 50
    };
  }
}

export const mockService = new MockService();
