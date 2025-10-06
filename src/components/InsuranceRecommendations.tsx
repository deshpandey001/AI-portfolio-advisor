import { Shield, CheckCircle } from 'lucide-react';

interface InsuranceRecommendationsProps {
  recommendations: string[];
}

export function InsuranceRecommendations({ recommendations }: InsuranceRecommendationsProps) {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Insurance Recommendations</h3>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all"
            >
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No specific recommendations at this time</p>
      )}
    </div>
  );
}
