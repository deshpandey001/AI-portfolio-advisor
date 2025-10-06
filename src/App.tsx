import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ProfileInput } from './components/ProfileInput';
import { AllocationChart } from './components/AllocationChart';
import { AIExplanation } from './components/AIExplanation';
import { InsuranceRecommendations } from './components/InsuranceRecommendations';
import { ComplianceNotice } from './components/ComplianceNotice';
import { GrowthProjectionChart } from './components/GrowthProjectionChart';
import { RiskReturnChart } from './components/RiskReturnChart';
import { predictPortfolio } from './lib/portfolio-engine';
import type { UserProfile, PredictionResult } from './types';

function App() {
  const [profile, setProfile] = useState<UserProfile>({
    age: 35,
    income: 120000,
    savings: 150000,
    risk_score: 7.0,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleAnalyze = () => {
    const prediction = predictPortfolio(profile);
    setResult(prediction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Portfolio Advisor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Smart investment recommendations powered by machine learning
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-8">
            <ProfileInput
              profile={profile}
              onChange={setProfile}
              onAnalyze={handleAnalyze}
            />
          </div>

          <div className="space-y-8">
            {result ? (
              <>
                <AllocationChart
                  allocation={result.adjusted_allocation}
                  title="Recommended Portfolio Allocation"
                />

                <RiskReturnChart allocation={result.adjusted_allocation} />

                <AIExplanation explanation={result.llm_explanation} />

                {result.compliance_explanation && (
                  <ComplianceNotice message={result.compliance_explanation} />
                )}

                <GrowthProjectionChart
                  projections={result.growth_projections}
                  initialAmount={profile.savings}
                />

                <InsuranceRecommendations
                  recommendations={result.insurance_recommendations}
                />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Ready to get started?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Enter your profile information and click "Analyze Portfolio" to receive
                    personalized investment recommendations tailored to your financial
                    situation and risk tolerance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
