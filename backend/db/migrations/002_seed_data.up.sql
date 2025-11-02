-- Seed insurance plans
INSERT INTO insurance_plans (id, name, tier, coverage_limit, monthly_price, description, features) VALUES
(
  'basic-plan',
  'Basic Plan',
  'basic',
  50000,
  1500,
  'Essential coverage for students',
  '["Emergency care up to ₦50,000", "Basic medication coverage", "24/7 telehealth support", "Preventive care included"]'
),
(
  'standard-plan',
  'Standard Plan',
  'standard',
  150000,
  3500,
  'Comprehensive coverage for most needs',
  '["Emergency care up to ₦150,000", "Prescription medication", "Specialist consultations", "Lab tests & diagnostics", "24/7 telehealth support", "Dental check-ups"]'
),
(
  'premium-plan',
  'Premium Plan',
  'premium',
  300000,
  6000,
  'Maximum coverage and benefits',
  '["Emergency care up to ₦300,000", "Full prescription coverage", "Unlimited specialist visits", "Advanced diagnostics", "Mental health support", "24/7 telehealth support", "Dental & vision care", "Wellness programs"]'
);

-- Seed some health tips
INSERT INTO health_tips (id, title, content, category, published) VALUES
(
  'tip-1',
  'Stay Hydrated During Exams',
  'Drinking enough water is crucial for brain function and concentration. Aim for 8 glasses a day, especially during exam periods.',
  'Wellness',
  true
),
(
  'tip-2',
  'Importance of Sleep',
  'Getting 7-9 hours of sleep improves memory retention and academic performance. Avoid all-nighters before exams.',
  'Mental Health',
  true
),
(
  'tip-3',
  'Healthy Eating on Campus',
  'Choose nutritious meals even with a student budget. Fresh fruits, vegetables, and whole grains boost energy and immunity.',
  'Nutrition',
  true
),
(
  'tip-4',
  'Manage Exam Stress',
  'Practice deep breathing, take regular breaks, and don''t hesitate to reach out to counselors if you feel overwhelmed.',
  'Mental Health',
  true
),
(
  'tip-5',
  'Regular Exercise Benefits',
  'Even 20 minutes of daily exercise can reduce stress, improve mood, and boost your immune system.',
  'Wellness',
  true
);
