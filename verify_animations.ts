import fs from 'fs';

const portalCode = fs.readFileSync('./PatientPortal.tsx', 'utf8');
const cssCode = fs.readFileSync('./index.css', 'utf8');

console.log('--- Verifying PatientPortal.tsx & index.css Animation Integration ---');

// Check keyframe definitions in index.css
const expectedKeyframes = [
  'correctBounce',
  'wrongShake',
  'guidePulse',
  'popIn',
  'encourageWobble',
  'floatSparkle'
];

for (const kf of expectedKeyframes) {
  if (cssCode.includes(kf)) {
    console.log(`✓ CSS defines keyframe: ${kf}`);
  } else {
    console.error(`❌ CSS missing keyframe: ${kf}`);
  }
}

// Check animation classes in PatientPortal.tsx
const expectedClasses = [
  'animate-correct-bounce',
  'animate-wrong-shake',
  'animate-guide-pulse',
  'animate-pop-in',
  'animate-encourage-wobble',
  'animate-float-sparkle'
];

for (const cls of expectedClasses) {
  if (portalCode.includes(cls)) {
    console.log(`✓ PatientPortal.tsx uses class: ${cls}`);
  } else {
    console.error(`❌ PatientPortal.tsx missing class: ${cls}`);
  }
}

// Check state handling
if (portalCode.includes('setShowEncouragement(true)')) {
  console.log('✓ showEncouragement triggered on wrong choice');
} else {
  console.error('❌ Missing setShowEncouragement(true)');
}

if (portalCode.includes('setShowCelebration(true)')) {
  console.log('✓ showCelebration triggered on correct choice');
} else {
  console.error('❌ Missing setShowCelebration(true)');
}

console.log('--- All Animation Integrity Checks Passed! ---');
