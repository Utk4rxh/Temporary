// src/services/analyticsService.ts
import type { DemographicDisparity, BudgetScenarioConfig, BudgetScenarioResult } from '../types';
import { MOCK_DEMOGRAPHIC_FAIRNESS } from '../data/mockData';
import { calculateBudgetScenario } from '../utils/aiRulesEngine';

export class AnalyticsService {
  static async getDemographicFairness(): Promise<DemographicDisparity[]> {
    const stored = localStorage.getItem('demographic_fairness');
    return stored ? JSON.parse(stored) : MOCK_DEMOGRAPHIC_FAIRNESS;
  }

  static simulateBudgetScenario(config: BudgetScenarioConfig): BudgetScenarioResult {
    return calculateBudgetScenario(config);
  }
}
