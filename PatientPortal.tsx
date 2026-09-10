import React, { useState, useEffect } from 'react';
import { Language, PatientModuleType, FamilyPhotoItem, Patient, SituationScenario } from './types';
import { translations } from './translations';
import { REGIONAL_SITUATION_SCENARIOS, SITUATION_SCENARIOS } from './initialData';
import {
  Volume2,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  KeyRound,
  Tv,
  Umbrella,
  Wind,
  GlassWater,
  CupSoda,
  Heart,
  Award,
  Flame,
  Footprints,
  Bed,
  Sun,
  DoorClosed,
  AlertTriangle,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { speakText, playPositiveChime, playEncourageChime } from './speech';
import { ReadAloudButton } from './ReadAloudButton';
import { useWanderGuard } from './useWanderGuard';

interface PatientPortalProps {
  language: Language;
  familyPhotos: FamilyPhotoItem[];
  patient?: Patient;
  onGameActivityCompleted?: (module: string) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  language,
  familyPhotos,
  patient,
  onGameActivityCompleted,
}) => {
  useWanderGuard();

  const t = translations[language];
  const [activeModule, setActiveModule] = useState<PatientModuleType>('photo_quiz');

  // Photo Quiz State
  const [photoIndex, setPhotoIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [recognizedCount, setRecognizedCount] = useState(0);

  // Regional Situation Test State
  const defaultRegion = patient?.stateNE || 'Assam';
  const [selectedRegion, setSelectedRegion] = useState<string>(defaultRegion);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<'A' | 'B' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Sync region when patient prop changes
  useEffect(() => {
    if (patient?.stateNE) {
      setSelectedRegion(patient.stateNE);
      setScenarioIndex(0);
      setSelectedScenarioChoice(null);
      setScenarioFeedback(null);
      setShowCelebration(false);
      setShowEncouragement(false);
    }
  }, [patient]);

  // Load region-specific scenarios
  const regionalScenarios: SituationScenario[] =
    REGIONAL_SITUATION_SCENARIOS[selectedRegion] ||
    REGIONAL_SITUATION_SCENARIOS['Assam'] ||
    SITUATION_SCENARIOS;

  const currentScenario =
    regionalScenarios[scenarioIndex % regionalScenarios.length] || regionalScenarios[0];

  // Grid Match State
  const initialSymbols = [
    { key: 'tea', label: t.cardTeaLeaf, icon: '🌿', color: 'bg-emerald-100 text-emerald-900 border-emerald-400' },
    { key: 'gamosa', label: t.cardGamosa, icon: '🧣', color: 'bg-red-100 text-red-950 border-red-400' },
    { key: 'hornbill', label: t.cardHornbill, icon: '🪶', color: 'bg-amber-100 text-amber-950 border-amber-400' },
    { key: 'bamboo', label: t.cardBamboo, icon: '🎋', color: 'bg-green-100 text-green-950 border-green-400' },
    { key: 'lotus', label: t.cardLotus, icon: '🪷', color: 'bg-rose-100 text-rose-950 border-rose-400' },
    { key: 'bell', label: t.cardBrassBell, icon: '🔔', color: 'bg-yellow-100 text-yellow-950 border-yellow-400' },
  ];

  // Prepare double deck (12 cards)
  const [gridDeck, setGridDeck] = useState<Array<{ id: number; symbolKey: string; label: string; icon: string; color: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [isGridFinished, setIsGridFinished] = useState(false);

  const initGridGame = () => {
    const pairs = [...initialSymbols, ...initialSymbols].map((item, idx) => ({
      id: idx,
      symbolKey: item.key,
      label: item.label,
      icon: item.icon,
      color: item.color,
      flipped: false,
      matched: false,
    }));
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setGridDeck(shuffled);
    setFlippedIndices([]);
    setMatchedCount(0);
    setMovesCount(0);
    setIsGridFinished(false);
  };

  useEffect(() => {
    initGridGame();
  }, [language]);

  const currentPhoto = familyPhotos.length > 0
    ? (familyPhotos[photoIndex % familyPhotos.length] || familyPhotos[0])
    : null;

  // Photo Quiz Prompt text
  const currentPhotoPrompt = currentPhoto
    ? `${t.photoQuizPromptPrefix} ${currentPhoto.relation || currentPhoto.name}?`
    : '';

  const handleAnswerPhotoQuiz = (_isYes: boolean) => {
    if (quizFeedback) return; // prevent rapid clicks during feedback timeout
    playPositiveChime();
    setQuizFeedback(t.quizCorrectFeedback);
    setRecognizedCount((prev) => prev + 1);
    onGameActivityCompleted?.('photo_quiz');

    speakText(t.quizCorrectFeedback, language);

    setTimeout(() => {
      setQuizFeedback(null);
      setPhotoIndex((prev) => familyPhotos.length > 0 ? (prev + 1) % familyPhotos.length : 0);
    }, 2400);
  };

  // Scenario Text — derive translation keys from the scenario id (e.g. "mni-sit-1" → "mniSitPrompt1")
  // Key format: <regionCode>SitPrompt<N>  /  <regionCode>SitOption<N>A|B
  const buildScenarioKeys = (id: string) => {
    // id examples: "as-sit-1", "nag-sit-3", "mni-sit-2", "trp-sit-4"
    const parts = id.split('-');
    if (parts.length >= 3) {
      const regionCode = parts[0];  // "as" | "nag" | "mni" | "trp"
      const num = parts[2];         // "1" .. "5"
      return {
        promptKey: `${regionCode}SitPrompt${num}`,
        optionAKey: `${regionCode}SitOption${num}A`,
        optionBKey: `${regionCode}SitOption${num}B`,
      };
    }
    return null;
  };

  const scenarioKeys = buildScenarioKeys(currentScenario.id);
  const tDict = t as Record<string, string>;

  // Prefer translated key → fallback to hardcoded English text → fallback to promptKey string
  const scenarioPromptText =
    (scenarioKeys && tDict[scenarioKeys.promptKey]) ||
    currentScenario.promptText ||
    tDict[currentScenario.promptKey] ||
    currentScenario.promptKey;

  const optionAText =
    (scenarioKeys && tDict[scenarioKeys.optionAKey]) ||
    currentScenario.optionA.text ||
    tDict[currentScenario.optionA.labelKey] ||
    currentScenario.optionA.labelKey;

  const optionBText =
    (scenarioKeys && tDict[scenarioKeys.optionBKey]) ||
    currentScenario.optionB.text ||
    tDict[currentScenario.optionB.labelKey] ||
    currentScenario.optionB.labelKey;

  const handleChoiceSituation = (choice: 'A' | 'B') => {
    if (selectedScenarioChoice !== null) return; // prevent double clicks

    setSelectedScenarioChoice(choice);
    const selectedOption = choice === 'A' ? currentScenario.optionA : currentScenario.optionB;

    if (selectedOption.isCorrect) {
      playPositiveChime();
      setShowCelebration(true);
      setShowEncouragement(false);
      setScenarioFeedback(t.situationCorrectFeedback || '✓ Excellent choice! Safe & healthy decision.');
      speakText(t.situationCorrectFeedback || 'Excellent choice!', language);

      setTimeout(() => {
        setShowCelebration(false);
      }, 2800);
    } else {
      playEncourageChime();
      setShowCelebration(false);
      setShowEncouragement(true);
      setScenarioFeedback(t.situationEncourageFeedback || 'Take your time! Let\'s choose the safer step.');
      speakText(t.situationEncourageFeedback || 'Take your time!', language);

      setTimeout(() => {
        setShowEncouragement(false);
      }, 2800);
    }

    onGameActivityCompleted?.('situation_test');
  };

  const handleNextScenario = () => {
    setSelectedScenarioChoice(null);
    setScenarioFeedback(null);
    setShowCelebration(false);
    setShowEncouragement(false);
    setScenarioIndex((prev) => (prev + 1) % regionalScenarios.length);
  };

  // Helper for dynamic Lucide icon rendering
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Flame': return <Flame className={className} />;
      case 'Umbrella': return <Umbrella className={className} />;
      case 'Bed': return <Bed className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'Footprints': return <Footprints className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'GlassWater': return <GlassWater className={className} />;
      case 'DoorClosed': return <DoorClosed className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      default: return <KeyRound className={className} />;
    }
  };

  // Grid Match Tap
  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || gridDeck[index].flipped || gridDeck[index].matched) {
      return;
    }

    const nextFlipped = [...flippedIndices, index];
    const newDeck = [...gridDeck];
    newDeck[index].flipped = true;
    setGridDeck(newDeck);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMovesCount((m) => m + 1);
      const first = newDeck[nextFlipped[0]];
      const second = newDeck[nextFlipped[1]];

      if (first.symbolKey === second.symbolKey) {
        playPositiveChime();
        first.matched = true;
        second.matched = true;
        setGridDeck(newDeck);
        setFlippedIndices([]);
        const nextMatched = matchedCount + 1;
        setMatchedCount(nextMatched);

        if (nextMatched === initialSymbols.length) {
          setIsGridFinished(true);
          speakText(t.gridCompleteTitle, language);
          onGameActivityCompleted?.('grid_match');
        }
      } else {
        setTimeout(() => {
          const resetDeck = [...newDeck];
          resetDeck[nextFlipped[0]].flipped = false;
          resetDeck[nextFlipped[1]].flipped = false;
          setGridDeck(resetDeck);
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  // Calculate Option Styles — NOTHING highlighted before user clicks
  const hasSelected = selectedScenarioChoice !== null;
  const isSelectedA = selectedScenarioChoice === 'A';
  const isSelectedB = selectedScenarioChoice === 'B';
  const isCorrectA = currentScenario.optionA.isCorrect;
  const isCorrectB = currentScenario.optionB.isCorrect;

  // Derive inline styles per option — bypasses Tailwind purging entirely
  // so colors + animations are always applied reliably.
  const getOptionStyle = (isSelected: boolean, isCorrect: boolean, isOtherSelected: boolean, isOtherCorrect: boolean): React.CSSProperties => {
    if (!hasSelected) return {};
    if (isSelected && isCorrect) {
      return {
        background: '#16a34a',          // emerald-600
        color: '#ffffff',
        border: '4px solid #14532d',    // emerald-900
        boxShadow: '0 0 0 4px #86efac, 0 20px 40px rgba(22,163,74,0.35)', // ring-emerald-300 + shadow
        animation: 'correctBounce 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      };
    }
    if (isSelected && !isCorrect) {
      return {
        background: '#fee2e2',          // red-100
        color: '#450a0a',               // red-950
        border: '4px solid #ef4444',    // red-500
        boxShadow: '0 10px 30px rgba(239,68,68,0.25)',
        animation: 'wrongShake 0.65s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      };
    }
    if (!isSelected && isOtherSelected && !isOtherCorrect && isCorrect) {
      // Reveal correct answer when the other option was wrong
      return {
        background: '#f0fdf4',          // emerald-50
        color: '#052e16',               // emerald-950
        border: '4px solid #22c55e',    // emerald-500
        boxShadow: '0 8px 20px rgba(34,197,94,0.2)',
        animation: 'guidePulse 1.8s ease-in-out infinite',
      };
    }
    // Not selected, not the correct reveal → dimmed
    return {
      background: '#f1f5f9',            // slate-100
      color: '#94a3b8',                 // slate-400
      border: '2px solid #e2e8f0',      // slate-200
      opacity: 0.55,
    };
  };

  const optionAStyle = getOptionStyle(isSelectedA, isCorrectA, isSelectedB, isCorrectB);
  const optionBStyle = getOptionStyle(isSelectedB, isCorrectB, isSelectedA, isCorrectA);

  // Base class for buttons — hover styles only apply before selection
  const optionBaseClass = hasSelected
    ? 'p-6 sm:p-7 rounded-3xl font-black text-lg sm:text-xl text-left flex items-center gap-4 relative overflow-visible cursor-default border-3 border-slate-300'
    : 'p-6 sm:p-7 rounded-3xl font-black text-lg sm:text-xl text-left flex items-center gap-4 relative overflow-visible cursor-pointer border-3 border-slate-300 bg-white text-slate-900 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all duration-200 active:scale-95';

  // --- Voice Control Intent Listener ---
  useEffect(() => {
    const handleVoiceIntent = (e: any) => {
      const intent = e.detail;
      if (!intent) return;
      
      if (intent.type === 'NAVIGATE_MODULE') {
        setActiveModule(intent.value as PatientModuleType);
      } else if (intent.type === 'ANSWER_QUIZ') {
        if (activeModule === 'photo_quiz') {
          if (intent.value === 'YES') handleAnswerPhotoQuiz(true);
          else if (intent.value === 'NO') handleAnswerPhotoQuiz(false);
        } else if (activeModule === 'situation_test') {
          if (intent.value === 'OPTION_A' || intent.value === 'YES') handleChoiceSituation('A');
          else if (intent.value === 'OPTION_B' || intent.value === 'NO') handleChoiceSituation('B');
        } else if (activeModule === 'grid_match') {
          // If they say "first", click the first unflipped card, etc. (complex logic skipped for grid match voice)
        }
      } else if (intent.type === 'READ_ALOUD') {
        const btns = Array.from(document.querySelectorAll('button'));
        const readBtn = btns.find(b => b.id.includes('read') || b.getAttribute('aria-label')?.includes('Read') || b.title?.includes('Read'));
        if (readBtn) readBtn.click();
      }
    };

    window.addEventListener('VoiceIntent', handleVoiceIntent);
    return () => window.removeEventListener('VoiceIntent', handleVoiceIntent);
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      {/* Today's Plan Widget */}
      <div className="bg-white rounded-[3rem] p-6 sm:p-8 border-[4px] border-amber-100 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {new Date().getHours() < 12 ? '☀️ Good Morning' : new Date().getHours() < 17 ? '🌤️ Good Afternoon' : '🌙 Good Evening'}
            </h2>
            <p className="text-xl text-slate-600 mt-2 font-medium">Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <button 
              onClick={async () => {
                const OTP_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OTP_SERVER_URL || 'http://127.0.0.1:4001';
                try {
                  await fetch(`${OTP_SERVER_URL}/api/wander-guard/sos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentLat: 0, currentLng: 0, timestamp: Date.now() })
                  });
                  alert('Demo SOS Email Sent Successfully!');
                } catch (err) {
                  alert('Failed to send Demo SOS');
                }
              }}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-bold rounded-xl border-2 border-red-200 text-sm hover:bg-red-200 active:scale-95 transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Simulate Wander SOS (Demo)
            </button>
          </div>
          <div className="mt-4 sm:mt-0 px-6 py-3 bg-blue-50 text-blue-900 rounded-full border-[3px] border-blue-200 font-bold text-xl flex items-center gap-2">
            <Sun className="w-6 h-6" />
            Today's Plan
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
          {[
            { time: "09:00 AM", task: "Daily Health Check 💊", completed: true },
            { time: "11:30 AM", task: "Hydration Break 💧", completed: false },
            { time: "01:00 PM", task: "Lunch Time 🍲", completed: false },
            { time: "03:30 PM", task: "Family Time 📞", completed: false },
            { time: "06:00 PM", task: "Evening Walk 🚶", completed: false },
          ].map((reminder, idx) => (
            <div key={idx} className={`p-5 rounded-2xl flex items-center justify-between border-[3px] ${reminder.completed ? 'bg-emerald-50 border-emerald-200 opacity-75' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-xl font-bold text-lg ${reminder.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {reminder.time}
                </div>
                <span className={`text-xl sm:text-2xl font-semibold ${reminder.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                  {reminder.task}
                </span>
              </div>
              {reminder.completed && <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Module Selection Navigation Bar */}
      <div className="bg-white rounded-[3rem] p-6 sm:p-8 border-[4px] border-amber-100 shadow-sm mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            type="button"
            id="btn-module-photo-quiz"
            onClick={() => setActiveModule('photo_quiz')}
            className={`py-6 px-6 rounded-[2rem] font-semibold text-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer border-[4px] ${
              activeModule === 'photo_quiz'
                ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-10 h-10 stroke-[2.5]" />
            <span className="text-center">Look at family photos</span>
          </button>

          <button
            type="button"
            id="btn-module-situation-test"
            onClick={() => setActiveModule('situation_test')}
            className={`py-6 px-6 rounded-[2rem] font-semibold text-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer border-[4px] ${
              activeModule === 'situation_test'
                ? 'bg-blue-100 text-blue-900 border-blue-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-10 h-10 stroke-[2.5]" />
            <span className="text-center">Practice home safety</span>
          </button>

          <button
            type="button"
            id="btn-module-grid-match"
            onClick={() => setActiveModule('grid_match')}
            className={`py-6 px-6 rounded-[2rem] font-semibold text-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer border-[4px] ${
              activeModule === 'grid_match'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <Award className="w-10 h-10 stroke-[2.5]" />
            <span className="text-center">Play a matching game</span>
          </button>
        </div>
      </div>

      {/* MODULE 1: Family Photo Quiz */}
      {activeModule === 'photo_quiz' && (
        <div id="section-photo-quiz" className="bg-white rounded-[3rem] p-8 sm:p-12 border-[4px] border-amber-100 shadow-sm text-center">
          {currentPhoto ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
                <div>
                  <span className="inline-block px-6 py-2 rounded-full bg-rose-100 text-rose-900 font-semibold text-xl mb-2">
                    Family Photos
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-full border-[3px] border-amber-200">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <span className="font-semibold text-amber-900 text-xl">
                    {recognizedCount} {t.recognizedTodayLabel || 'Recognized Today'}
                  </span>
                </div>
              </div>

              <div className="relative inline-block mb-10">
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.name}
                  className="w-80 h-80 sm:w-[28rem] sm:h-[28rem] object-cover rounded-[3rem] border-[6px] border-white shadow-lg mx-auto"
                />
              </div>

              <div className="max-w-3xl mx-auto mb-10 bg-amber-50 p-8 rounded-[3rem] border-[4px] border-amber-100 shadow-sm">
                <div className="flex items-center justify-center gap-6">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-relaxed">
                    {currentPhotoPrompt}
                  </h3>
                  <ReadAloudButton
                    id="btn-speak-photo-prompt"
                    text={currentPhotoPrompt}
                    language={language}
                    size="lg"
                  />
                </div>
              </div>

              {quizFeedback && (
                <div className="mb-8 p-5 rounded-2xl bg-emerald-100 border-3 border-emerald-500 text-emerald-950 text-center font-black text-2xl animate-bounce flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  <span>{quizFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 max-w-2xl mx-auto">
                <button
                  type="button"
                  id="btn-quiz-yes"
                  onClick={() => handleAnswerPhotoQuiz(true)}
                  className="py-8 px-8 rounded-[3rem] bg-green-100 hover:bg-green-200 active:bg-green-300 text-green-900 font-semibold text-3xl sm:text-4xl shadow-sm border-[4px] border-green-200 active:scale-95 flex items-center justify-center gap-4 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-12 h-12" />
                  <span>Yes, that's right</span>
                </button>

                <button
                  type="button"
                  id="btn-quiz-no"
                  onClick={() => handleAnswerPhotoQuiz(false)}
                  className="py-8 px-8 rounded-[3rem] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-3xl sm:text-4xl shadow-sm border-[4px] border-slate-200 active:scale-95 flex items-center justify-center gap-4 cursor-pointer transition-all"
                >
                  <HelpCircle className="w-12 h-12" />
                  <span>I'm not sure</span>
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  id="btn-skip-next-photo"
                  onClick={() => {
                    playEncourageChime();
                    setPhotoIndex((prev) => (prev + 1) % Math.max(1, familyPhotos.length));
                  }}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-2xl inline-flex items-center gap-2 underline underline-offset-8 cursor-pointer p-4 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <span>Let's try another photo</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12">
              <Heart className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">{t.noFamilyPhotosTitle || 'No Family Photos Added Yet'}</h3>
              <p className="text-slate-600 font-medium max-w-md mx-auto">
                {t.noFamilyPhotosDesc || 'Your family caregiver can upload familiar photos and memories from the Caretaker Portal to practice recognition.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: REGION-SPECIFIC QUICK REACTION & SAFETY TEST */}
      {activeModule === 'situation_test' && (
        <div id="section-situation-test" className="bg-white rounded-[3rem] p-8 sm:p-12 border-[4px] border-amber-100 shadow-sm relative overflow-hidden">
          {/* CELEBRATION CONGRATS OVERLAY ANIMATION */}
          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center bg-emerald-950/10 backdrop-blur-[1px] animate-fade-in">
              <div className="bg-white/95 border-4 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-2 animate-bounce max-w-md mx-4">
                <div className="text-5xl sm:text-6xl">🎉 ✨ 🌟</div>
                <h4 className="text-2xl sm:text-3xl font-black text-emerald-900">
                  {t.situationWonderfulChoice || 'Wonderful Choice!'}
                </h4>
                <p className="text-base font-bold text-slate-700">
                  {t.situationSafeDecision || 'Safe & healthy decision for your home.'}
                </p>
              </div>
            </div>
          )}

          {/* ENCOURAGING GENTLE OVERLAY ANIMATION FOR WRONG SELECTION */}
          {showEncouragement && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center bg-amber-950/10 backdrop-blur-[1px] animate-fade-in">
              <div className="bg-white/95 border-4 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-2 animate-encourage-wobble max-w-md mx-4">
                <div className="text-5xl sm:text-6xl">🌱 💛 🤝</div>
                <h4 className="text-2xl sm:text-3xl font-black text-amber-900">
                  Take Your Time!
                </h4>
                <p className="text-base font-bold text-slate-700">
                  That's okay! We learn safely together step by step.
                </p>
              </div>
            </div>
          )}

          {/* Test Header with Region Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-6 py-2 rounded-full bg-blue-100 text-blue-900 font-semibold text-xl">
                  Safety Practice
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-900 font-medium text-lg border-[3px] border-amber-100">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>{selectedRegion}</span>
                </span>
              </div>
            </div>

            {/* Region Switcher Pills so patients or caregivers can explore sister states */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-2xl border border-slate-300 text-xs">
              <span className="text-slate-500 font-bold px-1.5 hidden sm:inline">{t.situationStateLabel || 'State'}:</span>
              {['Assam', 'Nagaland', 'Manipur', 'Tripura'].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => {
                    setSelectedRegion(st);
                    setScenarioIndex(0);
                    setSelectedScenarioChoice(null);
                    setScenarioFeedback(null);
                    setShowCelebration(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                    selectedRegion === st
                      ? 'bg-emerald-700 text-white shadow'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Card */}
          <div className="bg-amber-50 rounded-[3rem] p-8 sm:p-12 border-[4px] border-amber-100 mb-10 text-center max-w-4xl mx-auto shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border-[4px] border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
              {renderIcon(currentScenario.iconName, 'w-10 h-10')}
            </div>

            <h4 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-relaxed mb-8">
              {scenarioPromptText}
            </h4>

            <div className="flex justify-center">
              <ReadAloudButton
                id="btn-speak-situation-prompt"
                text={scenarioPromptText}
                language={language}
                variant="pill"
                size="lg"
              />
            </div>
          </div>

          {/* Feedback alert if selected */}
          {scenarioFeedback && (
            <div
              className={`mb-6 p-4 sm:p-5 rounded-2xl text-center font-black text-lg sm:text-xl flex items-center justify-center gap-3 border-3 shadow-xl ${
                selectedScenarioChoice &&
                (selectedScenarioChoice === 'A' ? currentScenario.optionA.isCorrect : currentScenario.optionB.isCorrect)
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-500 animate-pop-in'
                  : 'bg-amber-100 text-amber-950 border-amber-500 animate-encourage-wobble'
              }`}
            >
              {selectedScenarioChoice &&
              (selectedScenarioChoice === 'A' ? currentScenario.optionA.isCorrect : currentScenario.optionB.isCorrect) ? (
                <Sparkles className="w-7 h-7 text-emerald-700 shrink-0 animate-bounce" />
              ) : (
                <HelpCircle className="w-7 h-7 text-amber-700 shrink-0 animate-bounce" />
              )}
              <span>{scenarioFeedback}</span>
            </div>
          )}

          {/* Two Action Choice Buttons — NEUTRAL before any click */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 max-w-3xl mx-auto mb-8">
            {/* OPTION A */}
            <button
              key={`opt-a-${scenarioIndex}-${selectedScenarioChoice ?? 'none'}`}
              type="button"
              id="btn-situation-option-a"
              onClick={() => handleChoiceSituation('A')}
              disabled={hasSelected}
              className={optionBaseClass}
              style={optionAStyle}
            >
              {/* Floating celebration / warning badge */}
              {hasSelected && isSelectedA && isCorrectA && (
                <>
                  <span style={{position:'absolute', top:'-14px', right:'24px', background:'#fbbf24', color:'#0f172a', fontSize:'0.75rem', fontWeight:900, padding:'2px 14px', borderRadius:'9999px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', border:'2px solid #fff', display:'flex', alignItems:'center', gap:'4px', zIndex:10, animation:'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both'}}>
                    ✨ Correct! ✓
                  </span>
                  <div style={{position:'absolute', top:'-28px', left:'50%', transform:'translateX(-50%)', pointerEvents:'none', display:'flex', gap:'8px', fontSize:'1.5rem', zIndex:20, animation:'floatSparkle 1.4s ease-out forwards'}}>
                    <span>🎉</span><span>✨</span><span>🌟</span>
                  </div>
                </>
              )}
              {hasSelected && isSelectedA && !isCorrectA && (
                <span style={{position:'absolute', top:'-14px', right:'24px', background:'#dc2626', color:'#fff', fontSize:'0.75rem', fontWeight:900, padding:'2px 14px', borderRadius:'9999px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', border:'2px solid #fff', display:'flex', alignItems:'center', gap:'4px', zIndex:10, animation:'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both'}}>
                  ⚠️ Check Safer Choice ✗
                </span>
              )}
              {hasSelected && !isSelectedA && isCorrectA && isSelectedB && !isCorrectB && (
                <span style={{position:'absolute', top:'-14px', right:'24px', background:'#16a34a', color:'#fff', fontSize:'0.75rem', fontWeight:900, padding:'2px 14px', borderRadius:'9999px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', border:'2px solid #fff', display:'flex', alignItems:'center', gap:'4px', zIndex:10, animation:'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both'}}>
                  ✓ Recommended Safe Choice ✨
                </span>
              )}

              <div
                style={{
                  width:'48px', height:'48px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid', transition:'transform 0.3s',
                  ...(hasSelected && isSelectedA && isCorrectA ? { background:'#fff', color:'#065f46', borderColor:'#6ee7b7', transform:'scale(1.1)' } : {}),
                  ...(hasSelected && isSelectedA && !isCorrectA ? { background:'#fff', color:'#b91c1c', borderColor:'#fca5a5', transform:'scale(0.95)' } : {}),
                  ...(!hasSelected || (!isSelectedA) ? { background:'#fef3c7', color:'#92400e', borderColor:'#fcd34d' } : {}),
                }}
              >
                {hasSelected && isSelectedA && isCorrectA && <span style={{fontSize:'1.25rem', fontWeight:900}}>✓</span>}
                {hasSelected && isSelectedA && !isCorrectA && <span style={{fontSize:'1.25rem', fontWeight:900}}>✗</span>}
                {hasSelected && !isSelectedA && isCorrectA && isSelectedB && !isCorrectB && <span style={{fontSize:'1.25rem', fontWeight:900}}>✓</span>}
                {(!hasSelected || (hasSelected && !isSelectedA && !(isSelectedB && !isCorrectB && isCorrectA))) &&
                  renderIcon(currentScenario.optionA.icon, 'w-6 h-6 stroke-[2.5]')}
              </div>
              <span className="flex-1 leading-snug">
                {optionAText}
              </span>
            </button>

            {/* OPTION B */}
            <button
              key={`opt-b-${scenarioIndex}-${selectedScenarioChoice ?? 'none'}`}
              type="button"
              id="btn-situation-option-b"
              onClick={() => handleChoiceSituation('B')}
              disabled={hasSelected}
              className={optionBaseClass}
              style={optionBStyle}
            >
              {/* Floating celebration / warning badge */}
              {hasSelected && isSelectedB && isCorrectB && (
                <>
                  <span style={{position:'absolute', top:'-14px', right:'24px', background:'#fbbf24', color:'#0f172a', fontSize:'0.75rem', fontWeight:900, padding:'2px 14px', borderRadius:'9999px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', border:'2px solid #fff', display:'flex', alignItems:'center', gap:'4px', zIndex:10, animation:'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both'}}>
                    ✨ Correct! ✓
                  </span>
                  <div style={{position:'absolute', top:'-28px', left:'50%', transform:'translateX(-50%)', pointerEvents:'none', display:'flex', gap:'8px', fontSize:'1.5rem', zIndex:20, animation:'floatSparkle 1.4s ease-out forwards'}}>
                    <span>🎉</span><span>✨</span><span>🌟</span>
                  </div>
                </>
              )}
              {hasSelected && isSelectedB && !isCorrectB && (
                <span style={{position:'absolute', top:'-14px', right:'24px', background:'#dc2626', color:'#fff', fontSize:'0.75rem', fontWeight:900, padding:'2px 14px', borderRadius:'9999px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', border:'2px solid #fff', display:'flex', alignItems:'center', gap:'4px', zIndex:10, animation:'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both'}}>
                  ⚠️ Check Safer Choice ✗
                </span>
              )}
              {hasSelected && !isSelectedB && isCorrectB && isSelectedA && !isCorrectA && (
                <span style={{position:'absolute', top:'-14px', right:'24px', background:'#16a34a', color:'#fff', fontSize:'0.75rem', fontWeight:900, padding:'2px 14px', borderRadius:'9999px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', border:'2px solid #fff', display:'flex', alignItems:'center', gap:'4px', zIndex:10, animation:'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both'}}>
                  ✓ Recommended Safe Choice ✨
                </span>
              )}

              <div
                style={{
                  width:'48px', height:'48px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid', transition:'transform 0.3s',
                  ...(hasSelected && isSelectedB && isCorrectB ? { background:'#fff', color:'#065f46', borderColor:'#6ee7b7', transform:'scale(1.1)' } : {}),
                  ...(hasSelected && isSelectedB && !isCorrectB ? { background:'#fff', color:'#b91c1c', borderColor:'#fca5a5', transform:'scale(0.95)' } : {}),
                  ...(!hasSelected || (!isSelectedB) ? { background:'#fef3c7', color:'#92400e', borderColor:'#fcd34d' } : {}),
                }}
              >
                {hasSelected && isSelectedB && isCorrectB && <span style={{fontSize:'1.25rem', fontWeight:900}}>✓</span>}
                {hasSelected && isSelectedB && !isCorrectB && <span style={{fontSize:'1.25rem', fontWeight:900}}>✗</span>}
                {hasSelected && !isSelectedB && isCorrectB && isSelectedA && !isCorrectA && <span style={{fontSize:'1.25rem', fontWeight:900}}>✓</span>}
                {(!hasSelected || (hasSelected && !isSelectedB && !(isSelectedA && !isCorrectA && isCorrectB))) &&
                  renderIcon(currentScenario.optionB.icon, 'w-8 h-8 stroke-[2.5]')}
              </div>
              <span className="flex-1 leading-snug">
                {optionBText}
              </span>
            </button>
          </div>

          {/* Next Scenario Button */}
          <div className="text-center">
            <button
              type="button"
              id="btn-next-scenario"
              onClick={handleNextScenario}
              className="text-slate-600 hover:text-slate-900 font-semibold text-2xl inline-flex items-center gap-2 underline underline-offset-8 cursor-pointer p-4 rounded-full hover:bg-slate-50 transition-colors"
            >
              <span>Let's try another one</span>
            </button>
          </div>
        </div>
      )}

      {/* MODULE 3: Grid Match */}
      {activeModule === 'grid_match' && (
        <div id="section-grid-match" className="bg-white rounded-[3rem] p-8 sm:p-12 border-[4px] border-amber-100 shadow-sm text-center">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
            <div>
              <span className="inline-block px-6 py-2 rounded-full bg-amber-100 text-amber-900 font-semibold text-xl mb-2">
                Matching Game
              </span>
              <div className="flex items-center gap-3">
                <p className="text-xl sm:text-2xl text-slate-600 font-medium">
                  Find the two cards that match. Take your time.
                </p>
                <ReadAloudButton
                  id="btn-speak-grid-instructions"
                  text="Find the two cards that match. Take your time."
                  language={language}
                  size="sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-6 py-3 rounded-full bg-blue-50 border-[3px] border-blue-100 text-blue-900 font-semibold text-xl">
                {matchedCount} / {initialSymbols.length} Pairs
              </div>

              <button
                type="button"
                onClick={initGridGame}
                className="p-4 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border-[3px] border-slate-200 cursor-pointer"
                title="Reset Game"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isGridFinished && (
            <div className="mb-10 p-8 rounded-full bg-green-50 border-[3px] border-green-200 text-green-900 text-center font-semibold text-3xl animate-bounce space-y-3">
              <div className="text-5xl">🌟 🏆 🌿</div>
              <p>You did it! Beautifully done.</p>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {gridDeck.map((card, idx) => {
              const isRevealed = card.flipped || card.matched;
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  disabled={isRevealed}
                  className={`h-32 sm:h-40 rounded-[2rem] font-semibold text-4xl flex flex-col items-center justify-center transition-all duration-300 border-[4px] shadow-sm cursor-pointer select-none ${
                    isRevealed
                      ? `${card.color} rotate-0`
                      : 'bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-900'
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <span>{card.icon}</span>
                      <span className="text-lg sm:text-xl font-medium mt-2 line-clamp-1">
                        {card.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-5xl">🌿</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
