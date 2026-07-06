const option = (value, label) => ({ label, value })

export const inspectionQuestions = {
  ADMINISTRATION_GOVERNANCE: [
    option('ADMIN_ATTENDANCE_OCCUPANCY', 'Are student attendance and hostel occupancy records updated?'),
    option('ADMIN_PHYSICAL_COUNTS', 'Do physical student counts match attendance records?'),
    option('ADMIN_REGISTERS', 'Are mandatory registers and records available and updated?'),
  ],
  FOOD_NUTRITION: [
    option('FOOD_MENU', 'Is the approved weekly menu displayed and being followed?'),
    option('FOOD_MEAL_QUANTITY', 'Are meals being served in adequate quantity to all students?'),
    option('FOOD_QUALITY', 'Is food quality satisfactory based on inspection and student feedback?'),
    option('FOOD_NUTRITION_SUPPLEMENTS', 'Are milk, eggs, fruits and nutritional supplements supplied as per norms?'),
    option('FOOD_KITCHEN_HYGIENE', 'Is the kitchen clean and hygienically maintained?'),
    option('FOOD_GROCERY_STORAGE', 'Are food grains and groceries stored safely and hygienically?'),
    option('FOOD_STOCK_REGISTER', 'Do physical stocks broadly match stock registers?'),
    option('FOOD_DRINKING_WATER', 'Is safe drinking water available in sufficient quantity?'),
  ],
  ACCOMMODATION: [
    option('ACCOM_BEDS', 'Are sufficient beds available for all students?'),
    option('ACCOM_BEDDING', 'Are mattresses, blankets and bedding available and usable?'),
    option('ACCOM_OVERCROWDING', 'Is overcrowding observed in hostel rooms?'),
    option('ACCOM_ROOM_HABITABILITY', 'Are hostel rooms clean, ventilated and habitable?'),
    option('ACCOM_REPAIRS', 'Are major repairs required in hostel buildings or rooms?'),
  ],
  SANITATION_DRAINAGE: [
    option('SANITATION_PREMISES', 'Are hostel premises clean and free from garbage accumulation?'),
    option('SANITATION_TOILETS_AVAILABLE', 'Are sufficient toilets available for students?'),
    option('SANITATION_TOILETS_HYGIENE', 'Are toilets functional and hygienically maintained?'),
    option('SANITATION_BATHROOMS_HYGIENE', 'Are bathrooms functional and hygienically maintained?'),
    option('SANITATION_WASTE_DISPOSAL', 'Is solid waste being disposed of properly?'),
    option('SANITATION_DRAINAGE', 'Is drainage functioning properly without water stagnation?'),
    option('SANITATION_HEALTH_RISK', 'Is any sanitation issue posing immediate health risk?'),
  ],
  ELECTRICITY_LIGHTING: [
    option('ELECTRICITY_RELIABILITY', 'Is electricity available and reliable?'),
    option('ELECTRICITY_LIGHTING', 'Are room and study-area lighting arrangements adequate?'),
    option('ELECTRICITY_FITTINGS', 'Are fans, electrical fittings and wiring functioning safely?'),
    option('ELECTRICITY_OUTDOOR_LIGHTING', 'Is outdoor/night lighting adequate for student safety?'),
  ],
  HEALTH_MEDICAL_CARE: [
    option('HEALTH_FIRST_AID', 'Is first-aid equipment available and serviceable?'),
    option('HEALTH_SICK_STUDENTS', 'Are sick students recorded and monitored properly?'),
    option('HEALTH_CHECKUPS', 'Have health check-ups been conducted as per schedule?'),
    option('HEALTH_COMMUNICABLE_DISEASES', 'Are any communicable diseases or health concerns observed?'),
    option('HEALTH_HYGIENE_MATERIALS', 'Are sanitary and personal hygiene materials available to students as required?'),
  ],
  EDUCATION_ACADEMIC_ENVIRONMENT: [
    option('EDUCATION_LEARNING_MATERIALS', 'Are textbooks, notebooks and learning materials available for students?'),
    option('EDUCATION_ATTENDANCE', 'Is student attendance in school/classes satisfactory?'),
    option('EDUCATION_STUDY_SUPPORT', 'Are study hours and academic support arrangements functioning properly?'),
  ],
  SAFETY_SECURITY: [
    option('SAFETY_BOUNDARY', 'Are hostel boundary protection measures (compound wall/fencing/gate) adequate?'),
    option('SAFETY_SECURITY_ARRANGEMENTS', 'Are security arrangements (watchman/CCTV/visitor control) adequate?'),
    option('SAFETY_HAZARDS', 'Are any safety hazards observed that require immediate attention?'),
  ],
}

export const getInspectionQuestions = moduleName =>
  inspectionQuestions[moduleName] || []