import ExecutiveReportPreview from '../components/ExecutiveReportPreview';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Reports</h1>
        <p className="text-neutral-600 mt-1">
          Generate and download executive reports and analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Executive Summary</h3>
          <p className="text-neutral-600 mb-4">
            Board-ready PDF report with key metrics, recommendations, and financial impact.
          </p>
          <button className="btn-primary">
            Generate PDF Report
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tool Inventory</h3>
          <p className="text-neutral-600 mb-4">
            Detailed CSV export of all tools with utilization and cost data.
          </p>
          <button className="btn-secondary">
            Export CSV
          </button>
        </div>
      </div>

      <div className="card p-6">
        <ExecutiveReportPreview />
      </div>
    </div>
  );
}
