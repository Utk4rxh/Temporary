// src/types/index.ts

export type UserRole = 'student' | 'admin';

export type ApplicationStatus =
  | 'submitted'
  | 'ai_evaluated'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'overridden';

export type ScholarshipCategory =
  | 'merit_based'
  | 'need_based'
  | 'stem_diversity'
  | 'first_gen'
  | 'community_leadership';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  major: string;
  university: string;
  graduationYear: number;
  gpa: number;
  annualHouseholdIncome: number;
  familySize: number;
  isFirstGenStudent: boolean;
  underrepresentedGroup: boolean;
  communityHours: number;
  essayScore: number; // 0-100 derived from NLP scoring
  ethnicity?: string;
  gender?: string;
  region?: string;
}

export interface FeatureWeight {
  featureName: string;
  category: 'academic' | 'financial' | 'equity' | 'extracurricular';
  value: number | string; // Raw feature value e.g. 3.85 GPA or $28,000 Income
  shapValue: number;      // SHAP contribution to score (+ or -)
  impactDescription: string;
}

export interface AIScoreBreakdown {
  overallScore: number;            // 0 - 100
  academicScore: number;           // 0 - 100
  financialNeedScore: number;      // 0 - 100
  equityDiversityScore: number;    // 0 - 100
  extracurricularScore: number;    // 0 - 100
  confidenceScore: number;         // 0 - 1.0 (AI certainty)
  recommendation: 'strong_award' | 'moderate_award' | 'borderline_review' | 'do_not_award';
  recommendedGrantAmount: number;
  featureWeights: FeatureWeight[];
  generatedExplanation: string;
}

export interface Application {
  id: string;
  studentId: string;
  student: StudentProfile;
  scholarshipId: string;
  scholarshipName: string;
  submissionDate: string;
  status: ApplicationStatus;
  requestedAmount: number;
  awardedAmount?: number;
  aiBreakdown: AIScoreBreakdown;
  isOverridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  documents?: {
    name: string;
    type: string;
    verified: boolean;
    url: string;
  }[];
}

export interface ScholarshipFund {
  id: string;
  name: string;
  code: string;
  category: ScholarshipCategory;
  totalBudget: number;
  allocatedAmount: number;
  remainingAmount: number;
  maxGrantPerStudent: number;
  minScoreThreshold: number;
  deadline: string;
  applicantCount: number;
  description: string;
}

export interface DemographicDisparity {
  id: string;
  groupCategory: 'gender' | 'ethnicity' | 'income_tier' | 'geographic_region';
  groupName: string;
  applicantCount: number;
  awardCount: number;
  selectionRate: number;         // Percentage e.g. 42.5%
  averageGrantAmount: number;
  disparateImpactRatio: number; // Ideal ~1.0, <0.8 indicates bias
  isFair: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: 'AI_SCORING_RUN' | 'MANUAL_OVERRIDE' | 'BUDGET_REALLOCATION' | 'WEIGHT_UPDATE' | 'STATUS_CHANGE';
  applicationId?: string;
  applicantName?: string;
  previousValue?: string;
  newValue?: string;
  justification?: string;
  ipAddress: string;
}

export interface BudgetScenarioConfig {
  scenarioName: string;
  totalBudgetPool: number;
  meritWeight: number;      // e.g. 40%
  needWeight: number;       // e.g. 35%
  equityWeight: number;     // e.g. 25%
  minScoreCutoff: number;   // e.g. 65
  maxAwardCap: number;      // e.g. $10,000
}

export interface BudgetScenarioResult {
  config: BudgetScenarioConfig;
  totalStudentsFunded: number;
  totalFundsDisbursed: number;
  remainingReserve: number;
  averageAward: number;
  coveragePercentage: number;
  demographicParityScore: number; // 0 - 100
}
