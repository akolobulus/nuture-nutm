import sqlite3
import os
import uuid
from datetime import datetime

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'nuture.db')

def seed_quiz_questions():
    week_number = datetime.now().isocalendar()[1]
    year = datetime.now().year
    
    questions = [
        ("How many hours of sleep should a college student get per night?", "5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours", "B", "Sleep Health"),
        ("What is the recommended daily water intake for adults?", "2 liters", "1 liter", "5 liters", "500ml", "A", "Nutrition"),
        ("Which vitamin is primarily obtained from sunlight?", "Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D", "D", "Nutrition"),
        ("What is the ideal frequency for hand washing?", "Once a day", "Before meals only", "Before meals and after using restroom", "Only when visibly dirty", "C", "Hygiene"),
        ("What percentage of the body is made up of water?", "30%", "50%", "60%", "80%", "C", "General Health"),
        ("How often should you exercise per week for good health?", "Once", "2-3 times", "At least 5 times", "Every day", "C", "Fitness"),
        ("What is the normal resting heart rate for adults?", "40-50 bpm", "60-100 bpm", "120-140 bpm", "150-170 bpm", "B", "General Health"),
        ("Which food group should make up most of your daily diet?", "Proteins", "Fruits and vegetables", "Fats", "Sweets", "B", "Nutrition"),
        ("What is the recommended screen time limit before bed?", "No limit", "30 minutes before", "1-2 hours before", "Only during bed", "C", "Sleep Health"),
        ("What is BMI?", "Blood Mineral Index", "Body Mass Index", "Brain Muscle Indicator", "Basic Medical Information", "B", "General Health"),
        
        ("Which mineral is essential for strong bones?", "Iron", "Calcium", "Zinc", "Magnesium", "B", "Nutrition"),
        ("What is the main cause of preventable blindness?", "Diabetes", "Vitamin A deficiency", "Computer screens", "Reading", "B", "Eye Health"),
        ("How long should you wash your hands?", "5 seconds", "10 seconds", "20 seconds", "1 minute", "C", "Hygiene"),
        ("What is the best position for sleeping?", "On stomach", "On back", "On side", "Sitting up", "C", "Sleep Health"),
        ("Which exercise is best for cardiovascular health?", "Weight lifting", "Stretching", "Running/cycling", "Yoga", "C", "Fitness"),
        ("What is the recommended daily fiber intake?", "5-10 grams", "25-30 grams", "50-60 grams", "100 grams", "B", "Nutrition"),
        ("How often should you visit a dentist?", "Once every 5 years", "Once a year", "Twice a year", "Only when in pain", "C", "Dental Health"),
        ("What is stress management technique?", "Skipping meals", "Deep breathing", "Avoiding sleep", "Excessive caffeine", "B", "Mental Health"),
        ("What causes most common colds?", "Bacteria", "Viruses", "Allergies", "Weather changes", "B", "General Health"),
        ("What is the ideal room temperature for sleep?", "15-17°C", "18-20°C", "24-26°C", "28-30°C", "B", "Sleep Health"),
        
        ("How much protein should students consume daily?", "10-15% of calories", "20-30% of calories", "50-60% of calories", "70-80% of calories", "B", "Nutrition"),
        ("What is the first aid for a burn?", "Apply ice", "Apply butter", "Cool water for 10-20 min", "Leave it alone", "C", "First Aid"),
        ("Which food is highest in Vitamin C?", "Milk", "Oranges", "Rice", "Chicken", "B", "Nutrition"),
        ("What is anemia caused by?", "Too much iron", "Iron deficiency", "Too much calcium", "Excess protein", "B", "General Health"),
        ("How often should you change your toothbrush?", "Once a year", "Every 3-4 months", "Never", "Every week", "B", "Dental Health"),
        ("What is the danger zone temperature for food?", "0-10°C", "5-60°C", "70-80°C", "90-100°C", "B", "Food Safety"),
        ("What is the best way to prevent flu?", "Stay indoors", "Annual vaccination", "Avoid water", "Skip exercise", "B", "Prevention"),
        ("Which nutrient provides the most energy?", "Protein", "Vitamins", "Carbohydrates", "Minerals", "C", "Nutrition"),
        ("What is dehydration?", "Too much water", "Lack of water", "Too much salt", "Excess sugar", "B", "General Health"),
        ("How long should you exercise each day minimum?", "5 minutes", "30 minutes", "2 hours", "4 hours", "B", "Fitness"),
        
        ("What is the healthy blood pressure range?", "90/60 to 120/80", "140/90 to 160/100", "180/110 to 200/120", "220/140+", "A", "General Health"),
        ("Which habit helps prevent cavities?", "Eating candy", "Brushing twice daily", "Drinking soda", "Skipping meals", "B", "Dental Health"),
        ("What does UV radiation from the sun cause?", "Better eyesight", "Skin damage", "Stronger bones", "Better hearing", "B", "Skin Health"),
        ("What is the main benefit of meditation?", "Weight loss", "Stress reduction", "Muscle gain", "Height increase", "B", "Mental Health"),
        ("Which food should diabetics limit?", "Vegetables", "Lean protein", "Refined sugars", "Water", "C", "Nutrition"),
        ("What is the recovery position used for?", "Exercise rest", "Unconscious breathing person", "Sleeping", "Studying", "B", "First Aid"),
        ("How many food groups are there?", "3", "5", "7", "10", "B", "Nutrition"),
        ("What is the main function of red blood cells?", "Fight infection", "Carry oxygen", "Digest food", "Filter waste", "B", "General Health"),
        ("Which activity improves flexibility?", "Running", "Swimming", "Stretching/Yoga", "Cycling", "C", "Fitness"),
        ("What is the leading cause of death worldwide?", "Cancer", "Cardiovascular disease", "Accidents", "Infections", "B", "General Health"),
        
        ("How often should you do strength training?", "Never", "2-3 times per week", "Every day", "Once a month", "B", "Fitness"),
        ("What is the purpose of warming up?", "Waste time", "Prepare body for exercise", "Cool down", "Increase fatigue", "B", "Fitness"),
        ("Which organ filters blood?", "Liver", "Kidney", "Heart", "Lungs", "B", "General Health"),
        ("What is the best source of omega-3?", "Red meat", "Fish", "Candy", "Soda", "B", "Nutrition"),
        ("How can you prevent back pain?", "Slouching", "Good posture", "Heavy lifting", "Staying still", "B", "Musculoskeletal Health"),
        ("What is CPR?", "Cold Pressure Relief", "Cardiopulmonary Resuscitation", "Cardiac Pain Response", "Calorie Processing Rate", "B", "First Aid"),
        ("Which drink should you avoid before sleep?", "Water", "Milk", "Coffee", "Herbal tea", "C", "Sleep Health"),
        ("What is the recommended salt intake per day?", "Less than 5 grams", "10-15 grams", "20-25 grams", "30+ grams", "A", "Nutrition"),
        ("What causes muscle cramps?", "Too much water", "Dehydration/mineral loss", "Too much sleep", "Excess vitamins", "B", "General Health"),
        ("Which vitamin helps blood clotting?", "Vitamin A", "Vitamin B", "Vitamin C", "Vitamin K", "D", "Nutrition"),
        
        ("What is asthma?", "Heart disease", "Lung disease", "Skin condition", "Digestive problem", "B", "Respiratory Health"),
        ("How can you boost your immune system?", "Skip meals", "Eat balanced diet", "Avoid sleep", "Stress more", "B", "General Health"),
        ("What is the function of white blood cells?", "Carry oxygen", "Fight infection", "Digest food", "Produce energy", "B", "General Health"),
        ("Which food is probiotic?", "Candy", "Yogurt", "Soda", "Chips", "B", "Nutrition"),
        ("What is the danger of smoking?", "Better lungs", "Lung cancer", "Stronger heart", "Improved fitness", "B", "Prevention"),
        ("How much added sugar should you limit daily?", "No limit", "Less than 25 grams", "100 grams", "200 grams", "B", "Nutrition"),
        ("What is hypertension?", "Low blood pressure", "High blood pressure", "Low heart rate", "High temperature", "B", "General Health"),
        ("Which exercise is low impact?", "Jumping", "Swimming", "Running on concrete", "Boxing", "B", "Fitness"),
        ("What causes most foodborne illness?", "Overcooking", "Poor hygiene", "Too much spice", "Eating vegetables", "B", "Food Safety"),
        ("What is the benefit of breakfast?", "Weight gain", "Energy and focus", "Slower metabolism", "Sleep better", "B", "Nutrition"),
        
        ("How often should you check blood pressure?", "Every 10 years", "Annually if normal", "Never", "Daily", "B", "General Health"),
        ("What is lactose intolerance?", "Meat allergy", "Dairy product intolerance", "Vegetable allergy", "Water sensitivity", "B", "Nutrition"),
        ("Which habit prevents heart disease?", "Smoking", "Regular exercise", "High fat diet", "Avoiding doctors", "B", "Prevention"),
        ("What is the main cause of tooth decay?", "Brushing too much", "Sugar and bacteria", "Drinking water", "Eating vegetables", "B", "Dental Health"),
        ("How long should a power nap be?", "2-3 hours", "10-20 minutes", "5 hours", "All day", "B", "Sleep Health"),
        ("What is the best way to prevent STDs?", "Ignore them", "Safe sex practices", "Avoid water", "Skip meals", "B", "Sexual Health"),
        ("Which organ produces insulin?", "Liver", "Pancreas", "Kidney", "Heart", "B", "General Health"),
        ("What is the recommended alcohol limit?", "No limit", "Moderate consumption", "Daily heavy drinking", "Only spirits", "B", "General Health"),
        ("How can you prevent osteoporosis?", "Avoid calcium", "Weight-bearing exercise", "Stay sedentary", "Skip meals", "B", "Bone Health"),
        ("What is the main symptom of depression?", "High energy", "Persistent sadness", "Extreme hunger", "Increased sleep quality", "B", "Mental Health"),
        
        ("Which food helps lower cholesterol?", "Fried foods", "Oats and fiber", "Sugary drinks", "Processed meats", "B", "Nutrition"),
        ("What is the purpose of vaccinations?", "Cause disease", "Prevent disease", "Weaken immune system", "Make you sick", "B", "Prevention"),
        ("How often should women get mammograms?", "Never", "Starting at 40-50", "Only if sick", "Every week", "B", "Women's Health"),
        ("What is the safe weight loss per week?", "10 kg", "0.5-1 kg", "5 kg", "15 kg", "B", "Weight Management"),
        ("Which activity reduces anxiety?", "Excessive caffeine", "Regular exercise", "Sleep deprivation", "Poor diet", "B", "Mental Health"),
        ("What is the recommended vegetable servings daily?", "1-2", "3-5", "10-15", "20+", "B", "Nutrition"),
        ("How can you prevent kidney stones?", "Avoid water", "Stay hydrated", "Eat only protein", "Skip meals", "B", "General Health"),
        ("What is the main function of the liver?", "Pump blood", "Detoxify body", "Store urine", "Digest only", "B", "General Health"),
        ("Which mineral prevents anemia?", "Calcium", "Iron", "Zinc", "Sodium", "B", "Nutrition"),
        ("What is the best treatment for common cold?", "Antibiotics", "Rest and fluids", "Surgery", "Ignoring it", "B", "General Health"),
        
        ("How much fruit should you eat daily?", "None", "2-4 servings", "15 servings", "Only juice", "B", "Nutrition"),
        ("What is diabetes?", "Blood pressure problem", "Blood sugar problem", "Liver disease", "Kidney failure", "B", "General Health"),
        ("Which exercise improves bone density?", "Swimming", "Weight training", "Cycling", "Rowing", "B", "Fitness"),
        ("What causes acne?", "Too much water", "Excess oil and bacteria", "Too much sleep", "Eating vegetables", "B", "Skin Health"),
        ("How can you improve digestion?", "Skip meals", "Eat fiber and water", "Eat only meat", "Avoid exercise", "B", "Digestive Health"),
        ("What is the function of lungs?", "Digest food", "Exchange oxygen/CO2", "Pump blood", "Filter waste", "B", "Respiratory Health"),
        ("Which nutrient builds muscle?", "Sugar", "Protein", "Water", "Salt", "B", "Nutrition"),
        ("What is the ideal BMI range?", "Below 15", "18.5-24.9", "30-35", "Above 40", "B", "General Health"),
        ("How often should you eat?", "Once a day", "3-5 times daily", "Every hour", "Never", "B", "Nutrition"),
        ("What prevents sunburn?", "No protection", "Sunscreen SPF 30+", "Tanning oil", "Dark clothing only", "B", "Skin Health"),
        
        ("Which vitamin helps vision?", "Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D", "A", "Eye Health"),
        ("What is the cause of most allergies?", "Too much water", "Immune system reaction", "Lack of sleep", "Exercise", "B", "General Health"),
        ("How can you prevent migraines?", "Skip meals", "Manage stress", "Sleep less", "Avoid water", "B", "General Health"),
        ("What is the benefit of green tea?", "Weight gain", "Antioxidants", "Sleep problems", "Dehydration", "B", "Nutrition"),
        ("Which food is high in potassium?", "Candy", "Bananas", "Soda", "Chips", "B", "Nutrition"),
        ("What is the main cause of stroke?", "Too much exercise", "Blocked blood vessel", "Too much water", "Eating vegetables", "B", "General Health"),
        ("How often should you do cardio?", "Never", "Most days of week", "Once a month", "Only when sick", "B", "Fitness"),
        ("What is the purpose of stretching?", "Build muscle", "Improve flexibility", "Lose weight", "Increase heart rate", "B", "Fitness"),
        ("Which organ stores bile?", "Stomach", "Gallbladder", "Kidney", "Liver", "B", "General Health"),
        ("What causes heartburn?", "Too much water", "Stomach acid reflux", "Too much sleep", "Exercise", "B", "Digestive Health"),
        
        ("How can you boost metabolism?", "Skip meals", "Regular exercise", "Sleep less", "Avoid water", "B", "Weight Management"),
        ("What is the recommended fats intake?", "0% of diet", "20-35% of diet", "70% of diet", "100% of diet", "B", "Nutrition"),
        ("Which activity improves mental health?", "Isolation", "Social connection", "Sleep deprivation", "Poor nutrition", "B", "Mental Health"),
        ("What is the danger of high cholesterol?", "Better health", "Heart disease", "Stronger bones", "Improved vision", "B", "General Health"),
        ("How much calcium do adults need daily?", "50 mg", "1000-1300 mg", "5000 mg", "10000 mg", "B", "Nutrition"),
        ("What is the function of antibiotics?", "Kill viruses", "Kill bacteria", "Cure all diseases", "Prevent aging", "B", "Medical Knowledge"),
        ("Which food causes inflammation?", "Vegetables", "Processed foods", "Fruits", "Water", "B", "Nutrition"),
        ("What is the recovery time for muscles?", "Immediate", "24-48 hours", "1 week", "1 month", "B", "Fitness"),
        ("How can you prevent UTI?", "Avoid water", "Stay hydrated", "Hold urine", "Poor hygiene", "B", "General Health"),
        ("What is the main benefit of vegetables?", "High calories", "Vitamins and fiber", "High sugar", "High fat", "B", "Nutrition"),
        
        ("Which exercise strengthens core?", "Running", "Planks", "Swimming", "Cycling", "B", "Fitness"),
        ("What causes bad breath?", "Brushing teeth", "Bacteria in mouth", "Drinking water", "Eating vegetables", "B", "Dental Health"),
        ("How often should you eat fatty fish?", "Never", "Twice a week", "Every meal", "Once a year", "B", "Nutrition"),
        ("What is the ideal posture when sitting?", "Slouched", "Back straight", "Leaning forward", "Twisted", "B", "Musculoskeletal Health"),
        ("Which habit improves skin health?", "Smoking", "Hydration and sunscreen", "Tanning beds", "Poor sleep", "B", "Skin Health"),
        ("What is the danger of energy drinks?", "Better focus", "Excess caffeine/sugar", "Improved health", "Better sleep", "B", "Nutrition"),
        ("How can you improve circulation?", "Sit all day", "Regular movement", "Avoid water", "Poor diet", "B", "General Health"),
        ("What is the recommended bedtime routine?", "Screen time", "Relaxation activities", "Heavy meal", "Intense exercise", "B", "Sleep Health"),
        ("Which vitamin helps wounds heal?", "Vitamin A", "Vitamin C", "Vitamin E", "Vitamin K", "B", "Nutrition"),
        ("What causes constipation?", "Too much fiber", "Low fiber/water", "Too much water", "Exercise", "B", "Digestive Health"),
        
        ("How can you prevent hearing loss?", "Loud music daily", "Protect from loud noise", "Use earbuds constantly", "Ignore symptoms", "B", "Ear Health"),
        ("What is the benefit of dark chocolate?", "Tooth decay", "Antioxidants", "Weight gain", "Poor sleep", "B", "Nutrition"),
        ("Which food is anti-inflammatory?", "Fried foods", "Berries and fatty fish", "Processed meat", "Sugary drinks", "B", "Nutrition"),
        ("What is the main cause of gum disease?", "Brushing too much", "Plaque buildup", "Eating vegetables", "Drinking water", "B", "Dental Health"),
        ("How often should you replace pillows?", "Never", "Every 1-2 years", "Every 10 years", "Monthly", "B", "Sleep Health"),
        ("What prevents muscle soreness?", "No warm-up", "Proper stretching", "Dehydration", "Overtraining", "B", "Fitness"),
        ("Which organ regulates body temperature?", "Liver", "Hypothalamus", "Stomach", "Kidney", "B", "General Health"),
        ("What is the ideal meal timing?", "One large meal", "Regular intervals", "Random times", "Only at night", "B", "Nutrition"),
        ("How can you improve balance?", "Avoid practice", "Balance exercises", "Sit all day", "Poor posture", "B", "Fitness"),
        ("What is the purpose of electrolytes?", "Decoration", "Fluid balance", "Weight gain", "Sleep aid", "B", "Nutrition"),
        
        ("Which activity reduces blood pressure?", "Stress", "Regular exercise", "Smoking", "Poor diet", "B", "General Health"),
        ("What is the best recovery after workout?", "Skip food", "Protein and rest", "Alcohol", "More exercise", "B", "Fitness"),
        ("How can you prevent varicose veins?", "Sit all day", "Regular movement", "Tight clothing", "Avoid exercise", "B", "General Health"),
        ("What is the function of testosterone?", "Digest food", "Male characteristics", "Produce insulin", "Filter blood", "B", "General Health"),
        ("Which food supports brain health?", "Candy", "Omega-3 rich foods", "Soda", "Processed foods", "B", "Nutrition"),
        ("What causes jet lag?", "Too much sleep", "Disrupted circadian rhythm", "Eating well", "Hydration", "B", "Sleep Health"),
        ("How often should you meditate?", "Never", "Daily 10-20 minutes", "Once a year", "Only when stressed", "B", "Mental Health"),
        ("What is the ideal weight for health?", "Underweight", "Healthy BMI range", "Overweight", "Obese", "B", "Weight Management"),
        ("Which habit prevents Alzheimer's?", "Avoid thinking", "Mental stimulation", "Poor diet", "Isolation", "B", "Brain Health"),
        ("What is the main benefit of whole grains?", "High sugar", "Fiber and nutrients", "Low nutrition", "Weight gain", "B", "Nutrition")
    ]
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM quiz_questions WHERE week_number = ? AND year = ?', (week_number, year))
    if cursor.fetchone()[0] == 0:
        for q in questions:
            cursor.execute('''
                INSERT INTO quiz_questions 
                (id, question, option_a, option_b, option_c, option_d, correct_answer, category, week_number, year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (str(uuid.uuid4()), q[0], q[1], q[2], q[3], q[4], q[5], q[6], week_number, year))
        
        conn.commit()
        print(f"Successfully seeded {len(questions)} quiz questions for week {week_number}, {year}")
    else:
        print(f"Quiz questions already exist for week {week_number}, {year}")
    
    conn.close()

if __name__ == '__main__':
    seed_quiz_questions()
