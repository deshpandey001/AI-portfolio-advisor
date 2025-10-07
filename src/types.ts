export interface UserProfile {
  age: number;
  income: number;
  savings: number;
  risk_score: number;
  life_events?: string;
}

export interface LifeEvents {
  marriage_years?: number | null;
  retirement_years?: number | null;
  house_years?: number | null;
  kids_years?: number | null;
}

export interface Allocation {
  stocks: number;
  bonds: number;
  cash: number;
}

export interface GrowthProjection {
  year: number;
  conservative: number;
  expected: number;
  optimistic: number;
}

export interface PredictionResult {
  predicted_allocation: Allocation;
  adjusted_allocation: Allocation;
  llm_explanation: string;
  compliance_explanation: string;
  insurance_recommendations: string[];
  growth_projections: GrowthProjection[];
  extracted_life_events?: LifeEvents;
}
