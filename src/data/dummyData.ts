// Expands to 30 hostels to cover the highest count needed by Students chart
export const hostelNames = [
  "Sri Vidya Boys Hostel, Tumkur", "Govt Girls Hostel, Mandya", "BC Welfare Hostel, Mysuru",
  "SC/ST Boys Hostel, Belgaum", "Morarji Desai Residential, Dharwad", "Kittur Rani Hostel, Hubli",
  "Govt Boys Hostel, Raichur", "Navodaya Girls Hostel, Gulbarga", "Eklavya Hostel, Bidar",
  "Savitribai Phule Hostel, Bagalkot", "Ambedkar Hostel, Bellary", "Jyothi Boys Hostel, Shimoga",
  "Vivekananda Hostel, Chitradurga", "Basaveshwara Hostel, Davangere", "Kanaka Girls Hostel, Hassan",
  "Nehru Memorial Hostel, Kolar", "Gandhi Hostel, Chikmagalur", "Tagore Hostel, Udupi",
  "APJ Abdul Kalam Hostel, Karwar", "Ashoka Hostel, Gadag", "Bhoomi Hostel, Bengaluru Rural",
  "Nagarjuna Hostel, Chikkaballapur", "Kuvempu Hostel, Ramanagara", "Bhadra Hostel, Koppal",
  "Malnad Hostel, Kodagu", "Sir M Visvesvaraya Hostel, Bengaluru Urban", "Kittur Rani Channamma, Haveri",
  "Sangolli Rayanna, Belagavi", "Kanakadasa, Vijayanagara", "Kempegowda, Mandya"
];

export const districts = [
  "Tumkur", "Mandya", "Mysuru", "Belgaum", "Dharwad", "Hubli", "Raichur",
  "Gulbarga", "Bidar", "Bagalkot", "Bellary", "Shimoga", "Chitradurga",
  "Davangere", "Hassan", "Kolar", "Chikmagalur", "Udupi", "Karwar", "Gadag",
  "Bengaluru Rural", "Chikkaballapur", "Ramanagara", "Koppal", "Kodagu", 
  "Bengaluru Urban", "Haveri", "Belagavi", "Vijayanagara", "Mandya"
];

// Master array of all 30 hostels with explicit raw values
export const rawHostelsData = hostelNames.map((name, i) => {
  return {
    id: i + 1,
    hostelName: name,
    district: districts[i],
    // --- Hostel Authority --- 
    principalRegular: i < 20 ? "Yes" : "No",
    principalHQ: i < 10 ? "Yes" : "No",

    // --- Students ---
    students: i < 4 ? 38 : i < 11 ? 42 : i < 21 ? 52 : i < 24 ? 82 : 93,
    boys: 0, girls: 0, 

    // --- Record Maintenance ---
    staffAtt: i < 20 ? "Yes" : "No",
    boarderAtt: i < 25 ? "Yes" : "No",
    sickBoarders: i < 4 ? "Yes" : "No",
    boarderMovement: i < 22 ? "Yes" : "No",
    visitorRegister: i < 17 ? "Yes" : "No",
    treasuryBill: i < 22 ? "Yes" : "No",
    otherRecords: i < 14 ? "Yes" : "No",

    // --- Staff Details ---
    workers: i < 10 ? 2 : i < 16 ? 8 : i < 24 ? 14 : i < 28 ? 23 : 26,
    cooks: i < 6 ? 1 : i < 9 ? 3 : i < 16 ? 9 : i < 20 ? 15 : i < 23 ? 19 : 0,
    kamati: i < 6 ? 1 : i < 9 ? 2 : i < 16 ? 4 : i < 20 ? 5 : i < 23 ? 8 : 0,
    watchmen: i < 1 ? 1 : i < 2 ? 2 : i < 4 ? 4 : i < 8 ? 5 : i < 11 ? 7 : 0,
    scavengersAvailable: i < 1 ? 1 : i < 2 ? 3 : i < 4 ? 4 : i < 6 ? 5 : i < 9 ? 7 : 0,
    scavengersRequired: i < 2 ? 1 : i < 3 ? 3 : i < 6 ? 4 : i < 9 ? 5 : i < 11 ? 7 : 0,

    // --- Rooms ---
    livingRooms: i < 10 ? 5 : i < 16 ? 8 : i < 26 ? 20 : 22,
    locationGovt: i < 15 ? "Yes" : "No", 
    bedsAvailable: i < 20 ? "Yes" : "No", 
    mattressAvailable: i < 4 ? "Yes" : "No", 
    accommodationSufficient: i < 12 ? "Yes" : "No", 
    tubeLights: i < 1 ? 2 : i < 4 ? 6 : i < 16 ? 10 : i < 22 ? 18 : i < 26 ? 26 : i < 28 ? 58 : i < 29 ? 74 : 90,
    fans: i < 4 ? 5 : i < 16 ? 8 : i < 22 ? 11 : i < 25 ? 14 : i < 27 ? 17 : i < 29 ? 20 : 41,

    // --- Sanitation ---
    gpCleaning: i < 16 ? "Yes" : "No", 
    greyBlackWater: i < 15 ? "Yes" : "No", 
    septicCleaned: i < 10 ? "Yes" : "No", 
    soakPits: i < 20 ? "Yes" : "No", 
    septicBoreDistance: i < 18 ? "Yes" : "No", 
    premisesClean: i < 20 ? "Yes" : "No", 
    toiletsAvailable: i < 3 ? 2 : i < 7 ? 5 : i < 11 ? 8 : i < 13 ? 11 : i < 17 ? 14 : i < 21 ? 26 : 0,
    toiletsFunctioningPct: i < 1 ? 56 : i < 4 ? 68 : i < 6 ? 74 : 0,
    toiletsSufficient: i < 20 ? "Yes" : "No",
    waterSource: [
      i < 15 ? "Bore Well" : null,
      i >= 10 && i < 20 ? "RO Plant" : null,
      i % 2 === 0 || i > 25 ? "Open Well" : null,
      i % 3 === 0 ? "Water Cans" : null,
      i % 4 !== 0 ? "Tap/Municipality" : null
    ].filter(Boolean),

    // --- Medical Care ---
    medicalVisits: i < 15 ? "Yes" : "No",
    firstAid: i < 16 ? "Yes" : "No", 
    phcDistance: i < 12 ? 2 : i < 14 ? 5 : i < 24 ? 14 : 0,

    // --- Education Facilities ---
    textbooks: i < 11 ? "Yes" : "No", 
    notebooks: i < 15 ? "Yes" : "No", 
    uniforms: i < 17 ? "Yes" : "No", 
    trunkBoxes: i < 19 ? "Yes" : "No", 
    plates: i < 20 ? "Yes" : "No", 
    schoolBags: i < 18 ? "Yes" : "No", 
    bedding: i < 10 ? "Yes" : "No", 
    lessonPlan: i < 14 ? "Yes" : "No", 

    // --- Food Provisions ---
    menuChart: i < 15 ? "Yes" : "No",
    menuImpl: i < 15 ? "Yes" : "No",
    stockReg: i < 14 ? "Yes" : "No",
    vegStorage: i < 13 ? "Yes" : "No",
    exhaustFan: i < 2 ? "Yes" : "No",
    varRice: i < 2 ? "Yes" : "No",
    varDal: i < 3 ? "Yes" : "No",
    varOil: i < 5 ? "Yes" : "No",
    varSugar: i < 5 ? "Yes" : "No",
    varRava: i < 5 ? "Yes" : "No",
    varRagi: i < 5 ? "Yes" : "No",

    // --- Safety ---
    lighting: i < 18 ? "Yes" : "No",
    police: i < 10 ? "Yes" : "No",
    cctvAvailable: i < 4 ? 2 : i < 14 ? 5 : i < 17 ? 8 : i < 19 ? 11 : 0,
    cctvFunctioning: i < 3 ? 2 : i < 10 ? 5 : i < 12 ? 8 : i < 15 ? 11 : 0,

    // --- Meetings ---
    meetings: i < 18 ? "Yes" : "No",
  };
});

