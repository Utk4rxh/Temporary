// src/utils/aiRulesEngine.ts
import type { AIScoreBreakdown, FeatureWeight, BudgetScenarioConfig, BudgetScenarioResult } from '../types';

export const calculateCandidateScore = (input: {
  gpa: number;
  income: number;
  familySize: number;
  firstGen: boolean;
  underrepresented: boolean;
  communityHours: number;
  essayScore: number;
}): AIScoreBreakdown => {
  // 1. Academic Score (30% weight) - Max GPA 4.0
  const academicScore = Math.min(100, (input.gpa / 4.0) * 100);

  // 2. Financial Need Score (35% weight) - Higher need for lower per-capita household income
  const perCapitaIncome = input.income / Math.max(1, input.familySize);
  let financialNeedScore = 100;
  if (perCapitaIncome > 50000) {
    financialNeedScore = Math.max(20, 100 - (perCapitaIncome - 50000) / 1000);
  } else if (perCapitaIncome > 20000) {
    financialNeedScore = 100 - (perCapitaIncome - 20000) / 750;
  }

  // 3. Equity & Diversity Score (20% weight)
  let equityDiversityScore = 50;
  if (input.firstGen) equityDiversityScore += 25;
  if (input.underrepresented) equityDiversityScore += 25;
  equityDiversityScore = Math.min(100, equityDiversityScore);

  // 4. Extracurricular & Essay Score (15% weight)
  const hoursBonus = Math.min(30, (input.communityHours / 150) * 30);
  const extracurricularScore = Math.min(100, input.essayScore * 0.7 + hoursBonus);

  // Composite Weighted Score
  const overallScore = Number(
    (
      academicScore * 0.3 +
      financialNeedScore * 0.35 +
      equityDiversityScore * 0.2 +
      extracurricularScore * 0.15
    ).toFixed(1)
  );

  let recommendation: 'strong_award' | 'moderate_award' | 'borderline_review' | 'do_not_award' = 'do_not_award';
  let recommendedGrantAmount = 0;

  if (overallScore >= 85) {
    recommendation = 'strong_award';
    recommendedGrantAmount = 100000;
  } else if (overallScore >= 75) {
    recommendation = 'moderate_award';
    recommendedGrantAmount = 75000;
  } else if (overallScore >= 65) {
    recommendation = 'borderline_review';
    recommendedGrantAmount = 45000;
  }

  const featureWeights: FeatureWeight[] = [
    {
      featureName: `GPA (${input.gpa.toFixed(2)})`,
      category: 'academic',
      value: input.gpa.toFixed(2),
      shapValue: Number(((academicScore - 50) * 0.3).toFixed(1)),
      impactDescription: input.gpa >= 3.8 ? 'Significant academic merit boost' : 'Moderate academic contribution',
    },
    {
      featureName: `Household Income ($${input.income.toLocaleString()})`,
      category: 'financial',
      value: `$${input.income.toLocaleString()}`,
      shapValue: Number(((financialNeedScore - 50) * 0.35).toFixed(1)),
      impactDescription: input.income <= 40000 ? 'High financial need priority' : 'Moderate income baseline',
    },
    {
      featureName: `First-Gen College Student`,
      category: 'equity',
      value: input.firstGen ? 'Yes' : 'No',
      shapValue: input.firstGen ? +15.0 : -3.0,
      impactDescription: input.firstGen ? 'Diversity & equity initiative boost' : 'Standard educational background',
    },
    {
      featureName: `Community Service (${input.communityHours} Hours)`,
      category: 'extracurricular',
      value: `${input.communityHours} hrs`,
      shapValue: Number(((hoursBonus - 15) * 0.5).toFixed(1)),
      impactDescription: input.communityHours >= 100 ? 'Strong civic leadership metric' : 'Standard community involvement',
    },
  ];

  return {
    overallScore,
    academicScore: Math.round(academicScore),
    financialNeedScore: Math.round(financialNeedScore),
    equityDiversityScore: Math.round(equityDiversityScore),
    extracurricularScore: Math.round(extracurricularScore),
    confidenceScore: 0.94,
    recommendation,
    recommendedGrantAmount,
    featureWeights,
    generatedExplanation: `The candidate achieved an overall AI score of ${overallScore}/100. Key positive drivers include GPA (${input.gpa.toFixed(
      2
    )}) and financial need index. The candidate is recommended for ${recommendation.replace('_', ' ').toUpperCase()}.`,
  };
};

export const calculateBudgetScenario = (config: BudgetScenarioConfig): BudgetScenarioResult => {
  const simulatedApplicantsCount = 500;
  // Estimate students qualifying based on cutoff and weight settings
  const baseCoverageRate = Math.max(0.2, Math.min(0.9, (100 - config.minScoreCutoff) / 100 + 0.15));
  const totalStudentsFunded = Math.round(simulatedApplicantsCount * baseCoverageRate);

  const estimatedAverageAward = Math.min(config.maxAwardCap, Math.round(config.totalBudgetPool / totalStudentsFunded));
  const totalFundsDisbursed = Math.min(config.totalBudgetPool, totalStudentsFunded * estimatedAverageAward);
  const remainingReserve = config.totalBudgetPool - totalFundsDisbursed;
  const coveragePercentage = Number(((totalStudentsFunded / simulatedApplicantsCount) * 100).toFixed(1));

  // Compute demographic parity metric based on balance of weights
  const equityBalance = Math.abs(config.needWeight + config.equityWeight - config.meritWeight);
  const demographicParityScore = Math.max(60, Math.min(99, Math.round(95 - equityBalance * 0.4)));

  return {
    config,
    totalStudentsFunded,
    totalFundsDisbursed,
    remainingReserve,
    averageAward: estimatedAverageAward,
    coveragePercentage,
    demographicParityScore,
  };
};
