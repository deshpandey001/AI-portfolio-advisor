export interface UserProfile {
  age: number;
  income: number;
  savings: number;
  risk_score: number;
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
}
