# SecurityDebt.ai Mock POC

A polished, single-page web application prototype that visualizes a full end-to-end workflow for an AI-driven Security Debt (FinSecOps) product. This demo showcases enterprise-grade security tool management, optimization recommendations, and financial impact analysis.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📋 Features

### Core Functionality
- **Security Debt Score**: Composite KPI (0-100) with trend analysis and breakdown
- **Financial Summary**: Total spend, estimated waste, and projected savings
- **Tool Inventory**: Interactive table with sorting, filtering, and detailed flyouts
- **Coverage Map**: Visual graph showing tool overlap and security control coverage
- **AI Recommendations**: Prioritized consolidation plans with savings projections
- **Playbook Generator**: Step-by-step remediation workflows
- **Executive Reports**: Board-ready PDF exports with key metrics

### Demo Personas
Switch between three different company profiles:
- **Startup**: 45 employees, $5M revenue, basic security stack
- **Midmarket**: 180 employees, $25M revenue, moderate complexity
- **Enterprise**: 2,500 employees, $500M revenue, comprehensive security portfolio

### Data & Mock Services
- 75+ realistic security tools across CSPM, SIEM, EDR, IAM, and SCA categories
- Comprehensive financial and utilization data
- AI-powered recommendations with confidence scores
- Interactive charts and visualizations

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom enterprise design system
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── DebtScoreCard.tsx
│   ├── FinancialSummaryCard.tsx
│   ├── InventoryTable.tsx
│   ├── OverlapForceGraph.tsx
│   ├── RecommendationCard.tsx
│   ├── PlaybookStep.tsx
│   └── ...
├── pages/              # Route components
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Coverage.tsx
│   ├── Recommendations.tsx
│   ├── Playbook.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── services/           # Mock API layer
│   └── mockService.ts
└── mock-data/         # Seeded datasets
    ├── company.json
    ├── tools_enterprise.json
    ├── tools_midmarket.json
    ├── tools_startup.json
    ├── owners.json
    └── recommendations.json
```

## 🎯 Demo Walkthrough

### 1. Dashboard Overview
- View the Security Debt Score and financial summary
- Explore recent activity and industry benchmarks
- Access quick actions for common tasks

### 2. Tool Inventory
- Browse the complete security tool portfolio
- Filter by category, cost, and utilization
- Click any tool for detailed information

### 3. Coverage Analysis
- Visualize tool overlap and coverage gaps
- Identify redundant capabilities
- Understand security control coverage

### 4. AI Recommendations
- Review prioritized consolidation plans
- See projected savings and risk impact
- Create implementation playbooks

### 5. Playbook Management
- Follow step-by-step remediation workflows
- Track progress and dependencies
- Assign owners and timelines

### 6. Executive Reporting
- Generate board-ready PDF reports
- Export data for further analysis
- View comprehensive financial impact

## 🔧 Configuration

### Switching Demo Personas
Use the persona switcher in the top navigation to change between:
- **Startup**: Minimal security stack, basic compliance
- **Midmarket**: Moderate complexity, multiple compliance requirements
- **Enterprise**: Full security portfolio, comprehensive compliance

### Customizing Data
Edit the JSON files in `mock-data/` to modify:
- Company profiles and financial data
- Tool inventory and utilization metrics
- Recommendations and playbook templates
- Owner assignments and contact information

## 📊 Key Metrics

The application tracks and visualizes:
- **Security Debt Score**: Composite risk and efficiency metric
- **Annual Security Spend**: Total investment in security tools
- **Estimated Waste**: Identified inefficiencies and redundancies
- **Projected Savings**: Potential cost reductions from optimization
- **Tool Utilization**: Usage rates across the security stack
- **Overlap Analysis**: Redundancy and coverage gaps

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and navigation
- **Secondary**: Green for success states and positive metrics
- **Accent**: Orange for warnings and attention items
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Responsive sizing with consistent hierarchy
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners (2xl), soft shadows
- **Buttons**: Consistent sizing and hover states
- **Forms**: Accessible inputs with proper focus states
- **Tables**: Sortable columns with clear data hierarchy

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

## 📝 Development Notes

### Mock Data
All data is client-side and seeded from JSON files. In a production environment, this would be replaced with:
- REST API endpoints
- Real-time data synchronization
- User authentication and authorization
- Database persistence

### Performance
The application is optimized for:
- Fast initial load times
- Smooth interactions and transitions
- Responsive design across devices
- Accessible keyboard navigation

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

This is a demo application, but if you'd like to extend it:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for demonstration purposes only. All rights reserved.

---

**SecurityDebt.ai Mock POC** - Built with ❤️ for the FinSecOps community