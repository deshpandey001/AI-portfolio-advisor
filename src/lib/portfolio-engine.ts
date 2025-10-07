import type { UserProfile, Allocation, PredictionResult, GrowthProjection, LifeEvents } from '../types';

export function predictPortfolio(profile: UserProfile): PredictionResult {
  const { age, income, savings, risk_score, life_events } = profile;

  // --- Step 0: Extract life events if provided ---
  const extracted_life_events = life_events ? extractLifeEvents(life_events) : undefined;

  // --- Step 1: Initial portfolio prediction ---
  let stocks = risk_score * 5 + (65 - age) / 2;
  let bonds = (100 - stocks) * (age / 65);
  let cash = 100 - stocks - bonds;

  // Prevent negative allocations
  if (stocks < 0) stocks = 0;
  if (bonds < 0) bonds = 0;
  if (cash < 0) cash = 0;

  // Normalize allocations to sum to 100%
  const total = stocks + bonds + cash;
  stocks = (stocks / total) * 100;
  bonds = (bonds / total) * 100;
  cash = (cash / total) * 100;

  const predicted_allocation: Allocation = {
    stocks: Math.round(stocks * 100) / 100,
    bonds: Math.round(bonds * 100) / 100,
    cash: Math.round(cash * 100) / 100,
  };

  // --- Step 2: Compliance adjustments ---
  let adjusted_allocation = { ...predicted_allocation };
  let compliance_explanation = '';

  if (risk_score < 5 && adjusted_allocation.stocks > 70) {
    const excess = adjusted_allocation.stocks - 70;
    adjusted_allocation = {
      stocks: 70,
      bonds: adjusted_allocation.bonds,
      cash: adjusted_allocation.cash + excess,
    };
    compliance_explanation = `Your stock allocation was adjusted from ${predicted_allocation.stocks.toFixed(
      2
    )}% to 70% due to regulatory guidelines for moderate risk investors. The excess was moved to cash for added security.`;
  }

  // --- Step 3: Generate human-like explanation ---
  const topFeatures = determineTopFeatures(profile, adjusted_allocation);
  const llm_explanation = generateExplanation(profile, adjusted_allocation, topFeatures, extracted_life_events);

  // --- Step 4: Insurance recommendations ---
  const insurance_recommendations = getInsuranceRecommendations(profile);

  // --- Step 5: Growth projections ---
  const growth_projections = calculateGrowthProjections(savings, adjusted_allocation);

  return {
    predicted_allocation,
    adjusted_allocation,
    llm_explanation,
    compliance_explanation,
    insurance_recommendations,
    growth_projections,
    extracted_life_events,
  };
}

// ---------------------- Life Events Extraction ----------------------
function extractLifeEvents(text: string): LifeEvents {
  const events: LifeEvents = {
    marriage_years: null,
    retirement_years: null,
    house_years: null,
    kids_years: null,
  };

  const lowerText = text.toLowerCase();

  const marriageMatch = lowerText.match(/marr(?:y|ied|iage).*?(\d+)\s*year/i) ||
                       lowerText.match(/(\d+)\s*year.*?marr(?:y|ied|iage)/i);
  if (marriageMatch) {
    events.marriage_years = parseInt(marriageMatch[1]);
  }

  const retirementMatch = lowerText.match(/retir(?:e|ement|ing).*?(\d+)\s*year/i) ||
                          lowerText.match(/(\d+)\s*year.*?retir(?:e|ement|ing)/i);
  if (retirementMatch) {
    events.retirement_years = parseInt(retirementMatch[1]);
  }

  const houseMatch = lowerText.match(/(?:buy|purchase|buying).*?house.*?(\d+)\s*year/i) ||
                     lowerText.match(/house.*?(\d+)\s*year/i) ||
                     lowerText.match(/(\d+)\s*year.*?house/i);
  if (houseMatch) {
    events.house_years = parseInt(houseMatch[1]);
  }

  const kidsMatch = lowerText.match(/(?:kid|child|children|baby).*?(\d+)\s*year/i) ||
                    lowerText.match(/(\d+)\s*year.*?(?:kid|child|children|baby)/i);
  if (kidsMatch) {
    events.kids_years = parseInt(kidsMatch[1]);
  }

  return events;
}

