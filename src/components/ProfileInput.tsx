import { DollarSign, Calendar, PiggyBank, TrendingUp } from 'lucide-react';
import type { UserProfile } from '../types';

interface ProfileInputProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onAnalyze: () => void;
}

export function ProfileInput({ profile, onChange, onAnalyze }: ProfileInputProps) {
  const handleChange = (field: keyof UserProfile, value: number) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Profile</h2>
        <p className="text-gray-600">Help us understand your financial situation</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            Age
          </label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => handleChange('age', Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            min="18"
            max="100"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Annual Income
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={profile.income}
              onChange={(e) => handleChange('income', Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              min="0"
              step="1000"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <PiggyBank className="w-5 h-5 text-blue-600" />
            Total Savings
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={profile.savings}
              onChange={(e) => handleChange('savings', Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              min="0"
              step="1000"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Risk Tolerance: {profile.risk_score.toFixed(1)}
          </label>
          <div className="relative pt-2 pb-4">
            <input
              type="range"
              value={profile.risk_score}
              onChange={(e) => handleChange('risk_score', Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(profile.risk_score / 10) * 100}%, #e5e7eb ${(profile.risk_score / 10) * 100}%, #e5e7eb 100%)`
              }}
              min="1"
              max="10"
              step="0.1"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
      >
        Analyze Portfolio
      </button>
    </div>
  );
}
