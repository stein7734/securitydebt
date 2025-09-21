import OverlapForceGraph from '../components/OverlapForceGraph';

export default function Coverage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Coverage Map</h1>
        <p className="text-neutral-600 mt-1">
          Interactive visualization of tool overlap and security control coverage
        </p>
      </div>

      <div className="card p-6">
        <OverlapForceGraph />
      </div>
    </div>
  );
}
