import { useState, useEffect } from 'react';
import { mockService } from '../services/mockService';
import type { Tool } from '../services/mockService';

export default function OverlapForceGraph() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const result = await mockService.getInventory(1, 50);
        setTools(result.tools);
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading coverage map...</div>
      </div>
    );
  }

  // Group tools by category for visualization
  const categories = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const getCategoryColor = (category: string) => {
    const colors = {
      'CSPM': 'bg-blue-500',
      'SIEM': 'bg-green-500',
      'EDR': 'bg-purple-500',
      'IAM': 'bg-yellow-500',
      'SCA': 'bg-red-500',
    };
    return colors[category as keyof typeof colors] || 'bg-neutral-500';
  };

  const getOverlapColor = (score: number) => {
    if (score >= 0.7) return 'border-red-500 bg-red-50';
    if (score >= 0.4) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Tool Overlap & Coverage Map</h3>
        <div className="text-sm text-neutral-500">
          {tools.length} tools across {Object.keys(categories).length} categories
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.keys(categories).map(category => (
          <div key={category} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
            <span className="text-sm text-neutral-600">{category}</span>
          </div>
        ))}
      </div>

      {/* Force Graph Visualization */}
      <div className="h-96 border border-neutral-200 rounded-lg bg-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
            {Object.entries(categories).map(([category, categoryTools]) => (
              <div key={category} className="space-y-2">
                <div className={`p-2 rounded-lg text-white text-sm font-medium text-center ${getCategoryColor(category)}`}>
                  {category}
                </div>
                <div className="space-y-1">
                  {categoryTools.map(tool => (
                    <div
                      key={tool.id}
                      className={`p-2 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${getOverlapColor(tool.overlap_score)}`}
                      onClick={() => setSelectedTool(tool)}
                    >
                      <div className="text-xs font-medium text-neutral-900 truncate">
                        {tool.name}
                      </div>
                      <div className="text-xs text-neutral-600">
                        ${(tool.annual_cost_usd / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-neutral-500">
                        {(tool.overlap_score * 100).toFixed(0)}% overlap
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedTool(null)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">{selectedTool.name}</h4>
              <p className="text-neutral-600 mb-4">{selectedTool.vendor} • {selectedTool.category}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Annual Cost:</span>
                  <span className="text-sm font-medium">${(selectedTool.annual_cost_usd / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Utilization:</span>
                  <span className="text-sm font-medium">{selectedTool.utilisation_percent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Risk Coverage:</span>
                  <span className="text-sm font-medium">{selectedTool.risk_coverage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Overlap Score:</span>
                  <span className="text-sm font-medium">{(selectedTool.overlap_score * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200">
                <button 
                  onClick={() => setSelectedTool(null)}
                  className="w-full btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-neutral-500 text-center">
        Click on any tool to view detailed information. Tools are grouped by category and sized by cost.
      </div>
    </div>
  );
}
