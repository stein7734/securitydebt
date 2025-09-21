import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { mockService } from '../services/mockService';
import type { Tool } from '../services/mockService';
import InventoryTable from '../components/InventoryTable';
import ToolDetailFlyout from '../components/ToolDetailFlyout';
import ToolOnboardingWizard from '../components/ToolOnboardingWizard';

export default function Inventory() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minCost: 0,
    maxCost: 10000000
  });

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        const result = await mockService.getInventory(1, 50, filters);
        setTools(result.tools);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [filters]);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseFlyout = () => {
    setSelectedTool(null);
  };

  const handleToolOnboarded = (newTool: Partial<Tool>) => {
    // In a real app, this would save to the backend
    console.log('New tool onboarded:', newTool);
    // For demo purposes, we'll just close the wizard
    setShowOnboardingWizard(false);
    // In production, you'd reload the inventory or add the tool to the current list
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tool Inventory</h1>
          <p className="text-neutral-600 mt-1">
            Manage and analyze your security tool portfolio
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowOnboardingWizard(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Tool
          </button>
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-sm text-neutral-600">Total Tools</div>
          <div className="text-2xl font-bold text-neutral-900">{tools.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-600">Total Spend</div>
          <div className="text-2xl font-bold text-neutral-900">
            ${(tools.reduce((sum, tool) => sum + tool.annual_cost_usd, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-600">Avg Utilization</div>
          <div className="text-2xl font-bold text-neutral-900">
            {Math.round(tools.reduce((sum, tool) => sum + tool.utilisation_percent, 0) / tools.length)}%
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-600">High Overlap</div>
          <div className="text-2xl font-bold text-red-600">
            {tools.filter(tool => tool.overlap_score > 0.7).length}
          </div>
        </div>
      </div>

        {/* Filters */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
              <option value="">All Categories</option>
              <option value="CSPM">CSPM</option>
              <option value="SIEM">SIEM</option>
              <option value="EDR">EDR</option>
              <option value="IAM">IAM</option>
              <option value="SCA">SCA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Min Cost
            </label>
              <input
                type="number"
                value={filters.minCost}
                onChange={(e) => setFilters({ ...filters, minCost: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Max Cost
            </label>
              <input
                type="number"
                value={filters.maxCost}
                onChange={(e) => setFilters({ ...filters, maxCost: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ category: '', search: '', minCost: 0, maxCost: 10000000 })}
              className="w-full btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card p-6">
        <InventoryTable 
          tools={tools}
          onToolClick={handleToolClick}
        />
      </div>

      {/* Tool Detail Flyout */}
      {selectedTool && (
        <ToolDetailFlyout 
          tool={selectedTool}
          onClose={handleCloseFlyout}
        />
      )}

      {/* Tool Onboarding Wizard */}
      <ToolOnboardingWizard
        isOpen={showOnboardingWizard}
        onClose={() => setShowOnboardingWizard(false)}
        onComplete={handleToolOnboarded}
      />
    </div>
  );
}