// Set random boys/girls that sum to students
rawHostelsData.forEach(h => {
  h.boys = Math.floor(h.students * 0.55);
  h.girls = h.students - h.boys;
});

// For Photos
export const photosData = {
  folders: [
    {
      category: "Toilets",
      photos: [
        { label: "Toilet Block - Front View", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop", hostel: hostelNames[0], date: "2026-01-15" },
        { label: "Toilet Block - Interior", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop", hostel: hostelNames[1], date: "2026-01-18" },
      ],
    },
    {
      category: "Bathrooms",
      photos: [
        { label: "Bathroom Facility", url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop", hostel: hostelNames[2], date: "2026-02-05" },
      ],
    },
    {
      category: "Veg Storage",
      photos: [
        { label: "Vegetable Storage Room", url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop", hostel: hostelNames[4], date: "2026-02-20" },
      ],
    },
    {
      category: "Main Gate",
      photos: [
        { label: "Hostel Main Gate", url: "https://images.unsplash.com/photo-1562613507-c5e0a2faab47?w=400&h=300&fit=crop", hostel: hostelNames[8], date: "2026-03-15" },
      ],
    },
  ],
};

// Module 12: Feedback (Restored)
export const feedbackData = {
  hostels: hostelNames.slice(0, 10).map((name, i) => ({
    key: i, hostelName: name, district: districts[i],
    inspectionDate: `2026-0${(i % 9) + 1}-${10 + i}`,
    inspector: ["Mr. Raj Kumar", "Mrs. Priya S", "Dr. Suresh M", "Ms. Anita R"][i % 4],
    overallRating: ["Excellent", "Good", "Satisfactory", "Needs Improvement"][i % 4],
    studentsPresent: [145, 162, 138, 175, 142, 168, 155, 149, 171, 137][i],
    staffPresent: [8, 6, 9, 7, 8, 5, 10, 7, 6, 8][i],
    cleanlinessScore: [8, 7, 9, 6, 8, 7, 9, 8, 7, 6][i],
    foodQuality: [7, 8, 7, 6, 9, 8, 7, 8, 6, 7][i],
    infrastructure: [8, 7, 8, 7, 7, 8, 9, 7, 8, 7][i],
    remarks: [
      "All records maintained properly", "Kitchen needs improvement",
      "Good overall condition", "CCTV installation pending",
      "Staff attendance records up to date", "Sanitation facilities adequate",
      "Excellent food quality and variety", "Medical kit needs replenishment",
      "Mattresses require replacement", "Security lighting improved",
    ][i],
  })),
};
