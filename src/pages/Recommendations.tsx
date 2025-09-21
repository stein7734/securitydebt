import { useState, useEffect } from 'react';
import { mockService } from '../services/mockService';
import type { Recommendation } from '../services/mockService';
import RecommendationCard from '../components/RecommendationCard';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await mockService.getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleCreatePlaybook = async (recommendationId: string) => {
    try {
      const playbook = await mockService.createPlaybookFromRecommendation(recommendationId);
      console.log('Created playbook:', playbook);
      // In a real app, you'd navigate to the playbook page
    } catch (error) {
      console.error('Failed to create playbook:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">AI Recommendations</h1>
        <p className="text-neutral-600 mt-1">
          AI-powered consolidation and optimization recommendations
        </p>
      </div>

      <div className="space-y-6">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onCreatePlaybook={handleCreatePlaybook}
          />
        ))}
      </div>
    </div>
  );
}
