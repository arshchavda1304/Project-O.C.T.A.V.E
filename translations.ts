import { Language } from './types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  onlineStatus: string;
  offlineStatus: string;
  syncedSuccess: string;
  changesPendingSync: string;
  offlineModeNotice: string;
  testOfflineToggle: string;
  simulateOffline: string;
  returnToOnline: string;
  languageSelectLabel: string;
  audioSpeak: string;
  audioStop: string;
  audioPause?: string;
  audioResume?: string;
  audioPlaying?: string;
  backToHub: string;
  textSize: string;
  textSizeNormal: string;
  textSizeLarge: string;
  textSizeExtraLarge: string;

  // Portals
  portalPatientTitle: string;
  portalPatientSubtitle: string;
  portalCaregiverTitle: string;
  portalCaregiverSubtitle: string;
  portalDoctorTitle: string;
  portalDoctorSubtitle: string;

  // Patient Games Suite
  patientPortalHeader: string;
  patientPortalSubheader: string;
  modulePhotoQuiz: string;
  moduleSituationTest: string;
  moduleGridMatch: string;
  photoQuizDesc: string;
  situationTestDesc: string;
  gridMatchDesc: string;

  // Family Photo Quiz
  photoQuizTitle: string;
  photoQuizPromptPrefix: string;
  btnYes: string;
  btnNo: string;
  quizCorrectFeedback: string;
  quizGentleRetry: string;
  quizNextButton: string;
  quizScoreLabel: string;
  recognizingFamilyMember: string;
  uploadedPhotoBadge: string;
  customUploadedByCaregiver: string;

  // Situation Test
  situationTestTitle: string;
  situationPrompt1: string;
  situationOption1A: string;
  situationOption1B: string;
  situationPrompt2: string;
  situationOption2A: string;
  situationOption2B: string;
  situationPrompt3: string;
  situationOption3A: string;
  situationOption3B: string;
  situationCorrectFeedback: string;
  situationEncourageFeedback: string;
  nextScenarioBtn: string;

  // Regional Situation Scenarios
  asSitPrompt1: string; asSitOption1A: string; asSitOption1B: string;
  asSitPrompt2: string; asSitOption2A: string; asSitOption2B: string;
  asSitPrompt3: string; asSitOption3A: string; asSitOption3B: string;
  asSitPrompt4: string; asSitOption4A: string; asSitOption4B: string;
  asSitPrompt5: string; asSitOption5A: string; asSitOption5B: string;

  nagSitPrompt1: string; nagSitOption1A: string; nagSitOption1B: string;
  nagSitPrompt2: string; nagSitOption2A: string; nagSitOption2B: string;
  nagSitPrompt3: string; nagSitOption3A: string; nagSitOption3B: string;
  nagSitPrompt4: string; nagSitOption4A: string; nagSitOption4B: string;
  nagSitPrompt5: string; nagSitOption5A: string; nagSitOption5B: string;

  mniSitPrompt1: string; mniSitOption1A: string; mniSitOption1B: string;
  mniSitPrompt2: string; mniSitOption2A: string; mniSitOption2B: string;
  mniSitPrompt3: string; mniSitOption3A: string; mniSitOption3B: string;
  mniSitPrompt4: string; mniSitOption4A: string; mniSitOption4B: string;
  mniSitPrompt5: string; mniSitOption5A: string; mniSitOption5B: string;

  trpSitPrompt1: string; trpSitOption1A: string; trpSitOption1B: string;
  trpSitPrompt2: string; trpSitOption2A: string; trpSitOption2B: string;
  trpSitPrompt3: string; trpSitOption3A: string; trpSitOption3B: string;
  trpSitPrompt4: string; trpSitOption4A: string; trpSitOption4B: string;
  trpSitPrompt5: string; trpSitOption5A: string; trpSitOption5B: string;

  // Grid Memory Match
  gridMatchTitle: string;
  gridMatchInstruction: string;
  gridMoves: string;
  gridMatchesFound: string;
  gridCompleteTitle: string;
  gridCompleteDesc: string;
  gridResetBtn: string;
  cardTeaLeaf: string;
  cardGamosa: string;
  cardHornbill: string;
  cardBamboo: string;
  cardLotus: string;
  cardBrassBell: string;

  // Caregiver Portal
  caregiverHeader: string;
  caregiverSubheader: string;
  routineSectionTitle: string;
  routineSectionDesc: string;
  dailyCompletionRate: string;
  taskMorningMeds: string;
  taskHydration: string;
  taskNutritiousMeal: string;
  taskGentleWalk: string;
  taskEveningTea: string;
  taskNightRest: string;

  photoUploadSectionTitle: string;
  photoUploadSectionDesc: string;
  btnUploadPhoto: string;
  inputPhotoName: string;
  inputPhotoRelation: string;
  photoSyncSuccess: string;
  photoPreviewTitle: string;
  photoSyncedQuizNote: string;

  notesSectionTitle: string;
  notesSectionDesc: string;
  inputNotePlaceholder: string;
  btnSaveNote: string;
  btnNotifyDoctor: string;
  doctorNotifiedAlert: string;
  recentNotesList: string;
  categoryMood: string;
  categoryAppetite: string;
  categorySleep: string;
  categoryGeneral: string;

  // Doctor Dashboard
  doctorHeader: string;
  doctorSubheader: string;
  patientListTitle: string;
  stageLabel: string;
  riskStable: string;
  riskMonitoring: string;
  riskAttention: string;
  analyticsTitle: string;
  metricEngagement: string;
  metricMemory: string;
  metricAdherence: string;
  cognitiveTrendTitle: string;
  cognitiveTrendSub: string;
  last30Days: string;
  clinicalNotesTitle: string;
  clinicalNotesPlaceholder: string;
  btnSaveObservation: string;
  clinicalSavedSuccess: string;
  recentObservations: string;
  drSignature: string;

  // Role Selection & Login
  roleSelectionTitle: string;
  roleSelectionSub: string;
  rolePatientTitle: string;
  rolePatientSub: string;
  roleCaregiverTitle: string;
  roleCaregiverSub: string;
  roleDoctorTitle: string;
  roleDoctorSub: string;
  btnSelectRole: string;
  switchRole: string;
  loggedInAs: string;
  linkedPatientLabel: string;
  quickSelectAccount: string;

  // Caregiver Patient Setup & Profile
  profileSetupTitle: string;
  profileSetupSubtitle: string;
  fieldPatientName: string;
  fieldAge: string;
  fieldStateNE: string;
  fieldCityLocation: string;
  fieldMedicalStage: string;
  fieldEmergencyName: string;
  fieldEmergencyRelation: string;
  fieldEmergencyPhone: string;
  fieldEmergencyNotes: string;
  btnSavePatientProfile: string;
  profileSavedSuccess: string;

  // Privacy & Consent Permissions
  privacyConsentTitle: string;
  privacyConsentSub: string;
  registeredCaregivers: string;
  registeredDoctors: string;
  sharingEnabled: string;
  sharingDisabled: string;
  consentNotice: string;
  telemetrySuspendedNotice: string;
  guidePatientTest: string;
  guidePatientTestSub: string;
  tabProfileSetup: string;
  tabDailyRoutine: string;
  tabMemoryStudio: string;
  tabCaregiverLog: string;

  // Patient Portal Layout
  patientWelcomeGreeting: string;
  patientWelcomeSpeech: string;
  calmMemoryGym: string;
  listenAloud: string;
  exitSignOut: string;
  everyMemoryPrecious: string;

  // Login Screen
  loginSubtitle: string;
  loginRoleDoctor: string;
  loginRoleCaretaker: string;
  loginRolePatient: string;
  loginDescDoctor: string;
  loginDescCaretaker: string;
  loginDescPatient: string;
  loginEmailLabelPatient: string;
  loginEmailLabelStaff: string;
  loginPasswordLabel: string;
  loginPasswordLabelPatient: string;
  loginSignInAs: string;
  loginSignInDoctor: string;
  loginSignInCaretaker: string;
  loginSignInPatient: string;
  loginFooter: string;
  loginInvalidCredentials: string;
  loginReadGuidance: string;
  loginNERBadge: string;

  // Patient Portal hardcoded
  photoCountLabel: string;
  recognizedTodayLabel: string;
  addedByCaregiver: string;
  noFamilyPhotosTitle: string;
  noFamilyPhotosDesc: string;
  situationRegionLabel: string;
  situationStateLabel: string;
  situationQuestionLabel: string;
  situationWonderfulChoice: string;
  situationSafeDecision: string;
  moduleSubFamilyRecognition: string;
  moduleSubRegionalSafety: string;
  moduleSubHeritageMatch: string;
  gridPairsLabel: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "Project O.C.T.A.V.E.",
    appSubtitle: "AI-Powered Cognitive Care & Remote Support for the North Eastern Region",
    tagline: "Accessible, high-contrast, offline-first dementia support for our elders",
    onlineStatus: "Cloud Synced",
    offlineStatus: "Offline Mode (Local Storage)",
    syncedSuccess: "All offline records successfully synchronized!",
    changesPendingSync: "records stored locally pending sync",
    offlineModeNotice: "Working smoothly offline. No internet required in remote hills and villages.",
    testOfflineToggle: "Simulate Network Status",
    simulateOffline: "Switch to Offline Mode",
    returnToOnline: "Reconnect & Sync Data",
    languageSelectLabel: "Language / ভাষা",
    audioSpeak: "Listen Aloud",
    audioStop: "Pause Audio",
    backToHub: "← Return to Main Hub",
    textSize: "Text Size",
    textSizeNormal: "A",
    textSizeLarge: "A+",
    textSizeExtraLarge: "A++",

    portalPatientTitle: "Patient Portal",
    portalPatientSubtitle: "Calm, gentle cognitive memory games and family recognition activities",
    portalCaregiverTitle: "Caregiver Portal",
    portalCaregiverSubtitle: "Daily routine checklist, family photo syncing, and clinical alert center",
    portalDoctorTitle: "Doctor Dashboard",
    portalDoctorSubtitle: "Remote clinical analytics, 30-day cognitive trends, and patient observations",

    patientPortalHeader: "Welcome to Gentle Cognitive Exercises",
    patientPortalSubheader: "Take your time. There are no timers, no rush, and every effort is celebrated.",
    modulePhotoQuiz: "Family Photo Quiz",
    moduleSituationTest: "Daily Logic & Safety",
    moduleGridMatch: "Calm Memory Match",
    photoQuizDesc: "Recognize beloved family members with gentle voice guidance",
    situationTestDesc: "Everyday decisions and practical household awareness",
    gridMatchDesc: "Peaceful visual matching with familiar regional heritage symbols",

    photoQuizTitle: "Family Recognition Quiz",
    photoQuizPromptPrefix: "Is this your",
    btnYes: "YES",
    btnNo: "NO",
    quizCorrectFeedback: "Correct! Great job! Wonderful memory!",
    quizGentleRetry: "You did wonderfully trying! Let us look closely together.",
    quizNextButton: "Next Family Member →",
    quizScoreLabel: "Family Members Recognized Today",
    recognizingFamilyMember: "Family Member Photo",
    uploadedPhotoBadge: "Synced from Caregiver",
    customUploadedByCaregiver: "Caregiver uploaded memory",

    situationTestTitle: "Practical Daily Logic Test",
    situationPrompt1: "You are going outside of your house. What should you do before leaving?",
    situationOption1A: "Lock Front Door Safely",
    situationOption1B: "Turn On the Television",
    situationPrompt2: "Dark rain clouds are gathering over the hills. What should you carry?",
    situationOption2A: "Take Umbrella with You",
    situationOption2B: "Take a Paper Fan",
    situationPrompt3: "It is 8:00 AM breakfast and medication time. What should you drink?",
    situationOption3A: "Drink Warm Clean Water",
    situationOption3B: "Drink Ice Cold Soda",
    situationCorrectFeedback: "Excellent practical choice! Very safe and thoughtful.",
    situationEncourageFeedback: "Good try! Locking the door and staying safe keeps home peaceful.",
    nextScenarioBtn: "Next Practical Scenario →",

    // Regional Scenarios - Assam
    asSitPrompt1: "It is 7:30 AM in your Assam home. The kettle is whistling for morning Ronga Saah (red tea). What should you do first?",
    asSitOption1A: "Safely turn off the gas stove with a dry cloth before pouring",
    asSitOption1B: "Touch the red-hot burner with bare wet fingers",
    asSitPrompt2: "Sudden monsoon rain has started in Kamrup. You need to step outside to the local Namghar / bazaar. What should you take?",
    asSitOption2A: "Take your big umbrella (Chhati) and wear non-slip sandals",
    asSitOption2B: "Walk barefoot on the slippery red clay mud by the road",
    asSitPrompt3: "After lunch, the afternoon heat in Guwahati is rising. Your eyes feel tired and heavy. What is the safest choice?",
    asSitOption3A: "Drink a glass of water and rest comfortably on your cool bed",
    asSitOption3B: "Walk into direct scorching sun on the highway without a hat",
    asSitPrompt4: "Your caregiver placed your morning Donepezil tablet next to your glass of water on the table. What should you do?",
    asSitOption4A: "Take the tablet with a full glass of water as usual",
    asSitOption4B: "Skip the tablet since you already had morning Ronga Saah",
    asSitPrompt5: "It is evening Bihu time and you hear someone knocking at your front door. You do not recognize the voice. What should you do?",
    asSitOption5A: "Call out to ask who it is and wait for your caregiver before opening",
    asSitOption5B: "Immediately open the door wide to any unknown stranger",

    // Regional Scenarios - Nagaland
    nagSitPrompt1: "You are stepping out for a morning walk in Mokokchung / Kohima on a misty, steep hill slope. How should you step?",
    nagSitOption1A: "Wear firm grip shoes and lean on your bamboo walking cane",
    nagSitOption1B: "Wear smooth flat plastic slippers on the wet steep slope",
    nagSitPrompt2: "In the traditional kitchen, firewood in the hearth (Meka) is smoking heavily. What should you do right away?",
    nagSitOption2A: "Open the wooden window slit to let the smoke vent outside safely",
    nagSitOption2B: "Shut all doors and windows tightly and breathe in the dense smoke",
    nagSitPrompt3: "The sun has set behind the Naga hills and cold mountain wind is blowing through the porch. What should you do?",
    nagSitOption3A: "Wrap your warm Naga woolen shawl and sip hot boiled water indoors",
    nagSitOption3B: "Sit outside in a thin vest directly in the freezing mountain wind",
    nagSitPrompt4: "After eating your morning meal of Galho (rice porridge) in Dimapur, your mouth feels very dry. What is the right thing to do?",
    nagSitOption4A: "Drink a clean cup of boiled or filtered water slowly",
    nagSitOption4B: "Drink unfiltered rainwater collected in the open barrel outside",
    nagSitPrompt5: "During the Hornbill Festival week, a kerosene lamp is left burning on your wooden table. You are going to sleep. What should you do?",
    nagSitOption5A: "Blow out the lamp carefully and place it on the stone floor before sleeping",
    nagSitOption5B: "Leave the lamp burning on the wooden table through the night",

    // Regional Scenarios - Manipur
    mniSitPrompt1: "Monsoon showers have left the courtyard stones in Imphal covered with green moss. How should you walk outside?",
    mniSitOption1A: "Hold the bamboo rail and place each foot deliberately and flatly",
    mniSitOption1B: "Run quickly across the moss without looking down",
    mniSitPrompt2: "Evening prayers at the Sanamahi prayer corner are finished. The oil lamp (Meira) is glowing. What is the safe step?",
    mniSitOption2A: "Check that the lamp is stable and kept safely clear of hanging cloth",
    mniSitOption2B: "Drape a dry cotton towel directly on top of the burning lamp",
    mniSitPrompt3: "You have finished your morning meal with warm Kanghou. Your throat feels dry. What should you drink?",
    mniSitOption3A: "Drink a clean bell-metal glass of warm boiled water",
    mniSitOption3B: "Avoid drinking any water for the entire day",
    mniSitPrompt4: "You are visiting Loktak Lake with family. It is midday and very sunny. What should you carry?",
    mniSitOption4A: "Wear your wide-brimmed hat and carry your water bottle",
    mniSitOption4B: "Stand in the midday sun without a hat or water for two hours",
    mniSitPrompt5: "At night in Imphal, the electricity has gone off (load-shedding). You want to use the bathroom. What is the safest step?",
    mniSitOption5A: "Take your torch light and walk slowly holding the wall",
    mniSitOption5B: "Run in full darkness across the room quickly",

    // Regional Scenarios - Tripura
    trpSitPrompt1: "You are walking out into the courtyard in Agartala with morning dew on the bamboo walkway. How do you step?",
    trpSitOption1A: "Step carefully along the dry central path with rubber sandals",
    trpSitOption1B: "Run fast across the wet slippery bamboo poles",
    trpSitPrompt2: "At 5:00 PM the sun sets quickly in Tripura. The verandah gets dark and shadows look confusing (sundowning). What should you do?",
    trpSitOption2A: "Switch on the warm verandah lights and sit comfortably with family",
    trpSitOption2B: "Sit alone in pitch darkness without turning on any lights",
    trpSitPrompt3: "Your caregiver has placed your morning tablet with a cup on the dining table. What should you do?",
    trpSitOption3A: "Take the morning tablet with a full cup of fresh water",
    trpSitOption3B: "Throw the tablet into the waste bin",
    trpSitPrompt4: "During Durga Puja celebrations in Agartala, a neighbour hands you a lighted diya (clay lamp). What should you do?",
    trpSitOption4A: "Hold it carefully with both hands and place it steadily on the floor",
    trpSitOption4B: "Carry it carelessly with one finger and wave it near curtains",
    trpSitPrompt5: "After morning Mui Borok rice and vegetables, you feel dizzy. Your caregiver is in the next room. What is the first thing to do?",
    trpSitOption5A: "Sit down immediately and call out to your caregiver for help",
    trpSitOption5B: "Walk fast to the market alone without telling anyone",

    gridMatchTitle: "Gentle Symbol Matching",
    gridMatchInstruction: "Tap two cards to find matching regional heritage symbols. No rush.",
    gridMoves: "Taps",
    gridMatchesFound: "Pairs Found",
    gridCompleteTitle: "Wonderful job! You matched all regional symbols!",
    gridCompleteDesc: "Your focus and memory are shining brightly today.",
    gridResetBtn: "Play Another Calm Round",
    cardTeaLeaf: "Assam Tea Leaf",
    cardGamosa: "Traditional Gamosa",
    cardHornbill: "Hornbill Feather",
    cardBamboo: "Bamboo Grove",
    cardLotus: "Loktak Lotus",
    cardBrassBell: "Temple Bell",

    caregiverHeader: "Caregiver Care & Coordination Dashboard",
    caregiverSubheader: "Manage daily well-being, upload memory photos for games, and notify medical teams.",
    routineSectionTitle: "Daily Well-being & Care Checklist",
    routineSectionDesc: "Check off items as completed. Progress updates automatically and stores offline.",
    dailyCompletionRate: "Daily Completion",
    taskMorningMeds: "Morning Prescribed Medicine & BP Check",
    taskHydration: "Hydration: Drink 2 Glasses of Fresh Water",
    taskNutritiousMeal: "Midday Meal with Fresh Greens & Lentils",
    taskGentleWalk: "15-Minute Calm Walk in Garden / Verandah",
    taskEveningTea: "Warm Tulsi or Herbal Tea & Relaxation",
    taskNightRest: "Evening Calming Routine & Sleep Prep",

    photoUploadSectionTitle: "Family Photo Memory Uploader",
    photoUploadSectionDesc: "Upload photos of children, grandchildren, and relatives. They instantly appear in the patient's quiz!",
    btnUploadPhoto: "+ Upload Family Photo",
    inputPhotoName: "Family Member Name (e.g. Rahul, Sunita)",
    inputPhotoRelation: "Relationship (e.g. Son, Daughter, Granddaughter)",
    photoSyncSuccess: "Photo synced instantly to patient's recognition game!",
    photoPreviewTitle: "Active Family Memory Bank",
    photoSyncedQuizNote: "Now active in Patient Photo Quiz",

    notesSectionTitle: "Caregiver Observations & Doctor Alert Center",
    notesSectionDesc: "Log daily changes in mood, appetite, or sleep. Directly notify the regional physician.",
    inputNotePlaceholder: "Type notes on patient mood, sleep pattern, or cognitive clarity today...",
    btnSaveNote: "Save Local Observation",
    btnNotifyDoctor: "Notify Consulting Physician Now",
    doctorNotifiedAlert: "Physician Dr. Baruah has been alerted via encrypted regional relay!",
    recentNotesList: "Recorded Caregiver Logs",
    categoryMood: "Mood",
    categoryAppetite: "Appetite",
    categorySleep: "Sleep",
    categoryGeneral: "General Care",

    doctorHeader: "Clinical Tele-Care & Cognitive Analytics",
    doctorSubheader: "Longitudinal cognitive monitoring across North Eastern districts, offline-synced.",
    patientListTitle: "Registered Regional Patients",
    stageLabel: "Cognitive Stage",
    riskStable: "Stable",
    riskMonitoring: "Monitoring Needed",
    riskAttention: "Attention Required",
    analyticsTitle: "Clinical Performance Metrics",
    metricEngagement: "Weekly Engagement Rate",
    metricMemory: "Memory Retention Accuracy",
    metricAdherence: "Care Routine Adherence",
    cognitiveTrendTitle: "30-Day Longitudinal Cognitive Trend",
    cognitiveTrendSub: "Composite score based on daily photo quiz, situation logic, and routine adherence",
    last30Days: "Past 30 Days (Score / 100)",
    clinicalNotesTitle: "Clinical Notes & Physician Directives",
    clinicalNotesPlaceholder: "Enter clinical assessment, dosage adjustment, or speech therapy recommendations...",
    btnSaveObservation: "Save to Patient Record",
    clinicalSavedSuccess: "Clinical observation appended to patient file and saved offline!",
    recentObservations: "Patient Longitudinal Clinical Record",
    drSignature: "Dr. P. Baruah, MD (Neurology) • Guwahati Regional Medical Centre",

    roleSelectionTitle: "Role-Based Access Portal",
    roleSelectionSub: "Select your dedicated interface tailored for Elderly Patients, Family Caregivers, or Medical Professionals",
    rolePatientTitle: "Elder / Patient Portal",
    rolePatientSub: "Calm, gentle memory exercises and daily logic tests with zero distractions.",
    roleCaregiverTitle: "Family Caregiver Portal",
    roleCaregiverSub: "Manage patient profile, daily care checklist, family photo sync, and doctor alerts.",
    roleDoctorTitle: "Doctor / Clinical Portal",
    roleDoctorSub: "Multi-patient longitudinal analytics, 30-day cognitive trends, and clinical directives.",
    btnSelectRole: "Enter Portal",
    switchRole: "Switch User / Role",
    loggedInAs: "Logged in as",
    linkedPatientLabel: "Linked Patient",
    quickSelectAccount: "Select Account",

    profileSetupTitle: "Patient Setup & Profile Record",
    profileSetupSubtitle: "Manage patient personal details, North Eastern region home, and emergency contacts",
    fieldPatientName: "Patient Full Name",
    fieldAge: "Age (Years)",
    fieldStateNE: "North Eastern State",
    fieldCityLocation: "District / City / Village",
    fieldMedicalStage: "Cognitive Impairment Stage",
    fieldEmergencyName: "Primary Emergency Contact",
    fieldEmergencyRelation: "Relationship to Patient",
    fieldEmergencyPhone: "Emergency Phone",
    fieldEmergencyNotes: "Care Instructions & Health Alerts",
    btnSavePatientProfile: "Save Patient Record Changes",
    profileSavedSuccess: "Patient record & consent permissions saved successfully offline!",

    privacyConsentTitle: "Privacy & Telemetry Sharing Permissions",
    privacyConsentSub: "Patient-managed consent: Control who is authorized to view real-time cognitive telemetry and clinical data",
    registeredCaregivers: "Registered Caregivers",
    registeredDoctors: "Registered Medical Providers",
    sharingEnabled: "Telemetry Sharing Active",
    sharingDisabled: "Sharing Paused",
    consentNotice: "In accordance with National Digital Health (ABDM) patient privacy regulations, revoking permission immediately suspends telemetry data transmission to the provider.",
    telemetrySuspendedNotice: "Patient Telemetry Access Paused: The patient or primary caregiver has paused data sharing permissions for this doctor.",
    guidePatientTest: "Guide Patient in Exercises",
    guidePatientTestSub: "Launch today's cognitive memory session right from your device",
    tabProfileSetup: "Patient Profile & Consent",
    tabDailyRoutine: "Daily Routine Checklist",
    tabMemoryStudio: "Family Photo Studio",
    tabCaregiverLog: "Caregiver Notes & Alert",

    // Patient Portal Layout
    patientWelcomeGreeting: "Welcome",
    patientWelcomeSpeech: "Welcome. Take your time with today's calm memory exercises. There is no rush.",
    calmMemoryGym: "Calm Cognitive Memory Gym",
    listenAloud: "Listen Aloud",
    exitSignOut: "Exit / Sign Out",
    everyMemoryPrecious: "Every memory is precious. Take your time, rest whenever you wish.",

    // Login Screen
    loginSubtitle: "Secure Role-Based Authentication Portal",
    loginRoleDoctor: "Medical Doctor",
    loginRoleCaretaker: "Family Caretaker",
    loginRolePatient: "Elder Patient",
    loginDescDoctor: "Doctor Clinical Portal: Review multiple patient files across North East India, evaluate 30-day cognitive trends, and write clinical directives.",
    loginDescCaretaker: "Caretaker Management Portal: Setup patient profile, update medical and emergency info, manage routine checklist, and control consent sharing.",
    loginDescPatient: "Elderly Patient Portal: Calm, distraction-free memory gym with family photos, daily safety scenarios, and North East heritage matching.",
    loginEmailLabelPatient: "Patient Email or Access ID (e.g. RAMESH74)",
    loginEmailLabelStaff: "Official Email Address",
    loginPasswordLabel: "Password",
    loginPasswordLabelPatient: "Password or 4-Digit PIN",
    loginSignInAs: "Sign In as",
    loginSignInDoctor: "Doctor",
    loginSignInCaretaker: "Caretaker",
    loginSignInPatient: "Patient",
    loginFooter: "Role Isolation & ABDM Consent Compliant • 100% Offline-Ready",
    loginInvalidCredentials: "Invalid credentials. Please check your email/ID and password.",
    loginReadGuidance: "Login to your portal. Choose Doctor, Caretaker, or Patient role and enter your credentials.",
    loginNERBadge: "North Eastern Region Multi-User Tele-Care System",

    // Patient Portal hardcoded
    photoCountLabel: "Photo",
    recognizedTodayLabel: "Recognized Today",
    addedByCaregiver: "Added by Caregiver",
    noFamilyPhotosTitle: "No Family Photos Added Yet",
    noFamilyPhotosDesc: "Your family caregiver can upload familiar photos and memories from the Caretaker Portal to practice recognition.",
    situationRegionLabel: "Region",
    situationStateLabel: "State",
    situationQuestionLabel: "Question",
    situationWonderfulChoice: "Wonderful Choice!",
    situationSafeDecision: "Safe & healthy decision for your home.",
    moduleSubFamilyRecognition: "Family Recognition",
    moduleSubRegionalSafety: "Regional Safety & Reaction",
    moduleSubHeritageMatch: "Heritage Symbol Match",
    gridPairsLabel: "Pairs",
  },

  as: {
    appName: "অসমীয়া স্বাস্থ্য-সেৱা (Project O.C.T.A.V.E.)",
    appSubtitle: "উত্তৰ-পূৰ্বাঞ্চলৰ জ্যেষ্ঠসকলৰ বাবে এআই-চালিত স্মৃতি যত্ন আৰু দূৰৱৰ্তী সহায়",
    tagline: "অসম আৰু উত্তৰ-পূবৰ প্ৰবীণসকলৰ বাবে সহজে বুজিব পৰা অফলাইন স্মৃতি সহায়ক",
    onlineStatus: "ক্লাউড সংযুক্ত",
    offlineStatus: "অফলাইন ব্যৱস্থা (স্থানিক সঞ্চয়)",
    syncedSuccess: "সকলো অফলাইন তথ্য সফলভাৱে সংযোগ কৰা হ'ল!",
    changesPendingSync: "তথ্য সংৰক্ষণ হৈ আছে (সংযোগ হ'লে পঠোৱা হ'ব)",
    offlineModeNotice: "ইণ্টাৰনেট অবিহনেও কাম কৰিব। পাহাৰ আৰু গাঁও অঞ্চলত সম্পূৰ্ণ সক্ৰিয়।",
    testOfflineToggle: "ইণ্টাৰনেট অৱস্থা পৰীক্ষা",
    simulateOffline: "অফলাইন মোডলৈ যাওক",
    returnToOnline: "অনলাইন সংযোগ কৰক",
    languageSelectLabel: "ভাষা / Language",
    audioSpeak: "শুনি লওক",
    audioStop: "বন্ধ কৰক",
    backToHub: "← মূল কেন্দ্ৰলৈ উভতি যাওক",
    textSize: "আখৰৰ আকাৰ",
    textSizeNormal: "ক",
    textSizeLarge: "ক+",
    textSizeExtraLarge: "ক++",

    portalPatientTitle: "ৰোগীৰ কোঠা (Patient Portal)",
    portalPatientSubtitle: "শান্তিপূৰ্ণ স্মৃতি খেল আৰু পৰিয়ালৰ চিনাকি কাৰ্যসূচী",
    portalCaregiverTitle: "যত্নকাৰীৰ ডেশ্ববৰ্ড (Caregiver)",
    portalCaregiverSubtitle: "দৈনন্দিন কামৰ তালিকা, ছবি সংযোজন আৰু ডাক্তৰলৈ খবৰ",
    portalDoctorTitle: "চিকিৎসকৰ ডেশ্ববৰ্ড (Doctor)",
    portalDoctorSubtitle: "স্মৃতি পৰীক্ষাৰ ফলাফল, ৩০ দিনৰ অগ্ৰগতি আৰু পৰামৰ্শ",

    patientPortalHeader: "আদৰণি! শান্তভাৱে স্মৃতি অনুশীলন কৰক",
    patientPortalSubheader: "কোনো খৰখেদা নাই, কোনো সময়ৰ সীমা নাই। সকলো প্ৰচেষ্টাই প্ৰশংসনীয়।",
    modulePhotoQuiz: "পৰিয়ালৰ ফটো খেল",
    moduleSituationTest: "দৈনন্দিন বিবেচনা খেল",
    moduleGridMatch: "শান্ত স্মৃতি খেল",
    photoQuizDesc: "মৰমৰ আত্মীয়ক মাত শুনি চিনি উলিওৱাৰ খেল",
    situationTestDesc: "দৈনন্দিন জীৱনৰ সহজ আৰু নিৰাপদ সিদ্ধান্ত",
    gridMatchDesc: "অসমীয়া সংস্কৃতিৰ চিনবোৰ মিলাই মন সতেজ কৰক",

    photoQuizTitle: "পৰিয়ালৰ সদস্য চিনাক্তকৰণ",
    photoQuizPromptPrefix: "এইজন আপোনাৰ",
    btnYes: "হয় (YES)",
    btnNo: "নহয় (NO)",
    quizCorrectFeedback: "বৰ সুন্দৰ! একদম শুদ্ধ উত্তৰ! আপোনাৰ স্মৃতি চমৎকার!",
    quizGentleRetry: "আপুনি বহুত ভাল চেষ্টা কৰিলে! আহক আমি আকৌ মন দি চাওঁ।",
    quizNextButton: "পৰৱৰ্তী পৰিয়ালৰ সদস্য →",
    quizScoreLabel: "আজি চিনি পোৱা পৰিয়ালৰ সদস্য",
    recognizingFamilyMember: "পৰিয়ালৰ ছবি",
    uploadedPhotoBadge: "ঘৰৰ মানুহে যোগ কৰা",
    customUploadedByCaregiver: "যত্নকাৰীয়ে যোগ কৰা ফটো",

    situationTestTitle: "দৈনন্দিন নিৰাপত্তা আৰু বিবেচনা",
    situationPrompt1: "আপুনি ঘৰৰ পৰা বাহিৰলৈ ওলাই যাব খুজিছে। ওলোৱাৰ আগতে কি কৰিব লাগে?",
    situationOption1A: "ঘৰৰ দুৱাৰখন ভালদৰে বন্ধ কৰক",
    situationOption1B: "টেলিভিছনটো চলাই থৈ যাওক",
    situationPrompt2: "আকাশত কলা মেঘ দেখা গৈছে, বৰষুণ আহিব পাৰে। হাতত কি ল'ব?",
    situationOption2A: "লগত ছাতি লৈ যাওক",
    situationOption2B: "হাতৰ বিচনীখন লওক",
    situationPrompt3: "ৰাতিপুৱা ৮ বজাত চাহ আৰু দৰৱ খোৱাৰ সময় হৈছে। কি খাব লাগে?",
    situationOption3A: "উমাল পৰিষ্কাৰ পানী খাব লাগে",
    situationOption3B: "বৰফৰ ঠাণ্ডা পানীয় খাব লাগে",
    situationCorrectFeedback: "বৰ বুদ্ধিমানৰ কাম! আপোনাৰ সিদ্ধান্ত অতি নিৰাপদ।",
    situationEncourageFeedback: "ভাল চিন্তা! দুৱাৰ বন্ধ কৰিলে ঘৰ নিৰাপদ থাকে।",
    nextScenarioBtn: "পৰৱৰ্তী প্ৰশ্নলৈ যাওক →",

    // Regional Scenarios - Assam
    asSitPrompt1: "ৰাতিপুৱা ৭:৩০ বজাত ঘৰত ৰঙা চাহৰ কেটলিটোৰ হুইচেল বাজিছে। আপুনি প্ৰথমে কি কৰিব লাগে?",
    asSitOption1A: "চাহ বাকিবলৈ লোৱাৰ আগতে শুকান কাপোৰেৰে গেছৰ ষ্টোভটো বন্ধ কৰক",
    asSitOption1B: "তপত বাৰ্ণাৰটো তিতা হাতেৰে চুবলৈ চেষ্টা কৰক",
    asSitPrompt2: "কামৰূপত হঠাতে বৰষুণ আৰম্ভ হৈছে। ওচৰৰ নামঘৰ বা বজাৰলৈ ওলাই যাব লাগে। হাতত কি ল'ব?",
    asSitOption2A: "লগত এখন ডাঙৰ ছাতি লওক আৰু পিচল নোখোৱা চেণ্ডেল পিন্ধক",
    asSitOption2B: "ৰাস্তাৰ পিচল ৰঙা মাটিৰ ওপৰত খালী ভৰিৰে খোজ কাঢ়ক",
    asSitPrompt3: "দুপৰীয়াৰ সাজ খোৱাৰ পাছত গুৱাহাটীত গৰম বাঢ়িছে আৰু চকু ক্লান্ত লাগিছে। আটাইতকৈ নিৰাপদ উপায় কি?",
    asSitOption3A: "এগিলাচ পানী খাই শীতল বিছনাত শুই জিৰণি লওক",
    asSitOption3B: "টুপী নোলোৱাকৈ ৰ'দত ৰাজপথলৈ ওলাই যাওক",
    asSitPrompt4: "মেজত পানীৰ গিলাচৰ কাষত ৰাতিপুৱাৰ ডনেপেজিল দৰৱৰ টেবলেটটো ৰখা আছে। আপুনি কি কৰিব লাগে?",
    asSitOption4A: "নিয়ম অনুসৰি এগিলাচ সম্পূৰ্ণ পানীৰে টেবলেটটো খাওক",
    asSitOption4B: "ৰঙা চাহ খালোঁ বাবে দৰৱ খোৱাৰ পৰা বিৰত থাকক",
    asSitPrompt5: "গধূলি বিহুৰ সময়ত দুৱাৰত কোনোবাই টোকৰ দিয়া শুনিলে, কিন্তু কণ্ঠস্বৰ অচিনাকি যেন লাগিছে। কি কৰিব?",
    asSitOption5A: "কোন হয় সুধক আৰু যত্নকাৰী আহি নোপোৱালৈকে দুৱাৰখন খুলি নিদিব",
    asSitOption5B: "অচিনাকি ব্যক্তিৰ বাবে লগে লগে দুৱাৰখন সম্পূৰ্ণ খুলি দিয়ক",

    // Regional Scenarios - Nagaland
    nagSitPrompt1: "মককচাং বা কোহিমাত কুঁৱলী আৰু থিয় পাহাৰীয়া ৰাস্তাত ৰাতিপুৱাৰ খোজ কাঢ়িবলৈ ওলাইছে। কেনেকৈ খোজ দিব?",
    nagSitOption1A: "ভাল গ্ৰীপ থকা জোতা পিন্ধক আৰু বাঁহৰ লাঠীত ভৰ দি খোজ কাঢ়ক",
    nagSitOption1B: "পিচল থিয় ৰাস্তাত তিতা পাতল প্লাষ্টিকৰ চেন্দেল পিন্ধি খোজ কাঢ়ক",
    nagSitPrompt2: "পৰম্পৰাগত পাকঘৰত জুহালৰ খৰিয়ে বৰকৈ ধোঁৱা ওলাইছে। লগে লগে কি কৰিব লাগে?",
    nagSitOption2A: "ধোঁৱা বাহিৰ ওলাই যাবলৈ কাঠৰ খিৰিকীখন খুলি দিয়ক",
    nagSitOption2B: "সকলো দুৱাৰ-খিৰিকী টানকৈ বন্ধ কৰি ঘন ধোঁৱা উশাহত লওক",
    nagSitPrompt3: "পাহাৰৰ পিছফালে বেলি লহিয়াইছে আৰু বাৰান্দাত শীতল বতাহ বলিছে। কি কৰা উচিত?",
    nagSitOption3A: "উমাল নাগা শালখন মেৰিয়াই লওক আৰু ঘৰৰ ভিতৰত গৰম পানী খাওক",
    nagSitOption3B: "শীতল বতাহত পাতল কাপোৰ পিন্ধি বাহিৰত বহি থাকক",
    nagSitPrompt4: "পুৱা ডিমাপুৰত গালহো খোৱাৰ পাছত মুখ শুকাই গৈছে। কি কৰাটো সঠিক হ'ব?",
    nagSitOption4A: "এক কাপ পৰিষ্কাৰ উতলোৱা বা ফিল্টাৰ কৰা পানী লাহে লাহে খাওক",
    nagSitOption4B: "বাহিৰৰ মুকলি ড্ৰামত থকা অপৰিষ্কাৰ বৰষুণৰ পানী খাওক",
    nagSitPrompt5: "হৰ্ণবিল উৎসৱৰ সময়ত কাঠৰ মেজত কেৰাচিনৰ চাকি জ্বলি আছে। শুবলৈ যোৱাৰ আগতে কি কৰিব লাগে?",
    nagSitOption5A: "চাকিটো সাৱধানে নুমুৱাই মজিয়াত নিৰাপদে ৰাখক",
    nagSitOption5B: "গোটেই ৰাতি কাঠৰ মেজতে চাকিটো জ্বলাই থৈ দিয়ক",

    // Regional Scenarios - Manipur
    mniSitPrompt1: "বৰষুণৰ বাবে ইম্ফলৰ চোতালৰ শিলবোৰত শেলাই লাগি পিচল হৈ পৰিছে। বাহিৰত কেনেকৈ খোজ দিব লাগে?",
    mniSitOption1A: "বাঁহৰ ৰেলিংখনত ধৰি ভৰি দুখন সাৱধানে আৰু সমানকৈ পেলাই খোজ কাঢ়ক",
    mniSitOption1B: "তললৈ নোচোৱাকৈ শেলাইৰ ওপৰেৰে দৌৰি যাওক",
    mniSitPrompt2: "সানামাহী প্ৰাৰ্থনা স্থানত সন্ধিয়াৰ আৰাধনা শেষ হ'ল। তেলৰ চাকি (মৈৰা) জ্বলি আছে। নিৰাপদ পদক্ষেপ কি?",
    mniSitOption2A: "চাকিটো কোনো কাপোৰত নালাগাকৈ সুৰক্ষিতভাৱে ৰখা হৈছে নে নাই পৰীক্ষা কৰক",
    mniSitOption2B: "জ্বলি থকা চাকিটোৰ ঠিক ওপৰতে শুকান কপাহী গামোচা এখন জাপি দিয়ক",
    mniSitPrompt3: "ৰাতিপুৱা গৰম কাংহৌৰ সৈতে আহাৰ খোৱা হ'ল। ডিঙি শুকাই গৈছে। কি খোৱা উচিত?",
    mniSitOption3A: "কাঁহৰ গিলাচত এক গিলাচ পৰিষ্কাৰ উমাল উতলোৱা পানী খাওক",
    mniSitOption3B: "গোটেই দিনটো অকণো পানী নোখোৱাকৈ থাকক",
    mniSitPrompt4: "পৰিয়ালৰ সৈতে লোকটাক হ্ৰদ চাবলৈ আহিছে। দুপৰীয়া বৰ ৰ'দ দিছে। লগত কি নিব লাগে?",
    mniSitOption4A: "টুপী পিন্ধক আৰু লগত খোৱা পানীৰ বটল লওক",
    mniSitOption4B: "টুপী বা পানী অবিহনে দুঘণ্টা প্ৰখৰ ৰ'দত থিয় হৈ থাকক",
    mniSitPrompt5: "ইম্ফলত ৰাতি বিদ্যুৎ নাইকিয়া হৈছে। শৌচালয়লৈ যাব লাগে। আটাইতকৈ নিৰাপদ উপায় কি?",
    mniSitOption5A: "হাতত টৰ্চ লাইট লওক আৰু বেৰত ধৰি লাহে লাহে খোজ কাঢ়ক",
    mniSitOption5B: "ঘিটমিট আন্ধাৰৰ মাজতে কোঠাৰ মাজেৰে দৌৰি যাওক",

    // Regional Scenarios - Tripura
    trpSitPrompt1: "আগৰতলাত ৰাতিপুৱাৰ নিয়ৰে বাঁহৰ দলংখন পিচল কৰি তুলিছে। আপুনি কেনেকৈ খোজ দিব?",
    trpSitOption1A: "ৰবৰৰ চেন্দেল পিন্ধি শুকান মাজভাগৰ পথেৰে সাৱধানে খোজ কাঢ়ক",
    trpSitOption1B: "তিতা পিচল বাঁহৰ ওপৰেৰে খৰখেদাকৈ দৌৰি যাওক",
    trpSitPrompt2: "ত্ৰিপুৰাত আবেলি ৫ বজাত সোনকালে বেলি লহিয়াই বাৰান্দাত ছাঁ পৰে। এনে সময়ত কি কৰা উচিত?",
    trpSitOption2A: "বাৰান্দাৰ লাইটবোৰ জ্বলাই লওক আৰু পৰিয়ালৰ সৈতে শান্তভাৱে বহক",
    trpSitOption2B: "কোনো লাইট নজ্বলোৱাকৈ অন্ধকাৰত অকলে বহি থাকক",
    trpSitPrompt3: "যত্নকাৰীয়ে মেজত এগিলাচ পানীৰ সৈতে পুৱাৰ দৰৱৰ টেবলেটটো ৰাখিছে। কি কৰা উচিত?",
    trpSitOption3A: "এক কাপ পৰিষ্কাৰ পানীৰ সৈতে পুৱাৰ টেবলেটটো নিয়মমতে খাওক",
    trpSitOption3B: "টেবলেটটো আৱৰ্জনাৰ বাল্টিত পেলাই দিয়ক",
    trpSitPrompt4: "দুৰ্গা পূজাৰ সময়ত ওচৰ-চুবুৰীয়াই আপোনাক এখন জ্বলি থকা মাটিৰ চাকি দিলে। কি কৰিব লাগে?",
    trpSitOption4A: "দুয়োহাতেৰে সাৱধানে ধৰি মজিয়াত নিৰাপদে সুস্থিৰভাৱে ৰাখক",
    trpSitOption4B: "এখন আঙুলিৰে ধৰি পৰ্দাৰ কাষত জোকাৰি থাকক",
    trpSitPrompt5: "পুৱা মুই বৰক খোৱাৰ পাছত মূৰ ঘূৰোৱা যেন লাগিছে আৰু যত্নকাৰী কাষৰ কোঠাতে আছে। প্ৰথমতে কি কৰিব?",
    trpSitOption5A: "লগে লগে বহি পৰক আৰু সহায়ৰ বাবে যত্নকাৰীক মাত দিয়ক",
    trpSitOption5B: "কাকো নকৈ অকলেই বজাৰলৈ খৰখেদাকৈ ওলাই যাওক",

    gridMatchTitle: "সাংস্কৃতিক প্ৰতীক মিলোৱা খেল",
    gridMatchInstruction: "দুখন কাৰ্ডত টিপি একে প্ৰতীকবোৰ মিলাওক। কোনো চিন্তা নকৰিব।",
    gridMoves: "টিপাৰ সংখ্যা",
    gridMatchesFound: "মিলা জোৰা",
    gridCompleteTitle: "বৰ আনন্দৰ কথা! আপুনি সকলো প্ৰতীক মিলাই পেলালে!",
    gridCompleteDesc: "আজি আপোনাৰ মন আৰু স্মৃতি অতি উজ্জ্বল হৈ উঠিছে।",
    gridResetBtn: "আকৌ এফেৰি খেলক",
    cardTeaLeaf: "অসমৰ চাহ পাত",
    cardGamosa: "ফুলাম গামোচা",
    cardHornbill: "ধনেশ পক্ষীৰ পাখি",
    cardBamboo: "বাঁহ গছ",
    cardLotus: "পদুম ফুল",
    cardBrassBell: "কাঁহৰ ঘণ্টা",

    caregiverHeader: "যত্নকাৰীৰ সহায়ক আৰু নিৰীক্ষণ কেন্দ্ৰ",
    caregiverSubheader: "দৈনিক কাম চম্ভালিবলৈ, নতুন ফটো দিবলৈ আৰু ডাক্তৰলৈ খবৰ।",
    routineSectionTitle: "দৈনিক স্বাস্থ্য আৰু যত্নৰ তালিকা",
    routineSectionDesc: "কামবোৰ শেষ হ'লে টিক মাৰক। ই আপোনা-আপুনি সংৰক্ষিত হয়।",
    dailyCompletionRate: "আজিৰ সম্পূৰ্ণতা",
    taskMorningMeds: "ৰাতিপুৱাৰ দৰব আৰু প্ৰেচাৰ নিৰীক্ষণ",
    taskHydration: "পানী খোৱা: ২ গিলাচ পৰিষ্কাৰ পানী",
    taskNutritiousMeal: "দুপৰীয়াৰ পুষ্টিকৰ শাক-পাচলি আৰু ভাত",
    taskGentleWalk: "বাৰাণ্ডাত বা ফুলনিত ১৫ মিনিট খোজ কঢ়া",
    taskEveningTea: "সন্ধিয়াৰ তুলসী চাহ আৰু জিৰণি",
    taskNightRest: "ৰাতিৰ শান্ত পৰিৱেশ আৰু টোপনিৰ প্ৰস্তুতি",

    photoUploadSectionTitle: "পৰিয়ালৰ স্মৃতি ফটো সংগ্ৰহ",
    photoUploadSectionDesc: "ল'ৰা-ছোৱালী, নাতি-নাতিনীৰ ফটো দিয়ক। ৰোগীৰ খেলত তৎক্ষণাৎ দেখুৱাব!",
    btnUploadPhoto: "+ পৰিয়ালৰ ফটো যোগ কৰক",
    inputPhotoName: "পৰিয়ালৰ সদস্যৰ নাম (যেনে: ৰাহুল, সুনীতা)",
    inputPhotoRelation: "সম্পৰ্ক (যেনে: পুত্ৰ, জীয়াৰী, নাতি)",
    photoSyncSuccess: "ফটোখন তৎক্ষণাৎ ৰোগীৰ চিনাক্তকৰণ খেলত যোগ হ'ল!",
    photoPreviewTitle: "বৰ্তমান সঞ্চিত ফটোসমূহ",
    photoSyncedQuizNote: "এতিয়া ৰোগীৰ খেলত সক্ৰিয়",

    notesSectionTitle: "যত্নকাৰীৰ ডায়ৰী আৰু জৰুৰী সতৰ্কতা",
    notesSectionDesc: "ৰোগীৰ মেজাজ, খোৱা-বোৱা বা টোপনিৰ খবৰ লিখক আৰু চিকিৎসকক জনাওক।",
    inputNotePlaceholder: "আজি ৰোগীৰ মেজাজ বা স্বাস্থ্য কেনেকুৱা আছিল ইয়াত লিখক...",
    btnSaveNote: "টোকা সংৰক্ষণ কৰক",
    btnNotifyDoctor: "চিকিৎসকক বাৰ্তা পঠিয়াওক",
    doctorNotifiedAlert: "গুৱাহাটীৰ চিকিৎসক ডা০ বৰুৱালৈ সংকেত পঠিওৱা হ'ল!",
    recentNotesList: "সংৰক্ষিত যত্নকাৰীৰ টোকাসমূহ",
    categoryMood: "মেজাজ",
    categoryAppetite: "খোৱা-বোৱা",
    categorySleep: "টোপনি",
    categoryGeneral: "সাধাৰণ যত্ন",

    doctorHeader: "চিকিৎসাগত পৰ্যবেক্ষণ আৰু স্মৃতি পৰীক্ষা",
    doctorSubheader: "উত্তৰ-পূৰ্বাঞ্চলৰ ৰোগীসকলৰ দীৰ্ঘম্যাদী স্মৃতি প্ৰতিবেদন (অফলাইন সংৰক্ষিত)।",
    patientListTitle: "পঞ্জীকৃত ৰোগীসকল",
    stageLabel: "স্মৃতিৰ অৱস্থা",
    riskStable: "সুস্থিৰ (Stable)",
    riskMonitoring: "নজৰ ৰখা প্ৰয়োজন",
    riskAttention: "বিশেষ যত্ন দৰকাৰ",
    analyticsTitle: "স্বাস্থ্যৰ মূল সূচকসমূহ",
    metricEngagement: "সাপ্তাহিক অংশগ্ৰহণ",
    metricMemory: "স্মৃতি ধৰি ৰখাৰ শুদ্ধতা",
    metricAdherence: "নিয়মিত যত্ন পালনৰ হাৰ",
    cognitiveTrendTitle: "৩০ দিনৰ স্মৃতি অগ্ৰগতিৰ ৰেখাচিত্ৰ",
    cognitiveTrendSub: "দৈনিক ফটো খেল আৰু দৈনন্দিন বিবেচনাৰ ভিত্তিত গণনা কৰা স্ক'ৰ",
    last30Days: "যোৱা ৩০ দিনৰ স্ক'ৰ (১০০ ভিতৰত)",
    clinicalNotesTitle: "চিকিৎসকৰ পৰামৰ্শ আৰু মন্তব্য",
    clinicalNotesPlaceholder: "ৰোগীৰ বাবে পৰামৰ্শ বা দৰবৰ সালসলনি ইয়াত লিখক...",
    btnSaveObservation: "ৰোগীৰ নথিত সংৰক্ষণ কৰক",
    clinicalSavedSuccess: "চিকিৎসকৰ টোকা ৰোগীৰ নথিত সংৰক্ষিত হ'ল!",
    recentObservations: "পূৰ্বৰ চিকিৎসাগত পৰ্যবেক্ষণসমূহ",
    drSignature: "ডা০ পি. বৰুৱা, এম.ডি. (স্নায়ুৰোগ বিশেষজ্ঞ) • গুৱাহাটী",

    roleSelectionTitle: "ব্যৱহাৰকাৰী ভূমিকা নিৰ্বাচন",
    roleSelectionSub: "ৰোগী, পৰিয়ালৰ যত্নকাৰী, বা চিকিৎসকৰ বাবে বিশেষভাৱে প্ৰস্তুত কৰা পোৰ্টেল বাছক",
    rolePatientTitle: "জ্যেষ্ঠ / ৰোগীৰ পোৰ্টেল",
    rolePatientSub: "শান্ত আৰু মনোগ্ৰাহী স্মৃতি অনুশীলন আৰু দৈনন্দিন সুৰক্ষাৰ কুইজ।",
    roleCaregiverTitle: "পৰিয়ালৰ যত্নকাৰী পোৰ্টেল",
    roleCaregiverSub: "ৰোগীৰ নথি পৰিচালনা, দৈনন্দিন ৰুটিন তালিকা, ফটো আপলোড আৰু অনুমতি নিয়ন্ত্ৰণ।",
    roleDoctorTitle: "চিকিৎসক / ক্লিনিকেল পোৰ্টেল",
    roleDoctorSub: "বহু ৰোগীৰ ৩০ দিনৰ বৌদ্ধিক গতিপথ আৰু ক্লিনিকেল টোকা পৰ্যবেক্ষণ।",
    btnSelectRole: "পোৰ্টেলত প্ৰৱেশ কৰক",
    switchRole: "ভূমিকা পৰিৱৰ্তন কৰক",
    loggedInAs: "লগ-ইন হৈ আছে",
    linkedPatientLabel: "যুক্ত ৰোগী",
    quickSelectAccount: "একাউণ্ট নিৰ্বাচন কৰক",

    profileSetupTitle: "ৰোগীৰ প্ৰ'ফাইল আৰু নথি ব্যৱস্থাপনা",
    profileSetupSubtitle: "ৰোগীৰ ব্যক্তিগত তথ্য, অসম আৰু উত্তৰ-পূবৰ বাসস্থান, আৰু জৰুৰীকালীন যোগাযোগ",
    fieldPatientName: "ৰোগীৰ সম্পূৰ্ণ নাম",
    fieldAge: "বয়স (বছৰ)",
    fieldStateNE: "উত্তৰ-পূব ৰাজ্য",
    fieldCityLocation: "জিলা / নগৰ / গাঁও",
    fieldMedicalStage: "স্মৃতিভ্ৰংশৰ স্তৰ",
    fieldEmergencyName: "প্ৰাথমিক জৰুৰীকালীন যোগাযোগকাৰী",
    fieldEmergencyRelation: "ৰোগীৰ সৈতে সম্পৰ্ক",
    fieldEmergencyPhone: "জৰুৰীকালীন ফোন নম্বৰ",
    fieldEmergencyNotes: "বিশেষ যত্ন আৰু স্বাস্থ্য সতৰ্কতা",
    btnSavePatientProfile: "ৰোগীৰ তথ্য সংৰক্ষণ কৰক",
    profileSavedSuccess: "ৰোগীৰ তথ্য আৰু অনুমতি সফলতাৰে সংৰক্ষিত হ'ল!",

    privacyConsentTitle: "গোপনীয়তা আৰু তথ্য অংশীদাৰিত্বৰ অনুমতি",
    privacyConsentSub: "ৰোগী আৰু পৰিয়াল নিয়ন্ত্ৰিত সন্মতি: কোনে স্বাস্থ্য তথ্য চাব পাৰিব তাৰ নিয়ন্ত্ৰণ",
    registeredCaregivers: "পঞ্জীকৃত যত্নকাৰীসকল",
    registeredDoctors: "পঞ্জীকৃত চিকিৎসকসকল",
    sharingEnabled: "তথ্য অংশীদাৰিত্ব সক্ৰিয়",
    sharingDisabled: "অংশীদাৰিত্ব স্থগিত",
    consentNotice: "ডিজিটেল হেল্থ নিৰ্দেশনা অনুযায়ী, অনুমতি বাতিল কৰিলে চিকিৎসকৰ ওচৰলৈ তথ্য প্ৰেৰণ ততালিকে বন্ধ হ'ব।",
    telemetrySuspendedNotice: "ৰোগীৰ তথ্য প্ৰেৰণ স্থগিত: ৰোগী বা যত্নকাৰীয়ে এই চিকিৎসকৰ বাবে তথ্য শ্বেয়াৰিং স্থগিত কৰিছে।",
    guidePatientTest: "ৰোগীক অনুশীলনী কৰাওক",
    guidePatientTestSub: "এই ডিভাইচৰ পৰাই ৰোগীৰ স্মৃতি কুইজ আৰম্ভ কৰক",
    tabProfileSetup: "ৰোগী প্ৰ'ফাইল আৰু অনুমতি",
    tabDailyRoutine: "দৈনন্দিন ৰুটিন তালিকা",
    tabMemoryStudio: "পৰিয়ালৰ ফটো ষ্টুডিঅ'",
    tabCaregiverLog: "যত্নকাৰীৰ টোকা আৰু এলাৰ্ট",

    // Patient Portal Layout
    patientWelcomeGreeting: "স্বাগতম",
    patientWelcomeSpeech: "স্বাগতম। আজিৰ শান্ত স্মৃতি অভ্যাসসমূহ লাহে লাহে কৰক। কোনো খৰখেদা নাই।",
    calmMemoryGym: "প্ৰশান্ত স্মৃতি চৰ্চা কেন্দ্ৰ",
    listenAloud: "শুনি লওক",
    exitSignOut: "প্ৰস্থান / বন্ধ কৰক",
    everyMemoryPrecious: "প্ৰতিটো স্মৃতিয়েই মূল্যবান। আপোনাৰ সময় লওক, যেতিยাই মন যায় জিৰণি লওক।",

    // Login Screen
    loginSubtitle: "সুৰক্ষিত পৰিচয় ভিত্তিক প্ৰৱেশ কেন্দ্ৰ",
    loginRoleDoctor: "চিকিৎসক",
    loginRoleCaretaker: "পৰিয়ালৰ যত্নকাৰী",
    loginRolePatient: "জ্যেষ্ঠ ৰোগী",
    loginDescDoctor: "চিকিৎসক পৰ্টেল: উত্তৰ-পূব ভাৰতৰ ৰোগীসকলৰ ফাইল পুনৰীক্ষণ কৰক আৰু নিৰ্দেশনা প্ৰদান কৰক।",
    loginDescCaretaker: "যত্নকাৰী পৰ্টেল: ৰোগীৰ প্ৰফাইল, জৰুৰী তথ্য আৰু দৈনন্দিন নিয়ম পৰিচালনা কৰক।",
    loginDescPatient: "জ্যেষ্ঠ ৰোগী পৰ্টেল: শান্ত স্মৃতি খেল, পৰিয়ালৰ ফটো আৰু উত্তৰ-পূৰ্বাঞ্চলৰ নিৰাপত্তা পৰীক্ষা।",
    loginEmailLabelPatient: "ৰোগীৰ ইমেইল বা এক্সেছ ক'ড (যেনে: RAMESH74)",
    loginEmailLabelStaff: "কাৰ্যালয়ৰ ইমেইল ঠিকনা",
    loginPasswordLabel: "পাছৱৰ্ড",
    loginPasswordLabelPatient: "পাছৱৰ্ড বা ৪টা সংখ্যাৰ পিন (PIN)",
    loginSignInAs: "হৈ প্ৰৱেশ কৰক",
    loginSignInDoctor: "চিকিৎসক হিচাপে প্ৰৱেশ",
    loginSignInCaretaker: "যত্নকাৰী হিচাপে প্ৰৱেশ",
    loginSignInPatient: "ৰোগী হিচাপে প্ৰৱেশ",
    loginFooter: "সুৰক্ষিত আৰু ABDM নিয়ম সন্মত • ১০০% অফলাইন ব্যৱহাৰোপযোগী",
    loginInvalidCredentials: "ভুল তথ্য। অনুগ্ৰহ কৰি আপোনাৰ ইমেইল/আইডি আৰু পাছৱৰ্ড পৰীক্ষা কৰক।",
    loginReadGuidance: "পৰ্টেলত প্ৰৱেশ কৰক। আপোনাৰ ভূমিকা বাছক আৰু তথ্য দি প্ৰৱেশ কৰক।",
    loginNERBadge: "উত্তৰ-পূৰ্বাঞ্চল মাল্টি-ইউজাৰ টেলি-কেয়াৰ ব্যৱস্থা",

    // Patient Portal hardcoded
    photoCountLabel: "ফটো",
    recognizedTodayLabel: "আজি চিনাক্ত কৰা হ'ল",
    addedByCaregiver: "যত্নকাৰীয়ে যোগ কৰা",
    noFamilyPhotosTitle: "কোনো পৰিয়ালৰ ফটো যোগ কৰা হোৱা নাই",
    noFamilyPhotosDesc: "আপোনাৰ পৰিয়ালৰ যত্নকাৰীয়ে পৰ্টেলৰ পৰা চিনাকি ফটো যোগ কৰিব পাৰে।",
    situationRegionLabel: "অঞ্চল",
    situationStateLabel: "ৰাজ্য",
    situationQuestionLabel: "প্ৰশ্ন",
    situationWonderfulChoice: "অতি সুন্দৰ পছন্দ!",
    situationSafeDecision: "আপোনাৰ ঘৰৰ বাবে নিৰাপদ আৰু সুস্থিৰ সিদ্ধান্ত।",
    moduleSubFamilyRecognition: "পৰিয়াল চিনাক্তকৰণ",
    moduleSubRegionalSafety: "আঞ্চলিক সুৰক্ষা আৰু বিবেচনা",
    moduleSubHeritageMatch: "ঐতিহ্য প্ৰতীক খেল",
    gridPairsLabel: "যোৰ",
  },


  mni: {
    appName: "মণিপুৰী স্বা স্থ্য (Project O.C.T.A.V.E.)",
    appSubtitle: "অৱাং-নোংপোক লমদমগীদমক এআই-না চলাইবা মখল য়াংবা স্মৃতি য়েংশিনবা",
    tagline: "অৱাং-নোংপোক লমদমগী অহনশিংগীদমক ওফলাইনদা থবক তৌবা মফম",
    onlineStatus: "ক্লাউদকা লোয়ননা শম্নরে",
    offlineStatus: "ওফলাইন মওং (মফম অসিগী খোমজিনবা)",
    syncedSuccess: "ওফলাইনগী রেকোর্দ পুম্নমক মায় পাক্না শম্নরে!",
    changesPendingSync: "শম্নদ্রিবা রেকোর্দ মশীং",
    offlineModeNotice: "ইন্তর্নেত য়াওদনা চলাইবা য়াই। চীং অমসুং খুঙ্গংগী মফমদা চলাইবা য়াই।",
    testOfflineToggle: "নেতৱার্ক চাং য়েংবা",
    simulateOffline: "ওফলাইন মওংদা ওন্থোকউ",
    returnToOnline: "অমুক হন্না শম্নউ",
    languageSelectLabel: "লিৎপা / Language",
    audioSpeak: "তাগুমসি (Audio)",
    audioStop: "লেপউ",
    backToHub: "← ময়াইগী মফমদা হল্লকউ",
    textSize: "ময়িক চাউবা",
    textSizeNormal: "অ",
    textSizeLarge: "অ+",
    textSizeExtraLarge: "অ++",

    portalPatientTitle: "অনাবা মীওইগী পোর্তেল",
    portalPatientSubtitle: "ইমুংগী মী চিনবা অমসুং নুংঙাইবা নীংশিং শান্নপোৎ",
    portalCaregiverTitle: "য়েংশিনবা মীওইগী পোর্তেল",
    portalCaregiverSubtitle: "নুমিত খুদিংগী থবক লিস্ত, ফোতো হাপচিনবা অমসুং দাক্তরদা পাউ ফাওনবা",
    portalDoctorTitle: "দাক্তরগী দেসবোর্দ",
    portalDoctorSubtitle: "ক্লিনিকেল এনলাইতিস, নুমিৎ ৩০গী য়েংশিনবা অমসুং পাউতাক",

    patientPortalHeader: "নীংশিংবা হেনগৎহনবগী থবকশিংদা তরাম্না ওকচরি",
    patientPortalSubheader: "থৱাই য়াওনা পাংথোকউ। মতমগী অথিংবা লৈতে, তোইনা হোৎনবা পুম্নমক শাগাৎচরি।",
    modulePhotoQuiz: "ইমুংগী মী ফোতো ক্বিজ",
    moduleSituationTest: "নুমিত খুদিংগী লৌশিন চাংয়েং",
    moduleGridMatch: "নুংঙাইবা মেমোরি মেচিং",
    photoQuizDesc: "খোন্থোক তাদুনা ইমুংগী নুংশিবা মী চিনবা",
    situationTestDesc: "য়ুমগী নুমিৎ খুদিংগী চুনবা ৱারেপ লৌবা",
    gridMatchDesc: "লমদমসিগী শকখংবা খুদমশিং মচাক-মচাক মান্নহনবা",

    photoQuizTitle: "ইমুংগী মীওই শকখংবা",
    photoQuizPromptPrefix: "মহাক অসি নহাক্কী",
    btnYes: "হোই (YES)",
    btnNo: "নত্তে (NO)",
    quizCorrectFeedback: "য়াম্না ফৈ! চপ চাবা পাউখুম! নহাক্কী নীংশিংবা অসি য়াম্না থোইদোক্না ফৈ!",
    quizGentleRetry: "নহাক্না কুপ্না হোৎনরে! অমুক্কা হন্না য়েংমিন্নসি।",
    quizNextButton: "মথংগী মীওই য়েংবা →",
    quizScoreLabel: "ঙসি চিনবা ঙম্বা ইমুংগী মীশিং",
    recognizingFamilyMember: "ইমুংগী ফোতো",
    uploadedPhotoBadge: "য়েংশিনবা মীওইনা হাপচিনবা",
    customUploadedByCaregiver: "ইমুংগী নাহারোলনা হাপচিল্লকপা",

    situationTestTitle: "নুমিত খুদিংগী নিংথিনা চৎনবা চাংয়েং",
    situationPrompt1: "নহাক য়ুমদগী মপান্দা থোকপগী মতম ওইরে। থোকত্রিংৈদা করি তৌগদগে?",
    situationOption1A: "থোঙ নিংথিনা লোইরগা চৎপা",
    situationOption1B: "তিভি শাৎলগা থম্লম্বা",
    situationPrompt2: "চীংগী মথক্তা নোংজু নোংবা অশুম্না চাউখৎলক্লে। নহাক্না করি পায়গদগে?",
    situationOption2A: "চেৎনা পেতিং লৌমিন্নবা",
    situationOption2B: "চেগী হাপ্পা হুম্নবা পায়বা",
    situationPrompt3: "অয়ুক পুং ৮ তারে, চাক অমসুং হিদাক চাবগী মতম ওইরে। করি থকসি?",
    situationOption3A: "নুংশিবা অশাাবা ঈশিং থকপা",
    situationOption3B: "অকোইরবা ঈশিং থকপা",
    situationCorrectFeedback: "য়াম্না নিংথিজবা ৱারেপনি! অশেংবা অমসুং নিংথৌবা মওংনি।",
    situationEncourageFeedback: "মরী ফৈ! থোঙ নিংথিনা থিংজিনবনা য়ুম নিংথিনা ঙাক-শেনগনি।",
    nextScenarioBtn: "মথংগী চাংয়েংদা চঙবা →",

    // Regional Scenarios - Assam
    asSitPrompt1: "অয়ুক পুং ৭:৩০ তারে, য়ুমদা অঙাংবা চা ফুট্লকপগী খোন্থোক তারে। অহানবদা করি তৌগদগে?",
    asSitOption1A: "চা হাপত্রিংৈদা গ্যাস ষ্টোভতু অসুপ্পা ফীনা চেৎনা থিংশিনবা",
    asSitOption1B: "অশাাবা গ্যাসতু মখোংদা খুৎনা থিংজিনবা",
    asSitPrompt2: "হঠাৎ নোংজু নোং চুবা হৌরক্লে। নামঘর নত্রগা কৈথেলদা চৎসি খল্লি। করি পুদুনা থোক্কদগে?",
    asSitOption2A: "চাউরবা পেতিং অমসুং শোকত্রবা খরোং খোদোং উপ্পা",
    asSitOption2B: "লম্বীদা লেপচিল্লিবা চিত্থিবা লৈবাক মথক্তা খোঙবান্নদা চৎপা",
    asSitPrompt3: "নুমিৎ য়ুংবা চাক চাবগী মতুংদা গুৱাহাটিদা অশাবা হেনগৎলক্লে অমসুং মিত্থরম তারক্লে। খ্বাইদগী নিংথৌবা ৱারেপ করিগীনো?",
    asSitOption3A: "ঈশিং গ্লাস অমা থক্লগা অইংবা ফমুংদা ইংনা পোথাৰবা",
    asSitOption3B: "খুম্পাক উপ্তনা লম্বীগী কাংখৎলবা নুমিৎ মঙালদা থোকপা",
    asSitPrompt4: "মেবুলদা ঈশিং গ্লাসকী নক্নদা অয়ুক্কী হিদাক থম্লম্মি। নহাক্না করি তৌগদগে?",
    asSitOption4A: "নিয়ম মতুং ইন্না ঈশিং গ্লাস অমা পুন্না হিদাকতু চাবা",
    asSitOption4B: "অঙাংবা চা থক্লে হায়দুনা হিদাক চাদবা",
    asSitPrompt5: "নুমিদাংগী মতমদা থোঙদা খোন্থোক তারে, অদুবু অচিনবা মীওই অমগী খোন্থোকনি। করি তৌগদগে?",
    asSitOption5A: "কনানো হায়না হংবা অমসুং ইমুংগী মীওই য়ৌদ্রিঙৈদা থোঙ হাংদবা",
    asSitOption5B: "অচিনবা মীওইদুগীদমক থোঙ হুদোক্না হাংদোক্তুনা লৈবা",

    // Regional Scenarios - Nagaland
    nagSitPrompt1: "কোহিমা নত্রগা মোকোকচুংদা চীংগী ময়ালেংদা অয়ুক্কী খোঙথাং চৎসি খল্লি। করম্না চৎকদগে?",
    nagSitOption1A: "চেৎপা খুৎচু উপ্পা অমসুং ৱাগী চেইদা তৌদুনা চৎপা",
    nagSitOption1B: "চিথিরবা পাহাৰদা পোজিত্পা প্লাষ্টিক খোদোং উপ্পা",
    nagSitPrompt2: "চাকশঙদা মৈশাফমগী মৈখুদগী য়াম্না মৈখু থোক্লক্লে। হৌজিক করি তৌগদগে?",
    nagSitOption2A: "মৈখু মপান্দা থোক্নবা উগী থোঙনাও নীংথিনা হাংদোকপা",
    nagSitOption2B: "থোঙ অমসুং থোঙনাও পুম্নমক থিংজিনবা অমসুং মৈখু মপুং ফানা হাপচিনবা",
    nagSitPrompt3: "নুমিৎ তাখ্রে অমসুং চীংগী অইংবা নুংশিৎ বারক্লে। নহাক্না করি তৌগদগে?",
    nagSitOption3A: "অশাাবা উনগী ফিজেৎ শাফুনা য়ুম মনুংদা অশাাবা ঈশিং থকপা",
    nagSitOption3B: "অইংবা নুংশিৎ মথক্তা পাত্লবা ফী উপ্তুনা মপান্দা ফম্বা",
    nagSitPrompt4: "অয়ুক্কী চাক গালহো চাবগী মতুংদা চিল্বাল শুক্লক্লে। করি তৌবনা চুগদগে?",
    nagSitOption4A: "লু-নানবা ফুথরবা ঈশিং কপ অমা তপ্না থকপা",
    nagSitOption4B: "মপান্দা দোরামদা হাপ্পা নোংজু ঈশিং থকপা",
    nagSitPrompt5: "হৰ্ণবিল নুমিৎতা উগী মেবুলদা থাওমৈ চাক্লি। তুমদ্রিঙৈদা করি তৌগদগে?",
    nagSitOption5A: "থাওমৈতু চেকশিন্না মুথৎলগা নুংগী ৱাফমদা থম্লগা তুম্বা",
    nagSitOption5B: "নুমিদাং চুপ্পা উগী মেবুলদা থাওমৈ চাকহনবা",

    // Regional Scenarios - Manipur
    mniSitPrompt1: "বৰষুণৰ বাবে ইম্ফলৰ চোতালৰ শিলবোৰত শেলাই লাগি পিচল হৈ পৰিছে। বাহিৰত কেনেকৈ খোজ দিব লাগে?",
    mniSitOption1A: "বাঁহৰ ৰেলিংখনত ধৰি ভৰি দুখন সাৱধানে আৰু সমানকৈ পেলাই খোজ কাঢ়ক",
    mniSitOption1B: "তললৈ নোচোৱাকৈ শেলাইের ওপৰেৰে দৌৰি যাওক",
    mniSitPrompt2: "সানামাহী প্ৰাৰ্থনা স্থানত সন্ধিয়াৰ আৰাধনা শেষ হ'ল। তেলৰ চাকি (মৈৰা) জ্বলি আছে। নিৰাপদ পদক্ষেপ কি?",
    mniSitOption2A: "চাকিটো কোনো কাপোৰত নালাগাকৈ সুৰক্ষিতভাৱে ৰখা হৈছে নে নাই পৰীক্ষা কৰক",
    mniSitOption2B: "জ্বলি থকা চাকিটোৰ ঠিক ওপৰতে শুকান কপাহী গামোচা এখন জাপি দিয়ক",
    mniSitPrompt3: "ৰাতিপুৱা গৰম কাংহৌৰ সৈতে আহাৰ খোৱা হ'ল। ডিঙি শুকাই গৈছে। কি খোৱা উচিত?",
    mniSitOption3A: "কাঁহৰ গিলাচত এক গিলাচ পৰিষ্কাৰ উমাল উতলোৱা পানী খাওক",
    mniSitOption3B: "গোটেই দিনটো অকণো পানী নোখোৱাকৈ থাকক",
    mniSitPrompt4: "পৰিয়ালৰ সৈতে লোকটাক হ্ৰদ চাবলৈ আহিছে। দুপৰীয়া বৰ ৰ'দ দিছে। লগত কি নিব লাগে?",
    mniSitOption4A: "টুপী পিন্ধক আৰু লগত খোৱা পানীৰ বটল লওক",
    mniSitOption4B: "টুপী বা পানী অবিহনে দুঘণ্টা প্ৰখৰ ৰ'দত থিয় হৈ থাকক",
    mniSitPrompt5: "ইম্ফলত ৰাতি বিদ্যুৎ নাইকিয়া হৈছে। শৌচালয়লৈ যাব লাগে। আটাইতকৈ নিৰাপদ উপায় কি?",
    mniSitOption5A: "হাতত টৰ্চ লাইট লওক আৰু বেৰত ধৰি লাহে লাহে খোজ কাঢ়ক",
    mniSitOption5B: "ঘিটমিট আন্ধাৰৰ মাজতে কোঠাৰ মাজেৰে দৌৰি যাওক",

    // Regional Scenarios - Tripura
    trpSitPrompt1: "আগৰতলাত ৰাতিপুৱাৰ নিয়ৰে বাঁহৰ দলংখন পিচল কৰি তুলিছে। আপুনি কেনেকৈ খোজ দিব?",
    trpSitOption1A: "ৰবৰৰ চেন্দেল পিন্ধি শুকান মাজভাগৰ পথেৰে সাৱধানে খোজ কাঢ়ক",
    trpSitOption1B: "তিতা পিচল বাঁহৰ ওপৰেৰে খৰখেদাকৈ দৌৰি যাওক",
    trpSitPrompt2: "ত্ৰিপুৰাত আবেলি ৫ বজাত সোনকালে বেলি লহিয়াই বাৰান্দাত ছাঁ পৰে। এনে সময়ত কি কৰা উচিত?",
    trpSitOption2A: "বাৰান্দাৰ লাইটবোৰ জ্বলাই লওক আৰু পৰিয়ালৰ সৈতে শান্তভাৱে বহক",
    trpSitOption2B: "কোনো লাইট নজ্বলোৱাকৈ অন্ধকাৰত অকলে বহি থাকক",
    trpSitPrompt3: "যত্নকাৰীয়ে মেজত এগিলাচ পানীৰ সৈতে পুৱাৰ দৰৱৰ টেবলেটটো ৰাখিছে। কি কৰা উচিত?",
    trpSitOption3A: "এক কাপ পৰিষ্কাৰ পানীৰ সৈতে পুৱাৰ টেবলেটটো নিয়মমতে খাওক",
    trpSitOption3B: "টেবলেটটো আৱৰ্জনাৰ বাল্টিত পেলাই দিয়ক",
    trpSitPrompt4: "দুৰ্গা পূজাৰ সময়ত ওচৰ-চুবুৰীয়াই আপোনাক এখন জ্বলি থকা মাটিৰ চাকি দিলে। কি কৰিব লাগে?",
    trpSitOption4A: "দুয়োহাতেৰে সাৱধানে ধৰি মজিয়াত নিৰাপদে সুস্থিৰভাৱে ৰাখক",
    trpSitOption4B: "এখন আঙুলিৰে ধৰি পৰ্দাৰ কাষত জোকাৰি থাকক",
    trpSitPrompt5: "পুৱা মুই বৰক খোৱাৰ পাছত মূৰ ঘূৰোৱা যেন লাগিছে আৰু যত্নকাৰী কাষৰ কোঠাতে আছে। প্ৰথমতে কি কৰিব?",
    trpSitOption5A: "লগে লগে বহি পৰক আৰু সহায়ৰ বাবে যত্নকাৰীক মাত দিয়ক",
    trpSitOption5B: "কাকো নকৈ অকলেই বজাৰলৈ খৰখেদাকৈ ওলাই যাওক",

    gridMatchTitle: "সাংস্কৃতিক প্ৰতীক মিলোৱা খেল",
    gridMatchInstruction: "দুখন কাৰ্ডত টিপি একে প্ৰতীকবোৰ মিলাওক। কোনো চিন্তা নকৰিব।",
    gridMoves: "টিপাৰ সংখ্যা",
    gridMatchesFound: "মিলা জোৰা",
    gridCompleteTitle: "বৰ আনন্দৰ কথা! আপুনি সকলো প্ৰতীক মিলাই পেলালে!",
    gridCompleteDesc: "আজি আপোনাৰ মন আৰু স্মৃতি অতি উজ্জ্বল হৈ উঠিছে।",
    gridResetBtn: "আকৌ এফেৰি খেলক",
    cardTeaLeaf: "অসমৰ চাহ পাত",
    cardGamosa: "ফুলাম গামোচা",
    cardHornbill: "ধনেশ পক্ষীৰ পাখি",
    cardBamboo: "বাঁহ গছ",
    cardLotus: "পদুম ফুল",
    cardBrassBell: "কাঁহৰ ঘণ্টা",

    caregiverHeader: "যত্নকাৰীৰ সহায়ক আৰু নিৰীক্ষণ কেন্দ্ৰ",
    caregiverSubheader: "দৈনিক কাম চম্ভালিবলৈ, নতুন ফটো দিবলৈ আৰু ডাক্তৰলৈ খবৰ।",
    routineSectionTitle: "দৈনিক স্বাস্থ্য আৰু যত্নৰ তালিকা",
    routineSectionDesc: "কামবোৰ শেষ হ'লে টিক মাৰক। ই আপোনা-আপুনি সংৰক্ষিত হয়।",
    dailyCompletionRate: "আজিৰ সম্পূৰ্ণতা",
    taskMorningMeds: "ৰাতিপুৱাৰ দৰব আৰু প্ৰেচাৰ নিৰীক্ষণ",
    taskHydration: "পানী খোৱা: ২ গিলাচ পৰিষ্কাৰ পানী",
    taskNutritiousMeal: "দুপৰীয়াৰ পুষ্টিকৰ শাক-পাচলি আৰু ভাত",
    taskGentleWalk: "বাৰাণ্ডাত বা ফুলনিত ১৫ মিনিট খোজ কঢ়া",
    taskEveningTea: "সন্ধিয়াৰ তুলসী চাহ আৰু জিৰণি",
    taskNightRest: "ৰাতিৰ শান্ত পৰিৱেশ আৰু টোপনিৰ প্ৰস্তুতি",

    photoUploadSectionTitle: "পৰিয়ালৰ স্মৃতি ফটো সংগ্ৰহ",
    photoUploadSectionDesc: "ল'ৰা-ছোৱালী, নাতি-নাতিনীৰ ফটো দিয়ক। ৰোগীৰ খেলত তৎক্ষণাৎ দেখুৱাব!",
    btnUploadPhoto: "+ পৰিয়ালৰ ফটো যোগ কৰক",
    inputPhotoName: "পৰিয়ালৰ সদস্যৰ নাম (যেনে: ৰাহুল, সুনীতা)",
    inputPhotoRelation: "সম্পৰ্ক (যেনে: পুত্ৰ, জীয়াৰী, নাতি)",
    photoSyncSuccess: "ফটোখন তৎক্ষণাৎ ৰোগীৰ চিনাক্তকৰণ খেলত যোগ হ'ল!",
    photoPreviewTitle: "বৰ্তমান সঞ্চিত ফটোসমূহ",
    photoSyncedQuizNote: "এতিয়া ৰোগীৰ খেলত সক্ৰিয়",

    notesSectionTitle: "যত্নকাৰীৰ ডায়ৰী আৰু জৰুৰী সতৰ্কতা",
    notesSectionDesc: "ৰোগীৰ মেজাজ, খোৱা-বোৱা বা টোপনিৰ খবৰ লিখক আৰু চিকিৎসকক জনাওক।",
    inputNotePlaceholder: "আজি ৰোগীৰ মেজাজ বা স্বাস্থ্য কেনেকুৱা আছিল ইয়াত লিখক...",
    btnSaveNote: "টোকা সংৰক্ষণ কৰক",
    btnNotifyDoctor: "চিকিৎসকক বাৰ্তা পঠিয়াওক",
    doctorNotifiedAlert: "গুৱাহাটীৰ চিকিৎসক ডা০ বৰুৱালৈ সংকেত পঠিওৱা হ'ল!",
    recentNotesList: "সংৰক্ষিত যত্নকাৰীৰ টোকাসমূহ",
    categoryMood: "মেজাজ",
    categoryAppetite: "খোৱা-বোৱা",
    categorySleep: "টোপনি",
    categoryGeneral: "সাধাৰণ যত্ন",

    doctorHeader: "চিকিৎসাগত পৰ্যবেক্ষণ আৰু স্মৃতি পৰীক্ষা",
    doctorSubheader: "উত্তৰ-পূৰ্বাঞ্চলৰ ৰোগীসকলৰ দীৰ্ঘম্যাদী স্মৃতি প্ৰতিবেদন (অফলাইন সংৰক্ষিত)।",
    patientListTitle: "পঞ্জীকৃত ৰোগীসকল",
    stageLabel: "স্মৃতিৰ অৱস্থা",
    riskStable: "সুস্থিৰ (Stable)",
    riskMonitoring: "নজৰ ৰখা প্ৰয়োজন",
    riskAttention: "বিশেষ যত্ন দৰকাৰ",
    analyticsTitle: "স্বাস্থ্যৰ মূল সূচকসমূহ",
    metricEngagement: "সাপ্তাহিক অংশগ্ৰহণ",
    metricMemory: "স্মৃতি ধৰি ৰখাৰ শুদ্ধতা",
    metricAdherence: "নিয়মিত যত্ন পালনৰ হাৰ",
    cognitiveTrendTitle: "৩০ দিনৰ স্মৃতি অগ্ৰগতিৰ ৰেখাচিত্ৰ",
    cognitiveTrendSub: "দৈনিক ফটো খেল আৰু দৈনন্দিন বিবেচনাৰ ভিত্তিত গণনা কৰা স্ক'ৰ",
    last30Days: "যোৱা ৩০ দিনৰ স্ক'ৰ (১০০ ভিতৰত)",
    clinicalNotesTitle: "চিকিৎসকৰ পৰামৰ্শ আৰু মন্তব্য",
    clinicalNotesPlaceholder: "ৰোগীৰ বাবে পৰামৰ্শ বা দৰবৰ সালসলনি ইয়াত লিখক...",
    btnSaveObservation: "ৰোগীৰ নথিত সংৰক্ষণ কৰক",
    clinicalSavedSuccess: "চিকিৎসকৰ টোকা ৰোগীৰ নথিত সংৰক্ষিত হ'ল!",
    recentObservations: "পূৰ্বৰ চিকিৎসাগত পৰ্যবেক্ষণসমূহ",
    drSignature: "ডা০ পি. বৰুৱা, এম.ডি. (স্নায়ুৰোগ বিশেষজ্ঞ) • গুৱাহাটী",

    roleSelectionTitle: "ব্যৱহাৰকাৰী ভূমিকা নিৰ্বাচন",
    roleSelectionSub: "ৰোগী, পৰিয়ালৰ যত্নকাৰী, বা চিকিৎসকৰ বাবে বিশেষভাৱে প্ৰস্তুত কৰা পোৰ্টেল বাছক",
    rolePatientTitle: "জ্যেষ্ঠ / ৰোগীৰ পোৰ্টেল",
    rolePatientSub: "শান্ত আৰু মনোগ্ৰাহী স্মৃতি অনুশীলন আৰু দৈনন্দিন সুৰক্ষাৰ কুইজ।",
    roleCaregiverTitle: "পৰিয়ালৰ যত্নকাৰী পোৰ্টেল",
    roleCaregiverSub: "ৰোগীৰ নথি পৰিচালনা, দৈনন্দিন ৰুটিন তালিকা, ফটো আপলোড আৰু অনুমতি নিয়ন্ত্ৰণ।",
    roleDoctorTitle: "চিকিৎসক / ক্লিনিকেল পোৰ্টেল",
    roleDoctorSub: "বহু ৰোগীৰ ৩০ দিনৰ বৌদ্ধিক গতিপথ আৰু ক্লিনিকেল টোকা পৰ্যবেক্ষণ।",
    btnSelectRole: "পোৰ্টেলত প্ৰৱেশ কৰক",
    switchRole: "ভূমিকা পৰিৱৰ্তন কৰক",
    loggedInAs: "লগ-ইন হৈ আছে",
    linkedPatientLabel: "যুক্ত ৰোগী",
    quickSelectAccount: "একাউণ্ট নিৰ্বাচন কৰক",

    profileSetupTitle: "ৰোগীৰ প্ৰ'ফাইল আৰু নথি ব্যৱস্থাপনা",
    profileSetupSubtitle: "ৰোগীৰ ব্যক্তিগত তথ্য, অসম আৰু উত্তৰ-পূবৰ বাসস্থান, আৰু জৰুৰীকালীন যোগাযোগ",
    fieldPatientName: "ৰোগীৰ সম্পূৰ্ণ নাম",
    fieldAge: "বয়স (বছৰ)",
    fieldStateNE: "উত্তৰ-পূব ৰাজ্য",
    fieldCityLocation: "জিলা / নগৰ / গাঁও",
    fieldMedicalStage: "স্মৃতিভ্ৰংশৰ স্তৰ",
    fieldEmergencyName: "প্ৰাথমিক জৰুৰীকালীন যোগাযোগকাৰী",
    fieldEmergencyRelation: "ৰোগীৰ সৈতে সম্পৰ্ক",
    fieldEmergencyPhone: "জৰুৰীকালীন ফোন নম্বৰ",
    fieldEmergencyNotes: "বিশেষ যত্ন আৰু স্বাস্থ্য সতৰ্কতা",
    btnSavePatientProfile: "ৰোগীৰ তথ্য সংৰক্ষণ কৰক",
    profileSavedSuccess: "ৰোগীৰ তথ্য আৰু অনুমতি সফলতাৰে সংৰক্ষিত হ'ল!",

    privacyConsentTitle: "গোপনীয়তা আৰু তথ্য অংশীদাৰিত্বৰ অনুমতি",
    privacyConsentSub: "ৰোগী আৰু পৰিয়াল নিয়ন্ত্ৰিত সন্মতি: কোনে স্বাস্থ্য তথ্য চাব পাৰিব তাৰ নিয়ন্ত্ৰণ",
    registeredCaregivers: "পঞ্জীকৃত যত্নকাৰীসকল",
    registeredDoctors: "পঞ্জীকৃত চিকিৎসকসকল",
    sharingEnabled: "তথ্য অংশীদাৰিত্ব সক্ৰিয়",
    sharingDisabled: "অংশীদাৰিত্ব স্থগিত",
    consentNotice: "ডিজিটেল হেল্থ নিৰ্দেশনা অনুযায়ী, অনুমতি বাতিল কৰিলে চিকিৎসকৰ ওচৰলৈ তথ্য প্ৰেৰণ ততালিকে বন্ধ হ'ব।",
    telemetrySuspendedNotice: "ৰোগীৰ তথ্য প্ৰেৰণ স্থগিত: ৰোগী বা যত্নকাৰীয়ে এই চিকিৎসকৰ বাবে তথ্য শ্বেয়াৰিং স্থগিত কৰিছে।",
    guidePatientTest: "ৰোগীক অনুশীলনী কৰাওক",
    guidePatientTestSub: "এই ডিভাইচৰ পৰাই ৰোগীৰ স্মৃতি কুইজ আৰম্ভ কৰক",
    tabProfileSetup: "ৰোগী প্ৰ'ফাইল আৰু অনুমতি",
    tabDailyRoutine: "দৈনন্দিন ৰুটিন তালিকা",
    tabMemoryStudio: "পৰিয়ালৰ ফটো ষ্টুডিঅ'",
    tabCaregiverLog: "যত্নকাৰীৰ টোকা আৰু এলাৰ্ট",

    // Patient Portal Layout
    patientWelcomeGreeting: "স্বাগতম",
    patientWelcomeSpeech: "স্বাগতম। আজিৰ শান্ত স্মৃতি অভ্যাসসমূহ লাহে লাহে কৰক। কোনো খৰখেদা নাই।",
    calmMemoryGym: "প্ৰশান্ত স্মৃতি চৰ্চা কেন্দ্ৰ",
    listenAloud: "শুনি লওক",
    exitSignOut: "প্ৰস্থান / বন্ধ কৰক",
    everyMemoryPrecious: "প্ৰতিটো স্মৃতিয়েই মূল্যবান। আপোনাৰ সময় লওক, যেতিยাই মন যায় জিৰণি লওক।",

    // Login Screen
    loginSubtitle: "সুৰক্ষিত পৰিচয় ভিত্তিক প্ৰৱেশ কেন্দ্ৰ",
    loginRoleDoctor: "চিকিৎসক",
    loginRoleCaretaker: "পৰিয়ালৰ যত্নকাৰী",
    loginRolePatient: "জ্যেষ্ঠ ৰোগী",
    loginDescDoctor: "চিকিৎসক পৰ্টেল: উত্তৰ-পূব ভাৰতৰ ৰোগীসকলৰ ফাইল পুনৰীক্ষণ কৰক আৰু নিৰ্দেশনা প্ৰদান কৰক।",
    loginDescCaretaker: "যত্নকাৰী পৰ্টেল: ৰোগীৰ প্ৰফাইল, জৰুৰী তথ্য আৰু দৈনন্দিন নিয়ম পৰিচালনা কৰক।",
    loginDescPatient: "জ্যেষ্ঠ ৰোগী পৰ্টেল: শান্ত স্মৃতি খেল, পৰিয়ালৰ ফটো আৰু উত্তৰ-পূৰ্বাঞ্চলৰ নিৰাপত্তা পৰীক্ষা।",
    loginEmailLabelPatient: "ৰোগীৰ ইমেইল বা এক্সেছ ক'ড (যেনে: RAMESH74)",
    loginEmailLabelStaff: "কাৰ্যালয়ৰ ইমেইল ঠিকনা",
    loginPasswordLabel: "পাছৱৰ্ড",
    loginPasswordLabelPatient: "পাছৱৰ্ড বা ৪টা সংখ্যাৰ পিন (PIN)",
    loginSignInAs: "হৈ প্ৰৱেশ কৰক",
    loginSignInDoctor: "চিকিৎসক হিচাপে প্ৰৱেশ",
    loginSignInCaretaker: "যত্নকাৰী হিচাপে প্ৰৱেশ",
    loginSignInPatient: "ৰোগী হিচাপে প্ৰৱেশ",
    loginFooter: "সুৰক্ষিত আৰু ABDM নিয়ম সন্মত • ১০০% অফলাইন ব্যৱহাৰোপযোগী",
    loginInvalidCredentials: "ভুল তথ্য। অনুগ্ৰহ কৰি আপোনাৰ ইমেইল/আইডি আৰু পাছৱৰ্ড পৰীক্ষা কৰক।",
    loginReadGuidance: "পৰ্টেলত প্ৰৱেশ কৰক। আপোনাৰ ভূমিকা বাছক আৰু তথ্য দি প্ৰৱেশ কৰক।",
    loginNERBadge: "উত্তৰ-পূৰ্বাঞ্চল মাল্টি-ইউজাৰ টেলি-কেয়াৰ ব্যৱস্থা",

    // Patient Portal hardcoded
    photoCountLabel: "ফটো",
    recognizedTodayLabel: "আজি চিনাক্ত কৰা হ'ল",
    addedByCaregiver: "যত্নকাৰীয়ে যোগ কৰা",
    noFamilyPhotosTitle: "কোনো পৰিয়ালৰ ফটো যোগ কৰা হোৱা নাই",
    noFamilyPhotosDesc: "আপোনাৰ পৰিয়ালৰ যত্নকাৰীয়ে পৰ্টেলৰ পৰা চিনাকি ফটো যোগ কৰিব পাৰে।",
    situationRegionLabel: "অঞ্চল",
    situationStateLabel: "ৰাজ্য",
    situationQuestionLabel: "প্ৰশ্ন",
    situationWonderfulChoice: "অতি সুন্দৰ পছন্দ!",
    situationSafeDecision: "আপোনাৰ ঘৰৰ বাবে নিৰাপদ আৰু সুস্থিৰ সিদ্ধান্ত।",
    moduleSubFamilyRecognition: "পৰিয়াল চিনাক্তকৰণ",
    moduleSubRegionalSafety: "আঞ্চলিক সুৰক্ষা আৰু বিবেচনা",
    moduleSubHeritageMatch: "ঐতিহ্য প্ৰতীক খেল",
    gridPairsLabel: "যোৰ",
  },

  trp: {
    appName: "ককবৰক স্বা স্থ (Project O.C.T.A.V.E.)",
    appSubtitle: "ত্রিপুরা অমসুং অৱাং-নোংপোকনি অহনরগনিন বাগৈ এআই কগ্নিটিভ সেবা",
    tagline: "অফলাইন সান্ব নাইমা ত্রিপুরা অমসুং পাহাড়ি এলাকা অহনরগনিন সেবা",
    onlineStatus: "ক্লাউড তান কলাইমা",
    offlineStatus: "অফলাইন মোড (স্থানিক সঞ্চয়)",
    syncedSuccess: "জত অফলাইন তথ্য কলাই সফল অংখা!",
    changesPendingSync: "কলাইমানি তথ্য সংচিত অংখা",
    offlineModeNotice: "ইন্টারনেট ক্বরৈফা কাম খালাই নাই। পাহাড়ি গাঙঅ সান্ব নাই।",
    testOfflineToggle: "নেটওয়ার্ক টেস্ট",
    simulateOffline: "অফলাইন মোড খাজা",
    returnToOnline: "অনলাইন সম্নউ",
    languageSelectLabel: "কক / Language",
    audioSpeak: "খনানই নাইমু (Audio)",
    audioStop: "থকানি",
    backToHub: "← মূল কেন্দ্র তান ফাইনাই",
    textSize: "আখর বরক",
    textSizeNormal: "অ",
    textSizeLarge: "অ+",
    textSizeExtraLarge: "অ++",

    portalPatientTitle: "রোগীনি কোঠা (Patient Portal)",
    portalPatientSubtitle: "শান্তিময় স্মৃতি খেল অমসুং নখোরনি ফটো চিনমু",
    portalCaregiverTitle: "যত্নকাড়িনী ড্যাশবোর্ড (Caregiver)",
    portalCaregiverSubtitle: "সাননি কাম, ফটো হাপমু অমসুং ডাক্তারন খবর রিমু",
    portalDoctorTitle: "ডাক্তারনি ড্যাশবোর্ড (Doctor)",
    portalDoctorSubtitle: "স্মৃতি অগ্রগতি, ৩০ সাননি রিপোর্ট অমসুং পরামর্শ",

    patientPortalHeader: "খাতুংগুর! শান্তি সান্ব স্মৃতি খেলাইমু",
    patientPortalSubheader: "কোনো টাইম নাই, চম্পায় খেলাইমু। জত চেষ্টা প্রশংসা কলাইমু।",
    modulePhotoQuiz: "নখোরনি ফটো কুইজ",
    moduleSituationTest: "সাননি বিচার খেল",
    moduleGridMatch: "শান্ত প্রতীক মিলমু",
    photoQuizDesc: "খোরাং খানানই নখোরনি আত্মীয় চিনমু",
    situationTestDesc: "সাননি জীবন নিরাপদ বিচার খালাইমু",
    gridMatchDesc: "ত্রিপুরা অমসুং লোক সংস্কৃতি প্রতীক মিলমু",

    photoQuizTitle: "নখোরনি বরক চিনমু",
    photoQuizPromptPrefix: "অসি নিনি",
    btnYes: "অয় (YES)",
    btnNo: "নয়া (NO)",
    quizCorrectFeedback: "অত্যন্ত কলাইমা! কুবুই উত্তর! নিনি স্মৃতি বরক চমৎকার!",
    quizGentleRetry: "নিনি চেষ্টা হাম্বাই! চাম্বা খেলাই আমুক নাইমু।",
    quizNextButton: "পরবর্তী নখোরনি বরক →",
    quizScoreLabel: "তানি চিনমু নখোরনি বরক",
    recognizingFamilyMember: "নখোরনি ফটো",
    uploadedPhotoBadge: "যত্নকাড়ি হাপমা",
    customUploadedByCaregiver: "নখোরনি বরক হাপমা",

    situationTestTitle: "সাননি নিরাপত্তা অমসুং বিবেচনা",
    situationPrompt1: "নোকনি ফ্রাং বাইর তান থানাই মতম। থানাইনিন আগৈ তাবু খালাইমু?",
    situationOption1A: "নোকনি দুয়ার ভাল কই বন্ধ খালাইমু",
    situationOption1B: "টিভি অন খাইনই থানাইমু",
    situationPrompt2: "পাহাড়অ নোখার কিতুক অংখা, ওয়াত ফাইনা সম। তাবু মুং পায়মু?",
    situationOption2A: "ছাতি পায়নাইমু",
    situationOption2B: "কাগজনি বিচনী পায়নাইমু",
    situationPrompt3: "ফালোক ৮ বাজে হিদাক তানাই সম অংখা। তাবু তুক থকমু?",
    situationOption3A: "উসুম কলাই তুই থকমু",
    situationOption3B: "ঠাণ্ডা কোল্ড ড্রিঙ্ক থকমু",
    situationCorrectFeedback: "খাতুংগুর বুদ্ধিমান বিচার! অত্যন্ত নিরাপদ।",
    situationEncourageFeedback: "হাম্বাই! দুয়ার বন্ধ খালাইলে নোক নিরাপদ তংমু।",
    nextScenarioBtn: "পরবর্তী প্রশ্ন তান থানাইমু →",

    // Regional Scenarios - Assam
    asSitPrompt1: "ফালোক ৭:৩০ বাজে নোকঅ লাল চা চাফোংলাংনি হুইসেল ফাংখা। অহানিনিন আগৈ তাবু খালাইমু?",
    asSitOption1A: "চা তানাইনিন আগৈ শুকনো কাপোড়বাই গ্যাস স্টোভ বন্ধ খালাইমু",
    asSitOption1B: "উসুম স্টোভঅ তিতা য়াগবাই হাত ছুনাইমু",
    asSitPrompt2: "হঠাৎ তের বোরখাই ফাইখা। নামঘর বা বাজারঅ থানাই সম অংখা। তাবু মুং পায়মু?",
    asSitOption2A: "বড় ছাতি পায়মু অমসুং পিচ্ছিল খাই তংগ্রুক স্যান্ডেল গানমু",
    asSitOption2B: "পিচ্ছিল লাল মাটিনি রাস্তাঅ খালি য়াগবাই তান থানাইমু",
    asSitPrompt3: "সালনি চা তানি উলো গুয়াহাটিঅ গরম বোরখা অমসুং মেখেন ছারুংখা। তাবু খুক চুলাইমু?",
    asSitOption3A: "গ্লাস সে তুই থকমু অমসুং ঠান্ডা খাটঅ বিশ্রাম তানাইমু",
    asSitOption3B: "টুপি কুবিলই কিসিম সাননি খুকঅ রাস্তাঅ থানাইমু",
    asSitPrompt4: "টেবিলঅ তুই গ্লাসনি গথংঅ ফালোকনি দবানি ট্যাবলেট দনখা। তাবু তুক খালাইমু?",
    asSitOption4A: "নিয়ম তংগ্রুক পুড়া গ্লাস সে তুইবাই ট্যাবলেট চানাইমু",
    asSitOption4B: "লাল চা থকখা বলি ট্যাবলেট চানা বাদ রিউমু",
    asSitPrompt5: "সানজা সম দুয়ারঅ কোক নাই খোনিখা, কিন্তু অচেনা বোরকনি খোং। তাবু তুক খালাইমু?",
    asSitOption5A: "সোর অংখা সাংমু অমসুং যত্নকাড়ি ফাইনা তুক দুয়ার খুলিমু না",
    asSitOption5B: "অচেনা বোরকনি বাগে দুয়ার পুর খোলেনই রিউমু",

    // Regional Scenarios - Nagaland
    nagSitPrompt1: "কোহিমাঅ পাহাড়ি রাস্তাঅ ফালোক খোজ তানাইনিন সম অংখা। ব্রুক তুক তান থানাইমু?",
    nagSitOption1A: "ভাল গ্রিপ তংমু জুতা গানমু অমসুং ওয়াথু লাঠিবাই ভর রিনই থানাইমু",
    nagSitOption1B: "পিচ্ছিল পাহাড়ি রাস্তাঅ পাতলা প্লাস্টিক স্যান্ডেল গানমু",
    nagSitPrompt2: "পাকঘরঅ খুয়া মেকাঅ ওয়াথুনি থুয়া বোরখা। তাবু খুক চুলাইমু?",
    nagSitOption2A: "থুয়া বাইর তান থানাইনিন বাগে কাঠনি খিড়কি খুলেনই রিউমু",
    nagSitOption2B: "জত দুয়ার খিড়কি বন্ধ খালাই থুয়া উশাত গানমু",
    nagSitPrompt3: "সান ডুবিখা অমসুং পাহাড়ি ঠান্ডা বার বারখা। তাবু তুক চুলাইমু?",
    nagSitOption3A: "উসুম নাগা শাল গানমু অমসুং নোকনি মনুঅ গরম তুই থকমু",
    nagSitOption3B: "ঠান্ডা বারনি খুকঅ পাতলা জামা গানই বাইর তান বোইমু",
    nagSitPrompt4: "গালহো চা তানি উলো খুখুক খাখা অংখা। তাবু তুক খুক চুলাইমু?",
    nagSitOption4A: "ফুথরবা উসুম তুই কাপ সে লাহে লাহে থকমু",
    nagSitOption4B: "বাইর ড্রামনি অপৰিষ্কাৰ নোখারনি তুই থকমু",
    nagSitPrompt5: "হর্ণবিল সম কাঠনি টেবিলঅ কেরোসিননি চাকি জ্বলি তংমু। গিদাইনিন আগৈ তাবু খালাইমু?",
    nagSitOption5A: "চাকি সাবধানবাই নিভায়মু অমসুং মজিয়াঅ দনই গিদাইমু",
    nagSitOption5B: "পুর রাত কাঠনি টেবিলঅ চাকি জ্বালেনই তনমু",

    // Regional Scenarios - Manipur
    mniSitPrompt1: "ইম্ফলনি উঠানঅ নুংথুঅ সবুজ শ্যাওলা অংখা। বাইর তান ব্রুক তুক তান থানাইমু?",
    mniSitOption1A: "ওয়াথু রেলিং দরি সাবধানে অমসুং সোজা য়াগ তান থানাইমু",
    mniSitOption1B: "শ্যাওলানি মথকঅ মেখেন নারিবিলই কিসিম দৌড়িয়া থানাইমু",
    mniSitPrompt2: "সানজামণি প্রার্থনা লোহুখা। মৈরা চাকি জ্বলি তংমু। নিরাপদ তুক চুলাইমু?",
    mniSitOption2A: "চাকি কাপোড়নি ফ্রাং দুরে নিরাপদ তংমা পরীক্ষা খালাইমু",
    mniSitOption2B: "জ্বলি তংগ্রুক চাকি মথকঅ শুকনা তোয়ালে জপেনই রিউমু",
    mniSitPrompt3: "ফালোক কাংহৌ চা তানি উলো খুলুম খাখা অংখা। তাবু তুক থকমু?",
    mniSitOption3A: "কাঁসানি গ্লাসঅ উসুম ফুথরবা তুই থকমু",
    mniSitOption3B: "পুর সান তুই অমত্তা থকমিনা",
    mniSitPrompt4: "নখোরনি বরকবাই লোকতাক হ্রদ নাই ফাইখা। সানজা সম গরম সান। তাবু মুং পায়মু?",
    mniSitOption4A: "টুপি গানমু অমসুং তুই বোতল পায়মু",
    mniSitOption4B: "টুপি বা তুই ছারিয়া সাননি খুকঅ ঘন্টা নুই তান থাইমু",
    mniSitPrompt5: "ইম্ফলঅ রাতঅ কারেন্ট চলিথাংখা। বাথরুমঅ থানাইনিন সম অংখা। নিরাপদ তুক চুলাইমু?",
    mniSitOption5A: "টর্চ লাইট পায়মু অমসুং দেয়াল দরি লাহে লাহে থানাইমু",
    mniSitOption5B: "আন্ধারনি মনুঅ পুর কিসিম দৌড়িয়া থানাইমু",

    // Regional Scenarios - Tripura
    trpSitPrompt1: "আগরতলাঅ ফালোকনি শিশিরবাই ওয়াথুনি রাস্তা পিচ্ছিল অংখা। তাবু ব্রুক তুক তান থানাইমু?",
    trpSitOption1A: "শুকনা মঝনি রাস্তাঅ রবারনি স্যান্ডেল গানই সাবধানে তান থানাইমু",
    trpSitOption1B: "পিচ্ছিল ওয়াথুনি মথকঅ দৌড়িয়া থানাইমু",
    trpSitPrompt2: "ত্রিপুরাঅ ৫:০০ বাজে সান ডুবিখা অমসুং ছায়াবাই বিভ্রান্ত অংখা। তাবু তুক চুলাইমু?",
    trpSitOption2A: "বারান্দানি লাইট জ্বালেনই নখোরনি বরকবাই আরাম তান বোইমু",
    trpSitOption2B: "লাইট কুবিলই আন্ধারঅ একলা বোই তংমু",
    trpSitPrompt3: "যত্নকাড়ি টেবিলঅ তুই কাপবাই ফালোকনি ট্যাবলেট দনখা। তাবু তুক চুলাইমু?",
    trpSitOption3A: "ফুথরবা তুই কাপবাই ফালোকনি ট্যাবলেট চানা রিউমু",
    trpSitOption3B: "ট্যাবলেট ময়লা ফাতলাঅ ফেলে রিউমু",
    trpSitPrompt4: "দুর্গা পূজা সম পড়োশিনী বোরক জ্বলি তংগ্রুক চাকি রীখা। তাবু তুক চুলাইমু?",
    trpSitOption4A: "নুই য়াগবাই সাবধানে দরি মজিয়াঅ নিরাপদ তনমু",
    trpSitOption4B: "এক আঙ্গুলবাই দরি পর্দ্দানি গথংঅ নাড়েনই তানমু",
    trpSitPrompt5: "ফালোক মুই বরোক চা তানি উলো বকোক ঘুরিখা। যত্নকাড়ি কাষনি খামপলাইঅ তংমু। অহানিনিন আগৈ তাবু খালাইমু?",
    trpSitOption5A: "লগে লগে বোইমু অমসুং যত্নকাড়িনী সাহায্য বাগে কুঘুমু",
    trpSitOption5B: "কারোনিনিন সালবিলই একলা বাজারঅ থানাইমু",

    gridMatchTitle: "সাংস্কৃতিক প্রতীক মিলমু",
    gridMatchInstruction: "অনৈ কার্ডঅ ক্লিক খাইনই মিলমু। শান্ত সান্ব খেলাইমু।",
    gridMoves: "ক্লিক সংখ্যা",
    gridMatchesFound: "জোড়া ফংখা",
    gridCompleteTitle: "আনন্দনি কক! জত প্রতীক চপ মিলখা!",
    gridCompleteDesc: "তানি নিনি মন অমসুং স্মৃতি উজ্জ্বল অংখা।",
    gridResetBtn: "আমুক খেলাইমু",
    cardTeaLeaf: "চা পাতা",
    cardGamosa: "রিয়া (Risa/Rikutu)",
    cardHornbill: "ময়না পাখি",
    cardBamboo: "ওয়া (Bamboo)",
    cardLotus: "পদ্ম ফুল",
    cardBrassBell: "ঘণ্টা",

    caregiverHeader: "যত্নকাড়িনী সেবা কেন্দ্র",
    caregiverSubheader: "সাননি কাম চালানা, ফটো হাপমু অমসুং ডাক্তারন খবর রিমু।",
    routineSectionTitle: "দৈনিক স্বাস্থ্য অমসুং যত্ন তালিকা",
    routineSectionDesc: "কাম সমাপ্ত অংলে টিক খালাইমু। স্বয়ংক্রিয় সেভ অংমু।",
    dailyCompletionRate: "তানি সমাপ্তি",
    taskMorningMeds: "ফালোকনি হিদাক অমসুং বিপি চেক",
    taskHydration: "তুই থকমু: ২ গ্লাস পরিষ্কার তুই",
    taskNutritiousMeal: "সাননি চাল-দাইল অমসুং পুষ্টিকর মাই",
    taskGentleWalk: "১৫ মিনিট বাগানঅ বা বারান্দায় হাঁটা",
    taskEveningTea: "সাঁঝনি তুলসী চা অমসুং জিরমু",
    taskNightRest: "হরনি শান্ত পরিবেশ অমসুং ঘুম",

    photoUploadSectionTitle: "নখোরনি স্মৃতি ফটো হাপমু",
    photoUploadSectionDesc: "ইছা, ইশুনি ফটো হাপমু। রোগীনি খেলঅ সঙ্গে সঙ্গে খানা থাংমু!",
    btnUploadPhoto: "+ নখোরনি ফটো হাপমু",
    inputPhotoName: "বরকনি মুং (যেমন: রাহুল, সুনীতা)",
    inputPhotoRelation: "সম্পর্ক (যেমন: ছলা, বুড়ক, নাতি)",
    photoSyncSuccess: "ফটো রোগীনি চিনমু খেলঅ সফল কই হাপখা!",
    photoPreviewTitle: "তংনাই ফটো রোক",
    photoSyncedQuizNote: "খেলঅ এক্টিভ তংখা",

    notesSectionTitle: "যত্নকাড়িনী নোট অমসুং ডাক্তারনি এলার্ট",
    notesSectionDesc: "রোগীনি মেজাজ, ঘুম বা স্বাস্থ্যের কক ইরি অমসুং ডাক্তারন রিমু।",
    inputNotePlaceholder: "তানি রোগীনি মন বা স্বাস্থ্য কৈতৈ তংখা ইয়ো ইরি...",
    btnSaveNote: "নোট সেভ খালাইমু",
    btnNotifyDoctor: "ডাক্তারন তাবু খবর রিমু",
    doctorNotifiedAlert: "ডাক্তার ডা০ বরুয়ান এনক্রিপ্টেড সংকেত কলাই রিখা!",
    recentNotesList: "সংরক্ষিত নোট রোক",
    categoryMood: "মননি অবস্থা",
    categoryAppetite: "মাই চানি ইচ্ছা",
    categorySleep: "ঘুম",
    categoryGeneral: "সাধারণ যত্ন",

    doctorHeader: "ক্লিনিক্যাল সেবা অমসুং স্মৃতি বিশ্লেষণ",
    doctorSubheader: "উত্তর-পূর্বাঞ্চলনি রোগী রোকনি দীর্ঘমেয়াদী বিশ্লেষণ (অফলাইন সঞ্চয়)।",
    patientListTitle: "নিবন্ধিত রোগী রোক",
    stageLabel: "স্মৃতি স্তর",
    riskStable: "সুস্থির (Stable)",
    riskMonitoring: "নজর রিমু লাগমু",
    riskAttention: "বিশেষ যত্ন লাগমু",
    analyticsTitle: "প্রধান স্বাস্থ্য সূচক",
    metricEngagement: "সাপ্তাহিক অংশগ্রহণ",
    metricMemory: "স্মৃতি শুদ্ধতা হার",
    metricAdherence: "নিয়মিত যত্ন পালন",
    cognitiveTrendTitle: "৩০ সাননি স্মৃতি অগ্রগতি রেখা",
    cognitiveTrendSub: "দৈনিক কুইজ অমসুং রুটিন চেক তৌই প্রস্তুত স্কোর",
    last30Days: "বিগত ৩০ সাননি স্কোর (১০০ মধ্য)",
    clinicalNotesTitle: "ডাক্তারনি পরামর্শ অমসুং নোট",
    clinicalNotesPlaceholder: "রোগীনিন পরামর্শ বা হিদাক পরিবর্তন ইয়ো ইরি...",
    btnSaveObservation: "রোগী নথিয়ো সেভ খালাইমু",
    clinicalSavedSuccess: "ডাক্তারনি নোট রোগী নথিয়ো সেভ অংখা!",
    recentObservations: "পূর্বনি ক্লিনিক্যাল নোট রোক",
    drSignature: "ডা০ পি. বরুয়া, এম.ডি. (নিউরোলজি) • আগরতলা / গুয়াহাটি",

    roleSelectionTitle: "ভূমিকা নির্বাচন পোর্টাল",
    roleSelectionSub: "রোগী, যত্নকারী বা ডাক্তারনি বাগৈ বিশেষ পোর্টাল নির্বাচন খাইদি",
    rolePatientTitle: "অহন / রোগী পোর্টাল",
    rolePatientSub: "শান্তিপূর্ণ স্মৃতি অনুশীলন অমসুং দৈনিক সুরক্ষানি কুইজ।",
    roleCaregiverTitle: "যত্নকারী পোর্টাল",
    roleCaregiverSub: "রোগী প্রোফাইল, দৈনিক রুটিন তালিকা, ফটো আপলোড অমসুং ডাক্তার অ্যালার্ট।",
    roleDoctorTitle: "ডাক্তার পোর্টাল",
    roleDoctorSub: "৩০ সাননি ক্লিনিক্যাল গ্রাফ অমসুং ডাক্তারনি প্রেসক্রিপশন নোট।",
    btnSelectRole: "পোর্টালো হাপদি",
    switchRole: "ভূমিকা বদলাউ",
    loggedInAs: "লগইন অংখা",
    linkedPatientLabel: "সংযুক্ত রোগী",
    quickSelectAccount: "অ্যাকাউন্ট নির্বাচন খাইদি",

    profileSetupTitle: "রোগী প্রোফাইল অমসুং সেটআপ",
    profileSetupSubtitle: "রোগী নাম, বয়স, এলাকা অমসুং জরুরি ফোন নম্বর",
    fieldPatientName: "রোগী সম্পূর্ণ নাম",
    fieldAge: "বয়স",
    fieldStateNE: "উত্তর-পূর্ব রাজ্য",
    fieldCityLocation: "শহর / গ্রাম",
    fieldMedicalStage: "স্মৃতি অবস্থা",
    fieldEmergencyName: "জরুরি যোগাযোগ নাম",
    fieldEmergencyRelation: "সম্পর্ক",
    fieldEmergencyPhone: "জরুরি ফোন নম্বর",
    fieldEmergencyNotes: "বিশেষ যত্ন নির্দেশ",
    btnSavePatientProfile: "রোগী তথ্য সেভ খাইদি",
    profileSavedSuccess: "রোগী তথ্য অফলাইনে সেভ অংখা!",

    privacyConsentTitle: "প্রাইভেসি অমসুং শেয়ারিং পারমিশন",
    privacyConsentSub: "রোগী নিয়ন্ত্রিত অনুমতি: কারে তথ্য দেখানি ক্ষমতা রগনিন",
    registeredCaregivers: "নিবন্ধিত যত্নকারী",
    registeredDoctors: "নিবন্ধিত ডাক্তার",
    sharingEnabled: "শেয়ারিং চালু",
    sharingDisabled: "শেয়ারিং বন্ধ",
    consentNotice: "পারমিশন বন্ধ খাইলে ডাক্তার তথ্য নুকয়া আংনাই।",
    telemetrySuspendedNotice: "রোগী ডেটা স্থগিত: রোগী বা যত্নকারী ডেটা শেয়ারিং বন্ধ খলাইখা।",
    guidePatientTest: "রোগীরে অনুশীলন করাইদি",
    guidePatientTestSub: "এই ডিভাইসো রোগী স্মৃতি টেস্ট শুরু খাইদি",
    tabProfileSetup: "রোগী প্রোফাইল অমসুং অনুমতি",
    tabDailyRoutine: "দৈনিক রুটিন",
    tabMemoryStudio: "ফটো স্টুডিও",
    tabCaregiverLog: "যত্নকারী নোট",

    // Patient Portal Layout
    patientWelcomeGreeting: "লামসগো খুকলাইখা",
    patientWelcomeSpeech: "লামসগো খুকলাইখা। তানি স্মৃতি অভ্যাস লাহে লাহে খালাইমু।",
    calmMemoryGym: "স্মৃতি চর্চা কেন্দ্র",
    listenAloud: "খোনাইমু",
    exitSignOut: "বাইর তান থানাইমু",
    everyMemoryPrecious: "জত স্মৃতি মূল্যবান। নিনি সম তান বিশ্রাম নাউমু।",

    // Login Screen
    loginSubtitle: "নিরাপদ লগইন পোর্টাল",
    loginRoleDoctor: "ডাক্তার",
    loginRoleCaretaker: "নখোরনি যত্নকাড়ি",
    loginRolePatient: "রোগী",
    loginDescDoctor: "ডাক্তার পোর্টাল: উত্তর-পূর্ব ভারতের ফাইল পরীক্ষা খালাইমু অমসুং নির্দেশ রিউমু।",
    loginDescCaretaker: "যত্নকাড়ি পোর্টাল: রোগীর তথ্য অমসুং সাননি নিয়ম পরিচালনা খালাইমু।",
    loginDescPatient: "রোগী পোর্টাল: শান্ত স্মৃতি ব্যায়াম, নখোরনি ফটো অমসুং নিরাপত্তা টেস্ট।",
    loginEmailLabelPatient: "রোগী ইমেইল বা অ্যাক্সেস কোড",
    loginEmailLabelStaff: "অফিসিয়াল ইমেইল",
    loginPasswordLabel: "পাসওয়ার্ড",
    loginPasswordLabelPatient: "পাসওয়ার্ড বা ৪-সংখ্যা পিন",
    loginSignInAs: "হিসাবে লগইন খালাইমু",
    loginSignInDoctor: "ডাক্তার হিসাবে লগইন",
    loginSignInCaretaker: "যত্নকাড়ি হিসাবে লগইন",
    loginSignInPatient: "রোগী হিসাবে লগইন",
    loginFooter: "ABDM নিয়ম মান্য • ১০০% অফলাইন চলে",
    loginInvalidCredentials: "ভুল তথ্য। দয়া করি আইডি অমসুং পাসওয়ার্ড পরীক্ষা খালাইমু।",
    loginReadGuidance: "পোর্টালে প্রবেশ খালাইমু। রোল বাছেনই তথ্য রিউমু।",
    loginNERBadge: "উত্তর-পূর্ব টেলি-কেয়ার সিস্টেম",

    // Patient Portal hardcoded
    photoCountLabel: "ফটো",
    recognizedTodayLabel: "তানি চিনমু",
    addedByCaregiver: "যত্নকাড়ি হাপমা",
    noFamilyPhotosTitle: "নখোরনি ফটো হাপমা অংখা না",
    noFamilyPhotosDesc: "নখোরনি যত্নকাড়ি ফটো হাপচিনাই পারিমু।",
    situationRegionLabel: "অঞ্চল",
    situationStateLabel: "রাজ্য",
    situationQuestionLabel: "প্রশ্ন",
    situationWonderfulChoice: "হাম্বাই অতি সুন্দর পছন্দ!",
    situationSafeDecision: "নোকনি বাগে নিরাপদ অমসুং সুস্থ বিচার।",
    moduleSubFamilyRecognition: "নখোর চিনমু",
    moduleSubRegionalSafety: "আঞ্চলিক নিরাপত্তা ও বিচার",
    moduleSubHeritageMatch: "ঐতিহ্য প্রতীক খেলা",
    gridPairsLabel: "জোড়া",
  },

  nag: {
    appName: "Project O.C.T.A.V.E. (Nagaland)",
    appSubtitle: "AI-Powered Cognitive Care & Remote Support for North East & Nagaland Hills",
    tagline: "High-contrast, offline-first memory care for our respected elders across Nagaland",
    onlineStatus: "Online Synced",
    offlineStatus: "Offline Mode (Local Storage)",
    syncedSuccess: "All offline patient data synced successfully!",
    changesPendingSync: "records saved offline on device",
    offlineModeNotice: "Fully works without internet across hill districts, villages, and remote centers.",
    testOfflineToggle: "Network Status Check",
    simulateOffline: "Switch to Offline Mode",
    returnToOnline: "Reconnect & Sync Now",
    languageSelectLabel: "Language / Nagamese",
    audioSpeak: "Listen Audio (Taishi)",
    audioStop: "Stop Audio",
    backToHub: "← Back to Main Hub",
    textSize: "Text Size",
    textSizeNormal: "A",
    textSizeLarge: "A+",
    textSizeExtraLarge: "A++",

    portalPatientTitle: "Patient Portal (Bimari Manu)",
    portalPatientSubtitle: "Peaceful memory games and family photo recognition",
    portalCaregiverTitle: "Caregiver Portal (Ghor Manu)",
    portalCaregiverSubtitle: "Daily routine checklist, photo sync, and doctor alert message",
    portalDoctorTitle: "Doctor Dashboard",
    portalDoctorSubtitle: "Clinical progress, 30-day memory graph, and doctor instructions",

    patientPortalHeader: "Welcome! Take Time for Peaceful Mind Exercise",
    patientPortalSubheader: "No rush, no timer. Every attempt is appreciated and loved.",
    modulePhotoQuiz: "Family Photo Game",
    moduleSituationTest: "Daily Sense & Safety",
    moduleGridMatch: "Peaceful Symbol Match",
    photoQuizDesc: "Hear voice and recognize beloved children and family members",
    situationTestDesc: "Safe everyday decisions around house and village",
    gridMatchDesc: "Match traditional Naga & NE heritage symbols peacefully",

    photoQuizTitle: "Family Recognition Quiz",
    photoQuizPromptPrefix: "Is this your",
    btnYes: "HOY (YES)",
    btnNo: "NAHOY (NO)",
    quizCorrectFeedback: "Bhal kotha! Ekdom correct! Your memory is very strong and clear!",
    quizGentleRetry: "Very good try! Let us look together carefully again.",
    quizNextButton: "Next Family Member →",
    quizScoreLabel: "Family Members Identified Today",
    recognizingFamilyMember: "Family Photo",
    uploadedPhotoBadge: "Family Uploaded",
    customUploadedByCaregiver: "Added by family caregiver",

    situationTestTitle: "Everyday Sense and Safety Test",
    situationPrompt1: "You are going outside from your house. What should you do before stepping out?",
    situationOption1A: "Lock Front Door Safely",
    situationOption1B: "Keep TV Turned On",
    situationPrompt2: "Dark clouds are gathering on the hills, it might rain soon. What will you take?",
    situationOption2A: "Take Umbrella Along",
    situationOption2B: "Take Paper Fan",
    situationPrompt3: "It is 8:00 AM morning breakfast and medicine time. What should you drink?",
    situationOption3A: "Drink Warm Clean Water",
    situationOption3B: "Drink Ice Cold Soda",
    situationCorrectFeedback: "Smart and safe choice! Very good practical thinking.",
    situationEncourageFeedback: "Good try! Locking the door keeps house peaceful and safe.",
    nextScenarioBtn: "Next Practical Test →",

    // Regional Scenarios - Assam
    asSitPrompt1: "Bikhiana 7:30 hoise aro Lal Saah ketli bishi gorom hoina siti bajise. Poila ki koribo lage?",
    asSitOption1A: "Saah dhalibo agote sukha kapra loi gas stove bhal pora bondho koribo",
    asSitOption1B: "Gorom burner ke bhija haath pora dhoribo",
    asSitPrompt2: "Bishi jor boroshun ahebo dhise. Bazaar ba Namghar jabo lage. Hath te ki lobo?",
    asSitOption2A: "Dangor Chhati lobo aro slip nohobole bhal siphil pindhibo",
    asSitOption2B: "Slippery pitika rasta te khali theng pora berabo",
    asSitPrompt3: "Bikhiana bhat khui thaka piche bishi gorom uthise aru soku thoki jabo dhise. Safest choice ki asey?",
    asSitOption3A: "Ek glass pani khabo aru thanda bistar te aram pora thakibo",
    asSitOption3B: "Bhal roud te topi naloi highway te berabo jabo",
    asSitPrompt4: "Table te pani glass logote rati puwa laga Donepezil dawa thoi disey. Ki koribo lage?",
    asSitOption4A: "Pura ek glass pani loi dawa ke regularly khabo",
    asSitOption4B: "Lal Saah khalo bhabina dawa khabole chari dibo",
    asSitPrompt5: "Bikhili piche duwar te kiba awaz ahese kintu awaz tu nasiniye. Ki koribo lage?",
    asSitOption5A: "Kun asey hudhibo aru caregiver aha tak duwar nakholibo",
    asSitOption5B: "Ajan manu karone logote pura duwar khuli dibo",

    // Regional Scenarios - Nagaland
    nagSitPrompt1: "Mokokchung / Kohima te mist aru steep hill slope te rati puwa walk koribo ulaise. Kineka step lobo?",
    nagSitOption1A: "Firm grip shoe pindhibo aru bamboo cane te dhorina aastey jabo",
    nagSitOption1B: "Wet steep slope te slippery plastic chappal pindhina berabo",
    nagSitPrompt2: "Kitchen te Meka jui pora bishi dhuwa ulaise. Logote ki koribo lage?",
    nagSitOption2A: "Dhuwa bahar jabo karone khati laga khirki khuli dibo",
    nagSitOption2B: "Sob duwar-khirki bondho korina dhuwa laga bhitor te bohi thakibo",
    nagSitPrompt3: "Beli dhalishe aru pahar pora thanda bikhili hawa marise. Ki koribo lage?",
    nagSitOption3A: "Warm Naga shawl gha pora lapatibo aru bhitor te gorom pani khabo",
    nagSitOption3B: "Bahar te patla vest pindhina freezing hawa te bohi thakibo",
    nagSitPrompt4: "Dimapur te Galho khui piche mukh bishi sukha lagey. Right thing ki asey?",
    nagSitOption4A: "Saaf boiled ba filter kora pani aastey aastey khabo",
    nagSitOption4B: "Bahar te open barrel laga rainwater khabo",
    nagSitPrompt5: "Hornbill festival time te wooden table te kerosene bati jwolise. Khutibo agote ki koribo?",
    nagSitOption5A: "Bati bhal pora bhujhai stone floor te rakhina khutibo jabo",
    nagSitOption5B: "Raat bhor wooden table te bati jwolai thoi dibo",

    // Regional Scenarios - Manipur
    mniSitPrompt1: "Imphal te boroshun pora courtyard pathor sob slippery moss hoise. Bahar te kineka step lobo?",
    mniSitOption1A: "Bamboo rail dhoribo aru theng flat aru bhal pora thoi aastey jaboo",
    mniSitOption1B: "Tol te nasalai moss upor te joldi joldi dauribo",
    mniSitPrompt2: "Sanamahi prayer piche prayer corner te Meira oil bati jwolise. Safe step ki asey?",
    mniSitOption2A: "Bati bhal stable asey aru cloth pora dur te asey check koribo",
    mniSitOption2B: "Jwolithaka bati upor te sukha cotton towel jhaapi dibo",
    mniSitPrompt3: "Kanghou khana piche gola bishi sukha lagise. Ki pibole lage?",
    mniSitOption3A: "Saaf kansa glass te warm boiled pani pibo",
    mniSitOption3B: "Pura din pani eku nakhai thakibo",
    mniSitPrompt4: "Family logote Loktak Lake sabole ahese. Dupor time te bishi roud asey. Ki lobo lage?",
    mniSitOption4A: "Dangor topi lagabo aru pani bottle sath te lobo",
    mniSitOption4B: "Topi aru pani nathakile bhi 2 ghanta roud te khara thakibo",
    mniSitPrompt5: "Raat te Imphal te line jaishey. Bathroom jabo mon hoise. Safest step ki asey?",
    mniSitOption5A: "Torch light lobo aru kaath te dhorina aastey aastey jabo",
    mniSitOption5B: "Andhar te room laga majhotey joldi joldi dauribo",

    // Regional Scenarios - Tripura
    trpSitPrompt1: "Agartala te rati puwa laga dew pora bamboo path bishi slip hoise. Kineka step lobo?",
    trpSitOption1A: "Rubber chappal pindhi sukha majhotey bhal pora aastey khuj koribo",
    trpSitOption1B: "Bhija slippery bamboo upor te joldi joldi dauribo",
    trpSitPrompt2: "Tripura te 5:00 PM te sundown hoi verandah te andhar ahe aru shadows confuse hoi. Ki koribo lage?",
    trpSitOption2A: "Verandah light jalabo aru family logote bhal pora bohibo",
    trpSitOption2B: "Light eku najalai andhar te ekla bohi thakibo",
    trpSitPrompt3: "Caregiver table te morning tablet aru cup thoi disey. Ki koribo lage?",
    trpSitOption3A: "Saaf pani cup loi morning tablet regularly khabo",
    trpSitOption3B: "Dawa ke dustbin te phela dibo",
    trpSitPrompt4: "Durga Puja te neighbour pora jwolithaka diya disey. Ki koribo lage?",
    trpSitOption4A: "Dui ta haath pora bhal dhori floor te steadily rakhibo",
    trpSitOption4B: "Ekta finger te dhori curtain osor te hallai thakibo",
    trpSitPrompt5: "Mui Borok khana piche matha ghurise aru caregiver osor room te asey. Poila ki koribo lage?",
    trpSitOption5A: "Logote bohi jabo aru sahay karone caregiver ke matibo",
    trpSitOption5B: "Kunubake nukoi ekla bazaar joldi joldi jabo",

    gridMatchTitle: "Heritage Symbol Matching",
    gridMatchInstruction: "Tap two cards to match traditional symbols. Take your time without rush.",
    gridMoves: "Taps",
    gridMatchesFound: "Pairs Matched",
    gridCompleteTitle: "Superb job! You found all traditional pairs!",
    gridCompleteDesc: "Your mind and focus are very sharp today.",
    gridResetBtn: "Play Another Calm Game",
    cardTeaLeaf: "Hill Tea Leaves",
    cardGamosa: "Traditional Shawl",
    cardHornbill: "Hornbill Feather",
    cardBamboo: "Bamboo Crafts",
    cardLotus: "Loktak Lotus",
    cardBrassBell: "Village Brass Bell",

    caregiverHeader: "Caregiver Support & Village Coordination",
    caregiverSubheader: "Manage daily care, upload memory photos, and send alerts to doctor.",
    routineSectionTitle: "Daily Health & Routine Checklist",
    routineSectionDesc: "Tick items as they are finished. Automatically saves on device offline.",
    dailyCompletionRate: "Today's Progress",
    taskMorningMeds: "Morning Prescribed Medicine & BP Check",
    taskHydration: "Drink 2 Big Glasses of Clean Water",
    taskNutritiousMeal: "Warm Midday Rice, Greens & Dal",
    taskGentleWalk: "15-Minute Easy Walk in Courtyard",
    taskEveningTea: "Warm Herbal / Ginger Tea & Relaxation",
    taskNightRest: "Peaceful Night Sleep Preparation",

    photoUploadSectionTitle: "Family Memory Photo Uploader",
    photoUploadSectionDesc: "Upload photos of children, grandchildren, and relatives. Shows right inside patient's game!",
    btnUploadPhoto: "+ Upload Family Photo",
    inputPhotoName: "Family Member Name (e.g. Rahul, Sunita, Temsu)",
    inputPhotoRelation: "Relation (e.g. Son, Daughter, Grandchild)",
    photoSyncSuccess: "Photo synced instantly to patient recognition game!",
    photoPreviewTitle: "Active Family Memory Photos",
    photoSyncedQuizNote: "Active in Patient Photo Quiz",

    notesSectionTitle: "Caregiver Daily Observations & Doctor Alert",
    notesSectionDesc: "Keep log of elder's mood, food, or sleep. Send alert directly to regional doctor.",
    inputNotePlaceholder: "Write down patient's mood, sleep, or memory clarity today...",
    btnSaveNote: "Save Local Note",
    btnNotifyDoctor: "Notify Doctor Now (Urgent Alert)",
    doctorNotifiedAlert: "Alert message sent to Dr. Baruah via medical network!",
    recentNotesList: "Saved Caregiver Observations",
    categoryMood: "Mood",
    categoryAppetite: "Food / Appetite",
    categorySleep: "Sleep",
    categoryGeneral: "General Care",

    doctorHeader: "Clinical Tele-Care & Cognitive Analytics",
    doctorSubheader: "Monitoring patient progress across North East districts (offline-ready).",
    patientListTitle: "Registered Patients",
    stageLabel: "Dementia Stage",
    riskStable: "Stable",
    riskMonitoring: "Regular Monitoring",
    riskAttention: "Needs Urgent Attention",
    analyticsTitle: "Clinical Performance Metrics",
    metricEngagement: "Weekly Engagement Rate",
    metricMemory: "Memory Retention Rate",
    metricAdherence: "Medication Adherence",
    cognitiveTrendTitle: "30-Day Cognitive Trend Score",
    cognitiveTrendSub: "Combined daily memory quiz, situation logic, and routine completion",
    last30Days: "Past 30 Days (Out of 100)",
    clinicalNotesTitle: "Clinical Notes & Doctor Directives",
    clinicalNotesPlaceholder: "Type clinical diagnosis, medicine adjustments, or caregiver guidance...",
    btnSaveObservation: "Save to Patient Record",
    clinicalSavedSuccess: "Doctor's note saved to patient history offline!",
    recentObservations: "Patient Longitudinal Medical Notes",
    drSignature: "Dr. P. Baruah, MD (Neurology) • Regional Tele-Health Centre",

    roleSelectionTitle: "Role Selection & Login",
    roleSelectionSub: "Select your dedicated interface tailored for Elders, Family Caregivers, or Medical Professionals",
    rolePatientTitle: "Elder / Patient Portal",
    rolePatientSub: "Calm, gentle memory exercises and daily logic tests with zero distractions.",
    roleCaregiverTitle: "Family Caregiver Portal",
    roleCaregiverSub: "Manage patient profile, daily care checklist, family photo sync, and doctor alerts.",
    roleDoctorTitle: "Doctor / Clinical Portal",
    roleDoctorSub: "Multi-patient longitudinal analytics, 30-day cognitive trends, and clinical directives.",
    btnSelectRole: "Enter Portal",
    switchRole: "Switch User / Role",
    loggedInAs: "Logged in as",
    linkedPatientLabel: "Linked Patient",
    quickSelectAccount: "Select Account",

    profileSetupTitle: "Patient Setup & Profile Record",
    profileSetupSubtitle: "Manage patient personal details, North Eastern region home, and emergency contacts",
    fieldPatientName: "Patient Full Name",
    fieldAge: "Age (Years)",
    fieldStateNE: "North Eastern State",
    fieldCityLocation: "District / City / Village",
    fieldMedicalStage: "Cognitive Impairment Stage",
    fieldEmergencyName: "Primary Emergency Contact",
    fieldEmergencyRelation: "Relationship to Patient",
    fieldEmergencyPhone: "Emergency Phone",
    fieldEmergencyNotes: "Care Instructions & Health Alerts",
    btnSavePatientProfile: "Save Patient Record Changes",
    profileSavedSuccess: "Patient record & consent permissions saved successfully offline!",

    privacyConsentTitle: "Privacy & Telemetry Sharing Permissions",
    privacyConsentSub: "Patient-managed consent: Control who is authorized to view real-time cognitive telemetry and clinical data",
    registeredCaregivers: "Registered Caregivers",
    registeredDoctors: "Registered Medical Providers",
    sharingEnabled: "Telemetry Sharing Active",
    sharingDisabled: "Sharing Paused",
    consentNotice: "In accordance with National Digital Health (ABDM) patient privacy regulations, revoking permission immediately suspends telemetry data transmission to the provider.",
    telemetrySuspendedNotice: "Patient Telemetry Access Paused: The patient or primary caregiver has paused data sharing permissions for this doctor.",
    guidePatientTest: "Guide Patient in Exercises",
    guidePatientTestSub: "Launch today's cognitive memory session right from your device",
    tabProfileSetup: "Patient Profile & Consent",
    tabDailyRoutine: "Daily Routine Checklist",
    tabMemoryStudio: "Family Photo Studio",
    tabCaregiverLog: "Caregiver Notes & Alert",

    // Patient Portal Layout
    patientWelcomeGreeting: "Welcome",
    patientWelcomeSpeech: "Welcome. Take your time with today's calm memory exercises. There is no rush.",
    calmMemoryGym: "Calm Cognitive Memory Gym",
    listenAloud: "Listen Aloud",
    exitSignOut: "Exit / Sign Out",
    everyMemoryPrecious: "Every memory is precious. Take your time, rest whenever you wish.",

    // Login Screen
    loginSubtitle: "Secure Role-Based Authentication Portal",
    loginRoleDoctor: "Medical Doctor",
    loginRoleCaretaker: "Family Caretaker",
    loginRolePatient: "Elder Patient",
    loginDescDoctor: "Doctor Clinical Portal: Review patient files and monitor health trends across North East.",
    loginDescCaretaker: "Caretaker Management Portal: Manage patient routine, emergency contacts, and photo quizzes.",
    loginDescPatient: "Elderly Patient Portal: Calm memory gym, family photos, and regional safety questions.",
    loginEmailLabelPatient: "Patient Email or Access ID (e.g. RAMESH74)",
    loginEmailLabelStaff: "Official Email Address",
    loginPasswordLabel: "Password",
    loginPasswordLabelPatient: "Password or 4-Digit PIN",
    loginSignInAs: "Sign In as",
    loginSignInDoctor: "Doctor",
    loginSignInCaretaker: "Caretaker",
    loginSignInPatient: "Patient",
    loginFooter: "Role Isolation & ABDM Consent Compliant • 100% Offline-Ready",
    loginInvalidCredentials: "Invalid credentials. Please check your email/ID and password.",
    loginReadGuidance: "Login to your portal. Choose Doctor, Caretaker, or Patient role.",
    loginNERBadge: "North Eastern Region Multi-User Tele-Care System",

    // Patient Portal hardcoded
    photoCountLabel: "Photo",
    recognizedTodayLabel: "Recognized Today",
    addedByCaregiver: "Added by Caregiver",
    noFamilyPhotosTitle: "No Family Photos Added Yet",
    noFamilyPhotosDesc: "Your family caregiver can upload familiar photos to practice recognition.",
    situationRegionLabel: "Region",
    situationStateLabel: "State",
    situationQuestionLabel: "Question",
    situationWonderfulChoice: "Wonderful Choice!",
    situationSafeDecision: "Safe & healthy decision for your home.",
    moduleSubFamilyRecognition: "Family Recognition",
    moduleSubRegionalSafety: "Regional Safety & Reaction",
    moduleSubHeritageMatch: "Heritage Symbol Match",
    gridPairsLabel: "Pairs",
  },
};
