import PersonaSwitcher from '../components/PersonaSwitcher';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-1">
          Configure demo settings and data sources
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Demo Persona</h3>
          <p className="text-neutral-600 mb-4">
            Switch between different company sizes and configurations to see how the tool adapts.
          </p>
          <PersonaSwitcher />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Export</h3>
          <p className="text-neutral-600 mb-4">
            Export current dataset for analysis or backup purposes.
          </p>
          <button className="btn-secondary">
            Export Demo Data
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Reset Demo</h3>
          <p className="text-neutral-600 mb-4">
            Reset all demo data to default state and clear any customizations.
          </p>
          <button className="btn-secondary">
            Reset Demo
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">About</h3>
          <p className="text-neutral-600 mb-4">
            SecurityDebt.ai Mock POC - Demo Version
          </p>
          <div className="text-sm text-neutral-500">
            Version 1.0.0 • Built with React & Tailwind CSS
          </div>
        </div>
      </div>
    </div>
  );
}
