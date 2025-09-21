import { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  MoreHorizontal
} from 'lucide-react';
import type { Tool } from '../services/mockService';

interface InventoryTableProps {
  tools: Tool[];
  compact?: boolean;
  onToolClick?: (tool: Tool) => void;
}

type SortField = 'name' | 'vendor' | 'category' | 'annual_cost_usd' | 'utilisation_percent' | 'risk_coverage' | 'overlap_score';
type SortDirection = 'asc' | 'desc';

export default function InventoryTable({ 
  tools, 
  compact = false,
  onToolClick 
}: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('annual_cost_usd');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const categories = [...new Set(tools.map(tool => tool.category))];

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-neutral-700 hover:text-neutral-900"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        {sortedTools.map((tool) => (
          <div 
            key={tool.id}
            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
            onClick={() => onToolClick?.(tool)}
          >
            <div className="flex-1">
              <div className="font-medium text-neutral-900">{tool.name}</div>
              <div className="text-sm text-neutral-500">{tool.vendor} • {tool.category}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-neutral-900">{formatCurrency(tool.annual_cost_usd)}</div>
              <div className={`text-sm ${getUtilizationColor(tool.utilisation_percent)}`}>
                {tool.utilisation_percent}% utilized
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-3 px-4">
                <SortButton field="name">Tool Name</SortButton>
              </th>
              <th className="text-left py-3 px-4">
                <SortButton field="category">Category</SortButton>
              </th>
              <th className="text-right py-3 px-4">
                <SortButton field="annual_cost_usd">Annual Cost</SortButton>
              </th>
              <th className="text-right py-3 px-4">
                <SortButton field="utilisation_percent">Utilization</SortButton>
              </th>
              <th className="text-right py-3 px-4">
                <SortButton field="risk_coverage">Risk Coverage</SortButton>
              </th>
              <th className="text-right py-3 px-4">
                <SortButton field="overlap_score">Overlap</SortButton>
              </th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTools.map((tool) => (
              <tr 
                key={tool.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                onClick={() => onToolClick?.(tool)}
              >
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-neutral-900">{tool.name}</div>
                    <div className="text-sm text-neutral-500">{tool.vendor}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {tool.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(tool.annual_cost_usd)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${getUtilizationColor(tool.utilisation_percent)}`}>
                    {tool.utilisation_percent}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-medium text-neutral-900">
                    {tool.risk_coverage}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOverlapColor(tool.overlap_score)}`}>
                    {(tool.overlap_score * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="p-1 text-neutral-400 hover:text-neutral-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTools.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No tools found matching your criteria.
        </div>
      )}
    </div>
  );
}
