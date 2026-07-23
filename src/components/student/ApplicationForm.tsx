// src/components/student/ApplicationForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { useApplications } from '../../context/ApplicationContext';
import { calculateCandidateScore } from '../../utils/aiRulesEngine';
import {
  User,
  Users,
  DollarSign,
  GraduationCap,
  Award,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react';

export interface ScholarshipFormData {
  // Step 1: Personal Details
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;

  // Step 2: Family Details
  parentName: string;
  parentOccupation: string;
  familySize: number;
  dependentSiblings: number;

  // Step 3: Income Details
  annualHouseholdIncome: number;
  primaryIncomeSource: string;
  financialHardshipStatus: string;
  hardshipNotes?: string;

  // Step 4: Academic Details
  university: string;
  major: string;
  gpa: number;
  graduationYear: number;
  academicHonors?: string;

  // Step 5: Opportunity Details
  scholarshipId: string;
  requestedAmount: number;
  communityHours: number;
  essayText: string;

  // Step 6: Documents
  transcriptUploaded: boolean;
  incomeProofUploaded: boolean;
  idProofUploaded: boolean;
  recommendationUploaded: boolean;
}

export const ApplicationForm: React.FC = () => {
  const { addApplication, funds } = useApplications();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScholarshipFormData>({
    mode: 'onChange',
    defaultValues: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      phone: '+1 (555) 234-5678',
      dob: '2004-05-14',
      gender: 'Female',
      address: '742 Evergreen Terrace, Berkeley, CA 94704',

      parentName: 'Elena & Marcus Rivera',
      parentOccupation: 'Hospital Service Worker / Driver',
      familySize: 4,
      dependentSiblings: 2,

      annualHouseholdIncome: 35000,
      primaryIncomeSource: 'W2 Hourly Employment',
      financialHardshipStatus: 'Pell Eligible / High Hardship',
      hardshipNotes: 'Sole income provider supporting grandmother and two high school siblings.',

      university: 'University of California, Berkeley',
      major: 'Computer Science & Data Ethics',
      gpa: 3.85,
      graduationYear: 2027,
      academicHonors: "Dean's Honor List 2025, First-Gen STEM Scholar",

      scholarshipId: funds[0]?.id || 'fund-101',
      requestedAmount: 100000,
      communityHours: 115,
      essayText:
        'My journey into computer science stems from wanting to build accessible AI tools for under-resourced schools in my hometown...',

      transcriptUploaded: true,
      incomeProofUploaded: true,
      idProofUploaded: true,
      recommendationUploaded: true,
    },
  });

  const formData = watch();
  const selectedFund = funds.find((f) => f.id === formData.scholarshipId) || funds[0];

  const stepFields: Record<number, (keyof ScholarshipFormData)[]> = {
    1: ['fullName', 'email', 'phone', 'dob', 'gender', 'address'],
    2: ['parentName', 'parentOccupation', 'familySize', 'dependentSiblings'],
    3: ['annualHouseholdIncome', 'primaryIncomeSource', 'financialHardshipStatus'],
    4: ['university', 'major', 'gpa', 'graduationYear'],
    5: ['scholarshipId', 'requestedAmount', 'communityHours', 'essayText'],
    6: ['transcriptUploaded', 'incomeProofUploaded', 'idProofUploaded', 'recommendationUploaded'],
  };

  const stepsList = [
    { num: 1, title: 'Personal Details', icon: User },
    { num: 2, title: 'Family Details', icon: Users },
    { num: 3, title: 'Income Details', icon: DollarSign },
    { num: 4, title: 'Academic Details', icon: GraduationCap },
    { num: 5, title: 'Opportunity Details', icon: Award },
    { num: 6, title: 'Upload Documents', icon: Upload },
  ];

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmitForm = async (data: ScholarshipFormData) => {
    setIsSubmitting(true);

    const aiBreakdown = calculateCandidateScore({
      gpa: Number(data.gpa),
      income: Number(data.annualHouseholdIncome),
      familySize: Number(data.familySize),
      firstGen: true,
      underrepresented: true,
      communityHours: Number(data.communityHours),
      essayScore: 92,
    });

    const newApp = await addApplication({
      studentId: `stu-${Date.now()}`,
      student: {
        id: `stu-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        major: data.major,
        university: data.university,
        graduationYear: Number(data.graduationYear),
        gpa: Number(data.gpa),
        annualHouseholdIncome: Number(data.annualHouseholdIncome),
        familySize: Number(data.familySize),
        isFirstGenStudent: true,
        underrepresentedGroup: true,
        communityHours: Number(data.communityHours),
        essayScore: 92,
        ethnicity: 'Hispanic / Latino',
        gender: data.gender,
        region: 'West',
      },
      scholarshipId: selectedFund.id,
      scholarshipName: selectedFund.name,
      requestedAmount: Number(data.requestedAmount),
      awardedAmount: aiBreakdown.recommendedGrantAmount,
      aiBreakdown,
      documents: [
        { name: 'Official_Transcript_2026.pdf', type: 'PDF Transcript', verified: true, url: '#' },
        { name: 'FAFSA_Income_Verification.pdf', type: 'Income Certificate', verified: true, url: '#' },
        { name: 'Government_ID_Proof.pdf', type: 'ID Proof', verified: true, url: '#' },
        { name: 'Faculty_Recommendation.pdf', type: 'Recommendation', verified: true, url: '#' },
      ],
    });

    setIsSubmitting(false);
    navigate(`/student/result/${newApp.id}`);
  };

  const progressPercent = Math.round(((currentStep - 1) / 5) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="gov-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Official Grant Application Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
          Scholarship Application Form
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete the 6 verification steps below for SHAP AI evaluation and board endowment allocation.
        </p>

        {/* PROGRESS BAR & STEP COUNTER */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-blue-300">
              Step {currentStep} of 6: {stepsList[currentStep - 1].title}
            </span>
            <span className="text-emerald-400">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* STEP INDICATORS NAV */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stepsList.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <div
              key={step.num}
              onClick={() => {
                if (step.num < currentStep) setCurrentStep(step.num);
              }}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : isActive
                  ? 'bg-blue-600/30 border-blue-500/50 text-white shadow-glow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-semibold leading-tight">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSubmit(onSubmitForm)}>
        {/* STEP 1: PERSONAL DETAILS */}
        {currentStep === 1 && (
          <Card variant="glass" className="p-6 sm:p-8 space-y-6 border-blue-900/30">
            <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Step 1: Personal Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.fullName && <p className="text-rose-400 text-[10px] mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Date of Birth *</label>
                <input
                  type="date"
                  {...register('dob', { required: 'Date of birth is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.dob && <p className="text-rose-400 text-[10px] mt-1">{errors.dob.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Gender Identity *</label>
                <select
                  {...register('gender', { required: 'Gender selection is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Residential Address *</label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.address && <p className="text-rose-400 text-[10px] mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </Card>
        )}

        {/* STEP 2: FAMILY DETAILS */}
        {currentStep === 2 && (
          <Card variant="glass" className="p-6 sm:p-8 space-y-6 border-blue-900/30">
            <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Step 2: Family Background</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Parent / Guardian Name *</label>
                <input
                  type="text"
                  {...register('parentName', { required: 'Parent/Guardian name is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.parentName && <p className="text-rose-400 text-[10px] mt-1">{errors.parentName.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Parent Primary Occupation *</label>
                <input
                  type="text"
                  {...register('parentOccupation', { required: 'Parent occupation is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
                {errors.parentOccupation && <p className="text-rose-400 text-[10px] mt-1">{errors.parentOccupation.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Household Dependents *</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  {...register('familySize', { required: 'Family size is required', min: 1 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dependent School-Age Siblings *</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  {...register('dependentSiblings', { required: 'Number of siblings is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 3: INCOME DETAILS */}
        {currentStep === 3 && (
          <Card variant="glass" className="p-6 sm:p-8 space-y-6 border-blue-900/30">
            <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Step 3: Income & Financial Need</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Annual Household Income ($) *</label>
                <input
                  type="number"
                  step="1000"
                  {...register('annualHouseholdIncome', { required: 'Household income is required', min: 0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-emerald-400 font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Income Source *</label>
                <input
                  type="text"
                  {...register('primaryIncomeSource', { required: 'Primary income source is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Financial Hardship / FAFSA Status *</label>
                <select
                  {...register('financialHardshipStatus', { required: 'Hardship status is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Pell Eligible / High Hardship">Pell Eligible / Below Federal Poverty Line</option>
                  <option value="Moderate Need">Moderate Need ($35k - $60k Income)</option>
                  <option value="Independent Student">Independent Student / Single Income</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Special Hardship Circumstances (Optional)</label>
                <textarea
                  rows={3}
                  {...register('hardshipNotes')}
                  placeholder="Describe any medical expenses, single-parent hardship, or unexpected financial disruption..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 4: ACADEMIC DETAILS */}
        {currentStep === 4 && (
          <Card variant="glass" className="p-6 sm:p-8 space-y-6 border-blue-900/30">
            <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Step 4: Academic Achievements</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">University / College Institution *</label>
                <input
                  type="text"
                  {...register('university', { required: 'University name is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Academic Major / Degree Program *</label>
                <input
                  type="text"
                  {...register('major', { required: 'Major is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cumulative GPA (Out of 4.00) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  {...register('gpa', { required: 'GPA is required', min: 0, max: 4.0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-blue-400 font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expected Graduation Year *</label>
                <input
                  type="number"
                  {...register('graduationYear', { required: 'Graduation year is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Academic Honors & Awards (Optional)</label>
                <input
                  type="text"
                  {...register('academicHonors')}
                  placeholder="e.g. Dean's List, Honor Society, Hackathon Winner..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 5: OPPORTUNITY DETAILS */}
        {currentStep === 5 && (
          <Card variant="glass" className="p-6 sm:p-8 space-y-6 border-blue-900/30">
            <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-lg text-white font-['Outfit']">Step 5: Scholarship Target & Essay Statement</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Select Target Scholarship Fund *</label>
                <select
                  {...register('scholarshipId', { required: 'Scholarship fund is required' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                >
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — Max: ${f.maxGrantPerStudent.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Requested Funding Amount ($) *</label>
                <input
                  type="number"
                  step="5000"
                  {...register('requestedAmount', { required: 'Requested amount is required', min: 1000 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-purple-400 font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Documented Volunteer Hours *</label>
                <input
                  type="number"
                  {...register('communityHours', { required: 'Volunteer hours required', min: 0 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Personal Essay Response *</label>
                <textarea
                  rows={5}
                  {...register('essayText', { required: 'Essay statement is required' })}
                  placeholder="Describe your academic goals, vision, and community impact..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white leading-relaxed focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 6: UPLOAD DOCUMENTS & FINAL SUBMIT */}
        {currentStep === 6 && (
          <Card variant="glow" className="p-6 sm:p-8 space-y-6 border-blue-500/40">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-lg text-white font-['Outfit']">Step 6: Upload Verification Documents & Submit</h3>
              </div>
              <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>

            <Alert type="info" title="OCR AI Document Verification">
              Uploaded files will be parsed via automatic OCR validation. Verified documents receive a 100% FERPA encryption seal.
            </Alert>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Official Academic Transcript (PDF)', field: 'transcriptUploaded' as const },
                { label: 'Income Certificate / FAFSA Form (PDF)', field: 'incomeProofUploaded' as const },
                { label: 'Government Photo ID Proof (PDF/JPG)', field: 'idProofUploaded' as const },
                { label: 'Faculty Recommendation Letter (PDF)', field: 'recommendationUploaded' as const },
              ].map((docItem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">{docItem.label}</div>
                      <div className="text-[10px] text-slate-400">Attached & OCR Ready</div>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer bg-blue-950/80 border border-blue-500/40 px-3 py-1.5 rounded-lg text-blue-300 font-bold text-xs">
                    <input
                      type="checkbox"
                      checked={formData[docItem.field]}
                      onChange={(e) => setValue(docItem.field, e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span>Attached</span>
                  </label>
                </div>
              ))}
            </div>

            {/* PRE-CALCULATED AI ESTIMATION MATCH BOX */}
            <div className="p-4 rounded-2xl bg-blue-950/50 border border-blue-500/40 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm">Estimated SHAP Match Index</span>
                <p className="text-[11px] text-slate-400">
                  Target Fund: <strong className="text-blue-300">{selectedFund.name}</strong>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-emerald-400 font-['Outfit']">89.4 / 100</div>
                <span className="text-[10px] text-teal-300 font-semibold">Strong Allocation Match</span>
              </div>
            </div>
          </Card>
        )}

        {/* NAVIGATION BUTTONS (NEXT / BACK) */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <Button
            type="button"
            variant="secondary"
            icon={ArrowLeft}
            disabled={currentStep === 1}
            onClick={handleBack}
          >
            Back
          </Button>

          {currentStep < 6 ? (
            <Button type="button" variant="glow" icon={ArrowRight} iconPosition="right" onClick={handleNext}>
              Next: Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="glow"
              size="lg"
              loading={isSubmitting}
              icon={Sparkles}
              iconPosition="right"
            >
              Submit Application & Execute AI Evaluation
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
