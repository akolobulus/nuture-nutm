// Mock data for the application - replaces backend API

export interface InsurancePlan {
  id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  coverageLimit: number;
  monthlyPrice: number;
  description: string;
  features: string[];
  active: boolean;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  category: string;
}

export interface Claim {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'expired';
  rewardAmount: number;
  createdAt: string;
}

// Insurance Plans Data
export const mockPlans: InsurancePlan[] = [
  {
    id: 'basic',
    name: 'Basic Student Plan',
    tier: 'basic',
    coverageLimit: 50000000,
    monthlyPrice: 500000,
    description: 'Essential coverage for students',
    features: ['Emergency Care', 'Basic Medication', 'Doctor Visits'],
    active: true,
  },
  {
    id: 'standard',
    name: 'Standard Student Plan',
    tier: 'standard',
    coverageLimit: 100000000,
    monthlyPrice: 1000000,
    description: 'Comprehensive coverage with dental',
    features: ['Emergency Care', 'Medication', 'Doctor Visits', 'Dental Care', 'Lab Tests'],
    active: true,
  },
  {
    id: 'premium',
    name: 'Premium Student Plan',
    tier: 'premium',
    coverageLimit: 200000000,
    monthlyPrice: 1500000,
    description: 'Full coverage with mental health',
    features: [
      'Emergency Care',
      'Full Medication',
      'Specialist Visits',
      'Dental Care',
      'Mental Health',
      'Lab Tests',
    ],
    active: true,
  },
];

// Health Tips Data
export const mockHealthTips: HealthTip[] = [
  {
    id: 'tip-1',
    title: 'Stay Hydrated',
    content: 'Drink at least 8 glasses of water daily to maintain optimal health.',
    category: 'General',
    published: true,
  },
  {
    id: 'tip-2',
    title: 'Regular Exercise',
    content: 'Aim for 30 minutes of physical activity most days of the week.',
    category: 'Fitness',
    published: true,
  },
  {
    id: 'tip-3',
    title: 'Balanced Diet',
    content: 'Eat a variety of fruits, vegetables, whole grains, and lean proteins.',
    category: 'Nutrition',
    published: true,
  },
  {
    id: 'tip-4',
    title: 'Mental Health',
    content: 'Take time for activities that reduce stress and promote relaxation.',
    category: 'Mental Health',
    published: true,
  },
  {
    id: 'tip-5',
    title: 'Sleep Well',
    content: 'Get 7-9 hours of quality sleep each night for better health.',
    category: 'General',
    published: true,
  },
  {
    id: 'tip-6',
    title: 'Hand Hygiene',
    content: 'Wash your hands frequently with soap for at least 20 seconds to prevent infections.',
    category: 'Hygiene',
    published: true,
  },
  {
    id: 'tip-7',
    title: 'Limit Screen Time',
    content: 'Take breaks from screens every hour to reduce eye strain and improve focus.',
    category: 'General',
    published: true,
  },
  {
    id: 'tip-8',
    title: 'Stress Management',
    content: 'Practice deep breathing, meditation, or yoga to manage stress effectively.',
    category: 'Mental Health',
    published: true,
  },
];

// Quiz Questions Data (50 questions)
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How many hours of sleep should a college student get per night?',
    options: { A: '5-6 hours', B: '7-9 hours', C: '10-12 hours', D: '4-5 hours' },
    correctAnswer: 'B',
    category: 'Sleep Health',
  },
  {
    id: 'q2',
    question: 'What is the recommended daily water intake for adults?',
    options: { A: '2 liters', B: '1 liter', C: '5 liters', D: '500ml' },
    correctAnswer: 'A',
    category: 'Nutrition',
  },
  {
    id: 'q3',
    question: 'Which vitamin is primarily obtained from sunlight?',
    options: { A: 'Vitamin A', B: 'Vitamin B12', C: 'Vitamin C', D: 'Vitamin D' },
    correctAnswer: 'D',
    category: 'Nutrition',
  },
  {
    id: 'q4',
    question: 'What is the ideal frequency for hand washing?',
    options: {
      A: 'Once a day',
      B: 'Before meals only',
      C: 'Before meals and after using restroom',
      D: 'Only when visibly dirty',
    },
    correctAnswer: 'C',
    category: 'Hygiene',
  },
  {
    id: 'q5',
    question: 'What percentage of the body is made up of water?',
    options: { A: '30%', B: '50%', C: '60%', D: '80%' },
    correctAnswer: 'C',
    category: 'General Health',
  },
  {
    id: 'q6',
    question: 'How often should you exercise per week for good health?',
    options: { A: 'Once', B: '2-3 times', C: 'At least 5 times', D: 'Every day' },
    correctAnswer: 'C',
    category: 'Fitness',
  },
  {
    id: 'q7',
    question: 'What is the normal resting heart rate for adults?',
    options: { A: '40-50 bpm', B: '60-100 bpm', C: '120-140 bpm', D: '150-170 bpm' },
    correctAnswer: 'B',
    category: 'General Health',
  },
  {
    id: 'q8',
    question: 'Which food group should make up most of your daily diet?',
    options: { A: 'Proteins', B: 'Fruits and vegetables', C: 'Fats', D: 'Sweets' },
    correctAnswer: 'B',
    category: 'Nutrition',
  },
  {
    id: 'q9',
    question: 'What is the recommended screen time limit before bed?',
    options: {
      A: 'No limit',
      B: '30 minutes before',
      C: '1-2 hours before',
      D: 'Only during bed',
    },
    correctAnswer: 'C',
    category: 'Sleep Health',
  },
  {
    id: 'q10',
    question: 'What is BMI?',
    options: {
      A: 'Blood Mineral Index',
      B: 'Body Mass Index',
      C: 'Brain Muscle Indicator',
      D: 'Basic Medical Information',
    },
    correctAnswer: 'B',
    category: 'General Health',
  },
];

// Mock user data storage helpers
export const mockStorage = {
  getClaims: (): Claim[] => {
    const stored = localStorage.getItem('nuture_claims');
    return stored ? JSON.parse(stored) : [];
  },

  saveClaim: (claim: Claim) => {
    const claims = mockStorage.getClaims();
    claims.push(claim);
    localStorage.setItem('nuture_claims', JSON.stringify(claims));
  },

  getSubscription: (): Subscription | null => {
    const stored = localStorage.getItem('nuture_subscription');
    return stored ? JSON.parse(stored) : null;
  },

  saveSubscription: (subscription: Subscription) => {
    localStorage.setItem('nuture_subscription', JSON.stringify(subscription));
  },

  getReferrals: (): Referral[] => {
    const stored = localStorage.getItem('nuture_referrals');
    return stored ? JSON.parse(stored) : [];
  },

  saveReferral: (referral: Referral) => {
    const referrals = mockStorage.getReferrals();
    referrals.push(referral);
    localStorage.setItem('nuture_referrals', JSON.stringify(referrals));
  },

  getQuizScores: (): { score: number; total: number; date: string }[] => {
    const stored = localStorage.getItem('nuture_quiz_scores');
    return stored ? JSON.parse(stored) : [];
  },

  saveQuizScore: (score: number, total: number) => {
    const scores = mockStorage.getQuizScores();
    scores.push({ score, total, date: new Date().toISOString() });
    localStorage.setItem('nuture_quiz_scores', JSON.stringify(scores));
  },
};