// ---------------------- Explanation ----------------------
function generateExplanation(
  profile: UserProfile,
  allocation: Allocation,
  topFeatures: string[],
  lifeEvents?: LifeEvents
): string {
  const { age, income, savings, risk_score } = profile;

  let explanation = `An investor with the following profile:\n`;
  explanation += `- Age: ${age}\n`;
  explanation += `- Income: $${income.toLocaleString()}\n`;
  explanation += `- Savings: $${savings.toLocaleString()}\n`;
  explanation += `- Risk Score: ${risk_score.toFixed(1)}\n\n`;

  explanation += `is recommended to allocate their portfolio as follows:\n`;
  explanation += `- Stocks: ${allocation.stocks.toFixed(1)}%\n`;
  explanation += `- Bonds: ${allocation.bonds.toFixed(1)}%\n`;
  explanation += `- Cash: ${allocation.cash.toFixed(1)}%\n\n`;

  if (topFeatures.length > 0) {
    explanation += `The most important factors influencing this recommendation are ${topFeatures.join(
      ', '
    )}.\n\n`;
  }

  explanation += `This allocation aims to balance growth and stability. `;
  if (risk_score >= 7) {
    explanation += `Your high risk tolerance allows for more aggressive growth through stocks. `;
  } else if (risk_score >= 4) {
    explanation += `Your moderate risk tolerance supports a balanced approach between growth and stability. `;
  } else {
    explanation += `Your conservative risk profile prioritizes safety, favoring bonds and cash for capital preservation. `;
  }

  if (age < 35) {
    explanation += `Being young, you have time to recover from market downturns, which supports long-term growth. `;
  } else if (age < 50) {
    explanation += `During your peak earning years, this allocation helps you grow wealth while managing risk as retirement approaches. `;
  } else {
    explanation += `At this stage, preserving accumulated wealth is important; hence a higher allocation to bonds and cash. `;
  }

  if (income > 150000) {
    explanation += `Your strong income gives you flexibility to handle market fluctuations effectively. `;
  } else if (income > 80000) {
    explanation += `Your solid income provides a foundation for long-term wealth accumulation. `;
  }

  if (savings > 0) {
    explanation += `Additionally, your savings of $${savings.toLocaleString()} serve as a financial cushion, enhancing portfolio stability.\n\n`;
  }

  if (lifeEvents) {
    const hasEvents = Object.values(lifeEvents).some(v => v !== null);
    if (hasEvents) {
      explanation += `\n📅 Life Events Considerations:\n`;

      if (lifeEvents.marriage_years) {
        explanation += `- Marriage in ${lifeEvents.marriage_years} year(s): Consider building an emergency fund and coordinating financial plans with your partner.\n`;
      }
      if (lifeEvents.house_years) {
        explanation += `- House purchase in ${lifeEvents.house_years} year(s): Maintain sufficient liquidity in cash/bonds for down payment and closing costs.\n`;
      }
      if (lifeEvents.kids_years) {
        explanation += `- Children in ${lifeEvents.kids_years} year(s): Start planning for education expenses and increase life insurance coverage.\n`;
      }
      if (lifeEvents.retirement_years) {
        explanation += `- Retirement in ${lifeEvents.retirement_years} year(s): ${
          lifeEvents.retirement_years < 10
            ? 'Focus on capital preservation and gradually shift to more conservative allocations.'
            : 'You have time to focus on growth while planning for future income needs.'
        }\n`;
      }
    }
  }

  return explanation;
}

// ---------------------- Determine Top Features ----------------------
function determineTopFeatures(profile: UserProfile, allocation: Allocation): string[] {
  const features: string[] = [];

  if (profile.risk_score >= 7) features.push('high risk tolerance');
  else if (profile.risk_score >= 4) features.push('moderate risk tolerance');
  else features.push('conservative risk tolerance');

  if (profile.age < 35) features.push('young age');
  else if (profile.age < 50) features.push('mid-age');
  else features.push('near-retirement age');

  if (profile.income > 150000) features.push('high income');
  else if (profile.income > 80000) features.push('moderate income');

  if (profile.savings > 0) features.push('savings');

  if (allocation.stocks > allocation.bonds && allocation.stocks > allocation.cash) features.push('equity-heavy allocation');
  if (allocation.bonds > allocation.stocks && allocation.bonds > allocation.cash) features.push('bond-heavy allocation');
  if (allocation.cash > allocation.stocks && allocation.cash > allocation.bonds) features.push('cash-heavy allocation');

  return features;
}

// ---------------------- Insurance Recommendations ----------------------
function getInsuranceRecommendations(profile: UserProfile): string[] {
  const recommendations: string[] = [];
  const { age, income } = profile;

  if (age > 50 && income > 150000) {
    recommendations.push('Life Insurance: Coverage of 10x annual income recommended');
    recommendations.push('Health/Critical Illness Cover: Consider comprehensive coverage');
    recommendations.push('Long-term Care Insurance: Plan for potential healthcare needs');
  } else if (age > 40) {
    recommendations.push('Life Insurance: 8-10x income coverage suggested');
    recommendations.push('Disability Insurance: Protect your earning capacity');
  } else if (age < 30 && income > 80000) {
    recommendations.push('Term Life Insurance: Build a foundation of protection');
    recommendations.push('Disability Insurance: Review coverage as your career grows');
  } else {
    recommendations.push('Term Life Insurance: Essential protection for dependents');
    recommendations.push('Health Insurance: Ensure adequate coverage');
  }

  return recommendations;
}

// ---------------------- Growth Projections ----------------------
function calculateGrowthProjections(
  initialAmount: number,
  allocation: Allocation
): GrowthProjection[] {
  const conservativeRate = 0.04;
  const expectedRate = 0.07;
  const optimisticRate = 0.10;

  const stockWeight = allocation.stocks / 100;
  const bondWeight = allocation.bonds / 100;
  const cashWeight = allocation.cash / 100;

  const conservativeReturn = conservativeRate * stockWeight + 0.03 * bondWeight + 0.02 * cashWeight;
  const expectedReturn = expectedRate * stockWeight + 0.045 * bondWeight + 0.02 * cashWeight;
  const optimisticReturn = optimisticRate * stockWeight + 0.06 * bondWeight + 0.025 * cashWeight;

  const projections: GrowthProjection[] = [];
  const years = [0, 5, 10, 15, 20, 25, 30];

  for (const year of years) {
    projections.push({
      year,
      conservative: Math.round(initialAmount * Math.pow(1 + conservativeReturn, year)),
      expected: Math.round(initialAmount * Math.pow(1 + expectedReturn, year)),
      optimistic: Math.round(initialAmount * Math.pow(1 + optimisticReturn, year)),
    });
  }

  return projections;
}
