const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/components/ActivityFeed.tsx',
  'src/components/BenchmarksPanel.tsx',
  'src/components/ExecutiveReportPreview.tsx',
  'src/components/InventoryTable.tsx',
  'src/components/OverlapForceGraph.tsx',
  'src/components/PersonaSwitcher.tsx',
  'src/components/PlaybookStep.tsx',
  'src/components/RecommendationCard.tsx',
  'src/components/ToolDetailFlyout.tsx',
  'src/pages/Coverage.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Inventory.tsx',
  'src/pages/Playbook.tsx',
  'src/pages/Recommendations.tsx',
  'src/pages/Reports.tsx',
  'src/pages/Settings.tsx',
  'src/services/mockService.ts'
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove unused React imports
    content = content.replace(/import React from 'react';\n/g, '');
    content = content.replace(/import React, {/g, 'import {');
    
    // Fix type imports
    content = content.replace(/import { ([^}]+), ([A-Z][a-zA-Z]+) } from '([^']+)';/g, (match, p1, p2, p3) => {
      if (p2 === 'Company' || p2 === 'Tool' || p2 === 'Persona' || p2 === 'Recommendation' || p2 === 'DashboardData') {
        return `import { ${p1} } from '${p3}';\nimport type { ${p2} } from '${p3}';`;
      }
      return match;
    });
    
    // Remove unused imports
    const unusedImports = [
      'Clock', 'Users', 'Filter', 'Eye', 'Edit', 'Trash2', 'TrendingUp', 
      'AlertTriangle', 'CheckCircle', 'Calendar'
    ];
    
    unusedImports.forEach(importName => {
      const regex = new RegExp(`\\s*${importName},\\s*`, 'g');
      content = content.replace(regex, '');
      const regex2 = new RegExp(`\\s*${importName}\\s*`, 'g');
      content = content.replace(regex2, '');
    });
    
    // Fix specific issues
    if (filePath.includes('Playbook.tsx')) {
      content = content.replace(/status: '([^']+)'/g, "status: '$1' as 'pending' | 'in-progress' | 'completed'");
    }
    
    if (filePath.includes('mockService.ts')) {
      content = content.replace(/Array\.from\(\{ length: 12 \}, \(_, i\) => \{/g, 'Array.from({ length: 12 }, (_, _i) => {');
    }
    
    if (filePath.includes('ExecutiveReportPreview.tsx')) {
      content = content.replace(/\.map\(\(rec, index\) => \(/g, '.map((rec, _index) => (');
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${filePath}`);
  }
});

console.log('TypeScript fixes applied!');
