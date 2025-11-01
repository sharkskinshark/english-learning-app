let vocab = {};
let session = { words: [], index: 0, score: 0, level: '', category: '' };
let currentWord = '';
const synth = window.speechSynthesis;

// Preferred British female voice matching - optimized for human-like voices on iPad/iPhone
// IMPORTANT: Moira (Apple voice) is first for iOS devices - most human-like
const VOICE_PREFERENCES = [
  // iOS/macOS - Apple voices (FIRST PRIORITY - highest quality and most human-like on Apple devices)
  'Moira',      // PRIMARY: British female (iOS/macOS - highly natural and human-like)
  'Victoria',   // British female (iOS - natural and clear)
  'Fiona',      // British female (macOS - natural)
  'Serena',     // British female (iOS - premium quality)
  'Kate',       // British female (iOS - clear pronunciation)
  'Ellen',      // English female (iOS)
  'Samantha',   // English female (iOS - fallback)
  // Windows/Edge/Chrome - Microsoft Natural voices (human-like)
  'Microsoft Sonia Online (Natural)',
  'Microsoft Libby Online (Natural)', 
  'Microsoft Olivia Online (Natural)',
  'Microsoft Hazel',
  'Microsoft Zira Online (Natural)',
  // Google voices (good quality)
  'Google UK English Female',
  'Google UK English',
  // Fallbacks for other systems
  'en-GB female',
  'English Female',
  'English (United Kingdom)'
];

function pickBritishFemaleVoice() {
  try {
    const voices = (typeof synth?.getVoices === 'function') ? synth.getVoices() : [];
    if (!voices || voices.length === 0) {
      console.warn('No voices available');
      return null;
    }
    
    // Log available voices for debugging
    logAvailableVoices();
    
    const voiceStr = (v) => `${(v.name || '') + ' ' + (v.lang || '')}`.toLowerCase();

    // Filter for en-GB or UK English voices
    const enGb = voices.filter(v => {
      const s = voiceStr(v);
      return /en-gb|en_gb|english \(united kingdom\)|british|uk english|moira|victoria|fiona/i.test(s);
    });

    console.log('Found', enGb.length, 'British/en-GB voices:', enGb.map(v => v.name + ' (' + v.lang + ')').join(', '));

    // 1. Try exact preferred voice matches (EXACT - case insensitive)
    for (const pref of VOICE_PREFERENCES) {
      const match = voices.find(v => (v.name || '').toLowerCase() === pref.toLowerCase());
      if (match) {
        console.log('✓ EXACT MATCH:', match.name, '(' + match.lang + ')');
        return match;
      }
    }

    // 2. Try case-insensitive contains match
    for (const pref of VOICE_PREFERENCES) {
      const match = voices.find(v => (v.name || '').toLowerCase().includes(pref.toLowerCase()));
      if (match) {
        console.log('✓ PARTIAL MATCH:', match.name, '(' + match.lang + ')');
        return match;
      }
    }

    // 3. Pick en-GB voice with female indicators
    if (enGb.length > 0) {
      const femaleIndicators = /female|woman|lady|girl|ms|mrs|sonia|libby|olivia|moira|victoria|fiona|ellen|samantha/i;
      const female = enGb.find(v => femaleIndicators.test(v.name || ''));
      if (female) {
        console.log('✓ EN-GB FEMALE:', female.name, '(' + female.lang + ')');
        return female;
      }
      // Just return first en-GB if no female match
      console.log('✓ EN-GB (no female):', enGb[0].name, '(' + enGb[0].lang + ')');
      return enGb[0];
    }

    // 4. Fallback: any English voice with female indicators
    const engFemale = voices.find(v => {
      const s = voiceStr(v);
      return /^en/i.test(v.lang || '') && /female|woman|lady|girl/i.test(v.name || '');
    });
    if (engFemale) {
      console.log('✓ EN FEMALE FALLBACK:', engFemale.name, '(' + engFemale.lang + ')');
      return engFemale;
    }

    // 5. Final fallback: any English voice
    const eng = voices.find(v => /^en/i.test(v.lang || ''));
    if (eng) {
      console.log('✓ EN FALLBACK:', eng.name, '(' + eng.lang + ')');
      return eng;
    }

    // 6. Ultimate fallback: first available voice
    console.log('✓ FIRST VOICE:', voices[0].name, '(' + voices[0].lang + ')');
    return voices[0];
  } catch (e) {
    console.warn('Voice selection error:', e);
    return null;
  }
}

// Debug function to show all available voices
function logAvailableVoices() {
  try {
    const voices = (typeof synth?.getVoices === 'function') ? synth.getVoices() : [];
    console.log('=== ALL AVAILABLE VOICES ===');
    voices.forEach((v, i) => {
      console.log(`${i}: "${v.name}" (lang: ${v.lang}) [default: ${v.default}]`);
    });
    console.log('=== END VOICES ===');
  } catch (e) {
    console.warn('Error logging voices:', e);
  }
}
const PROGRESS_KEY = 'englishAppProgress';

// DOM Elements
const modeSelect = document.getElementById('modeSelect');
const levelSelect = document.getElementById('levelSelect');
const startBtn = document.getElementById('startBtn');
console.log('🔍 Start button found:', !!startBtn, startBtn);
if (startBtn) {
  console.log('🔍 Start button properties:', {
    disabled: startBtn.disabled,
    hidden: startBtn.classList.contains('hidden'),
    display: window.getComputedStyle(startBtn).display,
    visibility: window.getComputedStyle(startBtn).visibility,
    zIndex: window.getComputedStyle(startBtn).zIndex
  });
}
const progressSection = document.getElementById('progressSection');
const showProgressBtn = document.getElementById('showProgress');
const listenWordBtn = document.getElementById('listenWordBtn');
const spellingInput = document.getElementById('spellingInput');
const submitSpelling = document.getElementById('submitSpelling');
const spellingResult = document.getElementById('spellingResult');
const resultMessage = document.getElementById('resultMessage');
const correctAnswer = document.getElementById('correctAnswer');
const correctSpelling = document.getElementById('correctSpelling');
const wordImage = document.getElementById('wordImage');
const loadingMessage = document.getElementById('loadingMessage');

// Initialize button state
startBtn.disabled = true;
loadingMessage.style.display = 'inline';


// Progress tracking
function getProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  return saved ? JSON.parse(saved) : {};
}

// Listen and spell functionality
function speakWord(word) {
  if (!synth) {
    console.error('Speech synthesis not supported in this browser');
    alert('Speech synthesis is not supported in your browser. Please try a different browser.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  
  // Enhanced settings for iPad/iPhone with human-like British female voice
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
  
  utterance.lang = 'en-GB';
  
  // Optimized for human-like, steady and gentle speech on mobile devices
  if (isIOS) {
    utterance.rate = 0.75;    // Slower and more steady for iOS
    utterance.pitch = 1.0;    // Natural female pitch for iOS Moira voice
    utterance.volume = 0.9;   // Slightly softer volume
  } else if (isMobile) {
    utterance.rate = 0.8;     // Steady pace for Android
    utterance.pitch = 1.05;   // Gentle female pitch
    utterance.volume = 0.95;  // Clear but gentle volume
  } else {
    utterance.rate = 0.85;    // Desktop default
    utterance.pitch = 1.1;    // Desktop default
    utterance.volume = 1.0;   // Desktop default
  }

  const assignVoiceAndSpeak = () => {
    const voice = pickBritishFemaleVoice();
    if (voice) {
      utterance.voice = voice;
      console.log('Speaking with voice:', voice.name, '(' + voice.lang + ')');
    } else {
      console.warn('No suitable voice found, using system default');
    }
    // Cancel any queued utterances to avoid overlap
    try { synth.cancel(); } catch {}
    synth.speak(utterance);
  };

  // Voices may not be loaded immediately in some browsers (especially iOS/Safari)
  const voicesNow = (typeof synth?.getVoices === 'function') ? synth.getVoices() : [];
  if (!voicesNow || voicesNow.length === 0) {
    // Try again when voices load - important for iOS Safari
    const handler = () => {
      try { assignVoiceAndSpeak(); } finally { synth.onvoiceschanged = null; }
    };
    synth.onvoiceschanged = handler;
    // Fallback timeout in case onvoiceschanged doesn't fire (e.g., iOS)
    setTimeout(() => {
      if (synth.onvoiceschanged) { synth.onvoiceschanged = null; assignVoiceAndSpeak(); }
    }, 800);  // Increased timeout for iOS
  } else {
    assignVoiceAndSpeak();
  }
}

// ---------- Phonics analysis (Consonant/Vowel rules) ----------
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

function isLetter(ch){ return /[a-z]/i.test(ch); }
function isVowelAt(word, i){
  const ch = word[i].toLowerCase();
  if (!isLetter(ch)) return false;
  if (VOWELS.includes(ch)) return true;
  // treat 'y' as vowel when not the first letter and followed by a consonant
  if (ch === 'y') {
    if (i > 0) {
      const next = word[i+1]?.toLowerCase() || '';
      return next && (!isLetter(next) || !VOWELS.includes(next));
    }
  }
  return false;
}

function buildCVPattern(word){
  const letters = word.replace(/[^a-z]/gi, '').toLowerCase();
  let pattern = '';
  for (let i = 0; i < letters.length; i++) {
    pattern += isVowelAt(letters, i) ? 'V' : 'C';
  }
  // Detect magic-e (CVCe, CVCE, etc.)
  if (/e$/i.test(letters) && /[aeiouy]/i.test(letters.slice(0, -1))) {
    // mark as trailing 'e' indicator
    pattern += ' (e)';
  }
  return pattern;
}

function detectPhonicsRule(word, pattern){
  const w = word.toLowerCase();
  const letters = w.replace(/[^a-z]/g, '');
  const hasSilentE = letters.endsWith('e') && /[aeiouy]/.test(letters.slice(0, -1)) && /[^aeiouy]e$/i.test(letters);
  if (hasSilentE) {
    // find vowel before the final consonant-e
    const core = letters.slice(0, -1); // drop e
    const vowel = core.split('').reverse().find(ch => /[aeiou]/.test(ch)) || 'vowel';
    return `Magic e: final 'e' makes the ${vowel.toUpperCase()} long (e.g., a_e in "cake").`;
  }
  // Vowel teams
  if (/aa|ee|ea|ai|ay|oa|oe|ie|ee|oo|ue/.test(letters)) {
    return 'Vowel team: two vowels together often make a long vowel sound (e.g., ai, ea, oa).';
  }
  // Open syllable CV
  if (/^CV$/.test(pattern)) {
    return 'Open syllable (CV): the vowel is usually long (e.g., "me", "go").';
  }
  // Simple CVC
  if (/^CVC$/.test(pattern)) {
    return 'Closed syllable (CVC): the vowel is usually short (e.g., "cat", "dog").';
  }
  // Blends at start/end
  if (/^CCVC|CVCC/.test(pattern)) {
    return 'Consonant blend: read the blend together, short vowel in the middle (e.g., "stop", "milk").';
  }
  return 'Sound it out: read the consonant(s), then the vowel, then the ending.';
}

function chunkForSounding(word){
  const letters = word.toLowerCase();
  // Split by vowel groups to approximate onset-rime chunks
  const chunks = [];
  let i = 0;
  while (i < letters.length) {
    // onset (consonants)
    let onset = '';
    while (i < letters.length && !/[aeiouy]/.test(letters[i])) { onset += letters[i]; i++; }
    // nucleus (vowel group)
    let nucleus = '';
    while (i < letters.length && /[aeiouy]/.test(letters[i])) { nucleus += letters[i]; i++; }
    // coda (following consonants but stop before next vowel)
    let coda = '';
    while (i < letters.length && !/[aeiouy]/.test(letters[i])) {
      // keep final 'e' out of chunk if magic-e
      if (i === letters.length - 1 && letters[i] === 'e' && /[aeiou]/.test(nucleus)) break;
      coda += letters[i]; i++;
    }
    const chunk = (onset + nucleus + coda).trim();
    if (chunk) chunks.push(chunk);
  }
  // Add final silent e as note
  if (/[^aeiou]e$/i.test(letters)) {
    chunks.push('(silent e)');
  }
  return chunks.length ? chunks : [word];
}

function speakSoundOut(word){
  const chunks = chunkForSounding(word);
  let i = 0;
  
  // Enhanced settings for steady, gentle phonics pronunciation on iPad/iPhone
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
  
  const speakNext = () => {
    if (i >= chunks.length) { setTimeout(() => speakWord(word), 400); return; }
    
    const u = new SpeechSynthesisUtterance(chunks[i].replace(/[()]/g,''));
    u.lang = 'en-GB';
    
    // Optimized phonics settings for human-like, steady pronunciation
    if (isIOS) {
      u.rate = 0.65;      // Very steady and deliberate for iOS phonics
      u.pitch = 0.95;     // Slightly lower, more natural pitch for phonics
      u.volume = 0.85;    // Gentle volume for iOS
    } else if (isMobile) {
      u.rate = 0.7;       // Steady pace for Android phonics
      u.pitch = 1.0;      // Natural pitch for phonics
      u.volume = 0.9;     // Clear but gentle volume
    } else {
      u.rate = 0.75;      // Desktop phonics pace
      u.pitch = 1.05;     // Desktop phonics pitch
      u.volume = 0.95;    // Desktop phonics volume
    }
    
    const v = pickBritishFemaleVoice();
    if (v) u.voice = v;
    
    u.onend = () => { 
      i++; 
      // Longer pause between phonics chunks for better learning
      const pauseTime = isIOS ? 150 : (isMobile ? 120 : 100);
      setTimeout(speakNext, pauseTime); 
    };
    
    try { synth.speak(u); } catch { /* ignore */ }
  };
  
  try { synth.cancel(); } catch {}
  speakNext();
}

function analyzePhonics(word){
  const pattern = buildCVPattern(word);
  const tip = detectPhonicsRule(word, pattern);
  const chunks = chunkForSounding(word);
  return { pattern, tip, chunks };
}

function ensurePhonicsHelper(wordObj, container){
  let panel = document.getElementById('phonicsHelper');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'phonicsHelper';
    panel.style.marginTop = '8px';
    panel.style.padding = '8px 12px';
    panel.style.border = '1px solid #e0e0e0';
    panel.style.borderRadius = '8px';
    panel.style.background = '#fafafa';
    container.appendChild(panel);
  }
  const word = wordObj.word;
  const emoji = wordObj.emoji;
  const { pattern, tip, chunks } = analyzePhonics(word);
  const chunkText = chunks.join(' · ');
  panel.innerHTML = `
    <div style="font-weight:600; margin-bottom:6px;">Phonics helper</div>
    <div style="margin:2px 0; font-size:24px;">${emoji}</div>
    <div style="margin:2px 0;">Pattern: <code>${pattern}</code></div>
    <div style="margin:2px 0;">How to read: ${chunkText}</div>
    <div style="margin:2px 0; color:#555;">Tip: ${tip}</div>
    <button id="soundItOutBtn" class="btn" style="margin-top:6px;">🔊 Sound it out</button>
  `;
  const btn = panel.querySelector('#soundItOutBtn');
  btn.onclick = () => speakSoundOut(word);
}

function checkSpelling() {
  const userInput = spellingInput.value.trim().toLowerCase();
  if (!userInput) return;
  const current = session.words[session.index];
  const correct = userInput === current.word.toLowerCase();
  
  spellingResult.classList.remove('hidden');
  spellingResult.classList.remove('correct', 'wrong');
  spellingResult.classList.add(correct ? 'correct' : 'wrong');
  
  if (correct) {
    resultMessage.textContent = "✓ Correct! Well done!";
    correctAnswer.classList.add('hidden');
    session.score++;
    updateChallengesForAction('word_complete');
    if (!session.isReview) {
      updateChallengesForAction('perfect_spell');
    }
  } else {
    resultMessage.textContent = "✗ Not quite right. Let's see the correct answer:";
    correctAnswer.classList.remove('hidden');
    correctSpelling.textContent = current.word;
    wordImage.innerHTML = `<div class="word-emoji">${current.emoji}</div>`;
  }

  if (session.isReview && correct) {
    updateChallengesForAction('review_complete');
  }
  
  nextBtn.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
  scoreEl.classList.remove('hidden');
  scoreEl.textContent = `Score: ${session.score}`;
  
  updateProgress(session.level, session.category, correct ? 1 : 0, 1);
}

// Add event listeners for spelling practice (removed duplicates)
spellingInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkSpelling();
  }
});

function updateProgress(level, category, correct, total) {
  const progress = getProgress();
  if (!progress[level]) progress[level] = {};
  if (!progress[level][category]) progress[level][category] = { correct: 0, total: 0 };
  
  progress[level][category].correct += correct;
  progress[level][category].total += total;
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  displayProgress();
}

function displayProgress() {
  const progress = getProgress();
  const cards = document.querySelectorAll('.progress-card');
  
  // Update progress cards
  cards.forEach(card => {
    const level = card.dataset.level;
    const details = card.querySelector('.progress-details');
    details.innerHTML = '';
    
    if (progress[level]) {
      Object.entries(progress[level]).forEach(([category, stats]) => {
        const percent = Math.round((stats.correct / stats.total) * 100) || 0;
        const emoji = getCategoryEmoji(category);
        const totalInCategory = (vocab[level] && Array.isArray(vocab[level][category])) ? vocab[level][category].length : 0;
        const label = `${prettyCategoryLabel(category)} (${totalInCategory})`;
        details.innerHTML += `
          <div class="progress-category">
            <span class="category-emoji">${emoji}</span>
            <span>${label}: ${stats.correct}/${stats.total}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${percent}%"></div>
          </div>
        `;
      });
    }
  });

  // Update achievements grid
  const achievementsGrid = document.getElementById('achievementsGrid');
  achievementsGrid.innerHTML = '';
  
  // Safely get earned achievements and ACHIEVEMENTS list (these may be in achievements.js)
  const earned = (typeof getEarnedAchievements === 'function') ? getEarnedAchievements() : [];

  // Display all achievements (earned and locked) if ACHIEVEMENTS is available
  if (typeof ACHIEVEMENTS !== 'undefined' && Object.values(ACHIEVEMENTS).flat) {
    Object.values(ACHIEVEMENTS).flat().forEach(achievement => {
      const isEarned = earned.includes(achievement.id);
      achievementsGrid.innerHTML += `
        <div class="achievement-card ${isEarned ? '' : 'locked'}">
          <div class="achievement-emoji">${achievement.emoji}</div>
          <div class="achievement-title">${achievement.title}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
      `;
    });
  }
}

function getCategoryEmoji(category) {
  const emojis = {
    // Cambridge-style categories
    animals: '🐾',
    the_body_and_the_face: '👤',
    clothes: '👕',
    colours: '🎨', // British spelling
    colors: '🎨',  // fallback if US spelling appears
    family_and_friends: '�‍👩‍👧‍👦',
    food_and_drink: '🍽️',
    the_home: '🏡',
    materials: '🧱',
  names: '✨',
    numbers: '🔢',
    places_and_directions: '📍',
    school: '🏫',
    sports_and_leisure: '⚽',
    time: '⏰',
    toys: '🧸',
    transport: '🚗',
    weather: '⛅',
    work: '💼',
    the_world_around_us: '�',
    health: '🏥',
    // Legacy/custom categories used elsewhere in the UI
    nouns: '📚',
    actions: '�',
    descriptions: '✨'
  };
  return emojis[category] || '🔖';
}

// Already defined above
const exercise = document.getElementById('exercise');
const promptEl = document.getElementById('prompt');
const spellingArea = document.getElementById('spellingArea');
const meaningArea = document.getElementById('meaningArea');
const phonicsArea = document.getElementById('phonicsArea');
const phonicsWordDisplay = document.getElementById('phonicsWordDisplay');
const phonicsPronounceBtn = document.getElementById('phonicsPronounceBtn');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');

async function loadVocab(){
  try {
    loadingMessage.textContent = 'Loading vocabulary...';
    const res = await fetch('vocab.json');
    vocab = await res.json();
    
    console.log('✓ Vocabulary loaded successfully');
    console.log('  Starters categories:', Object.keys(vocab.starters || {}).length);
    console.log('  Movers categories:', Object.keys(vocab.movers || {}).length);
    console.log('  Flyers categories:', Object.keys(vocab.flyers || {}).length);
    
    // Enable the start button and hide loading message
    startBtn.disabled = false;
    loadingMessage.style.display = 'none';
    
    // Populate categories for the initially selected level
    try {
      updateCategoryOptions(levelSelect.value);
      console.log('✓ Categories populated for level:', levelSelect.value);
    } catch (e) {
      console.warn('Failed to populate categories:', e);
    }
    
    // Setup level change listener AFTER vocab is loaded
    if (levelSelect) {
      const handleLevelChange = (e) => {
        const newLevel = e.target.value;
        console.log('🔄 Level changed to:', newLevel);
        console.log('📋 Available vocab levels:', Object.keys(vocab));
        console.log('🔍 Vocab exists for this level?', vocab[newLevel] ? 'YES' : 'NO');
        if (vocab[newLevel]) {
          console.log('📦 Categories in this level:', Object.keys(vocab[newLevel]));
        }
        updateCategoryOptions(newLevel);
      };
      
      // Remove any existing listeners first
      levelSelect.removeEventListener('change', handleLevelChange);
      levelSelect.removeEventListener('input', handleLevelChange);
      
      // Add new listeners
      levelSelect.addEventListener('change', handleLevelChange);
      levelSelect.addEventListener('input', handleLevelChange);
      
      console.log('✓ Level change listener added inside loadVocab()');
    }
    
    updateReviewStats();
  } catch(e) {
    loadingMessage.textContent = 'Failed to load vocabulary. Please refresh the page.';
    loadingMessage.style.color = '#f44336';
    console.error('✗ Failed to load vocabulary:', e);
    startBtn.disabled = true;
  }
}

function updateReviewStats() {
  try {
    const stats = (typeof getReviewStats === 'function') ? getReviewStats() : { needsReview: 0, mastered: 0 };
    document.getElementById('reviewCount').textContent = stats.needsReview;
    document.getElementById('masteredCount').textContent = stats.mastered;
  } catch(e) {
    console.warn('updateReviewStats error:', e);
    document.getElementById('reviewCount').textContent = 0;
    document.getElementById('masteredCount').textContent = 0;
  }
}

function showAchievementNotification(achievement) {
  const notif = document.getElementById('achievementNotif');
  notif.querySelector('.achievement-emoji').textContent = achievement.emoji;
  notif.querySelector('.achievement-title').textContent = achievement.title;
  notif.classList.remove('hidden');
  setTimeout(() => notif.classList.add('hidden'), 3000);
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]
  }
}

function startSession(){
  console.log('startSession called');
  
  // Make exercise section visible
  exercise.classList.remove('hidden');
  
  const mode = document.getElementById('practiceMode').value;
  let wordList;
  
  if (mode === 'review') {
    if (typeof getWordsForReview !== 'function') {
      promptEl.textContent = 'Review mode not available. Please use Learn mode.';
      console.error('getWordsForReview function not found');
      return;
    }
    wordList = getWordsForReview();
    if (wordList.length === 0) {
      promptEl.textContent = 'No words to review yet! Try learning some new words first.';
      return;
    }
    session = {
      words: wordList,
      index: 0,
      score: 0,
      isReview: true
    };
  } else {
    const level = levelSelect.value;
    let category = document.getElementById('categorySelect').value;
    
    console.log('Level:', level, 'Category:', category);
    console.log('Vocab available:', !!vocab[level]);
    console.log('Category available:', vocab[level] ? !!vocab[level][category] : false);
    
    // If the selected category no longer exists for this level, switch to the first available
    if (vocab[level] && !vocab[level][category]) {
      const cats = Object.keys(vocab[level]);
      console.log('Category not found, available categories:', cats);
      if (cats.length > 0) {
        category = cats[0];
        document.getElementById('categorySelect').value = category;
        console.log('Switched to first available category:', category);
      }
    }

    if (!vocab[level] || !vocab[level][category]) {
      console.error('Failed to find words:', { level, category, hasLevel: !!vocab[level], hasCategory: vocab[level] ? !!vocab[level][category] : false });
      promptEl.textContent = `No words available for ${category} in ${level} level`;
      return;
    }
    
    console.log('Found words:', vocab[level][category].length);
    wordList = vocab[level][category].slice();
    shuffle(wordList);
    session = {
      words: wordList,
      index: 0,
      score: 0,
      level: level,
      category: category,
      isReview: false
    };
  }
  exercise.classList.remove('hidden');
  
  // Enhanced iPhone auto-scroll for all browsers (Safari, Edge, Chrome)
  const isMobile = window.innerWidth <= 768;
  const isIPhone = /iPhone/i.test(navigator.userAgent);
  const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome|CriOS|Edge|Edg/i.test(navigator.userAgent);
  const isEdge = /Edge|Edg/i.test(navigator.userAgent);
  const isChrome = /CriOS|Chrome/i.test(navigator.userAgent);
  
  if (isMobile || isIPhone) {
    const browserType = isSafari ? 'Safari' : (isEdge ? 'Edge' : (isChrome ? 'Chrome' : 'Unknown'));
    console.log(`📱 iPhone ${browserType} detected - preparing auto-scroll to input box "Type what you hear..."`);
    
    // Small delay to ensure DOM is updated after exercise section becomes visible
    setTimeout(() => {
      const spellingInput = document.getElementById('spellingInput');
      
      if (spellingInput) {
        console.log(`📱 Scrolling to input box on iPhone ${browserType}`);
        
        // Method 1: Modern scrollIntoView (Safari, Chrome)
        if (isSafari || isChrome) {
          try {
            spellingInput.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
            console.log(`📱 ${browserType}: Used scrollIntoView method for input box`);
          } catch (e) {
            console.log(`📱 ${browserType}: scrollIntoView failed, using fallback`);
          }
        }
        
        // Method 2: Manual calculation (Better for Edge, fallback for all)
        setTimeout(() => {
          const inputRect = spellingInput.getBoundingClientRect();
          const inputTop = inputRect.top + window.pageYOffset;
          const viewportHeight = window.innerHeight;
          const scrollToPosition = inputTop - (viewportHeight / 2) + (inputRect.height / 2);
          
          // Enhanced scrolling with browser-specific optimizations
          if (isEdge) {
            // Edge on iPhone sometimes needs explicit smooth scrolling
            window.scrollTo({
              top: scrollToPosition,
              behavior: 'smooth'
            });
            console.log(`📱 Edge: Used manual scroll to input position:`, scrollToPosition);
          } else if (isSafari) {
            // Safari iOS - use both methods for reliability
            window.scrollTo({
              top: scrollToPosition,
              behavior: 'smooth'
            });
            console.log(`📱 Safari: Used enhanced scroll to input position:`, scrollToPosition);
          } else if (isChrome) {
            // Chrome on iPhone - prefer smooth scrolling
            window.scrollTo({
              top: scrollToPosition,
              behavior: 'smooth'
            });
            console.log(`📱 Chrome: Used smooth scroll to input position:`, scrollToPosition);
          } else {
            // Fallback for any other browser
            window.scrollTo({
              top: scrollToPosition,
              behavior: 'smooth'
            });
            console.log(`📱 Fallback: Used scroll to input position:`, scrollToPosition);
          }
          
          // Additional verification for iPhone browsers
          setTimeout(() => {
            const currentScroll = window.pageYOffset;
            const targetReached = Math.abs(currentScroll - scrollToPosition) < 50;
            console.log(`📱 ${browserType}: Input scroll verification - Target: ${scrollToPosition}, Current: ${currentScroll}, Success: ${targetReached}`);
            
            // Final fallback if scroll didn't work
            if (!targetReached) {
              console.log(`📱 ${browserType}: Applying final fallback scroll to input`);
              window.scrollTo(0, scrollToPosition);
            }
          }, 800);
          
        }, 100); // Secondary delay for Edge compatibility
        
      } else {
        console.log('⚠️ Spelling input box not found for auto-scroll');
      }
    }, 300); // Primary delay to ensure DOM is ready
  }
  
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  scoreEl.classList.add('hidden');
  updateSessionProgress();
  showCurrent();
}

function updateSessionProgress(){
  progressEl.textContent = `${session.index} / ${session.words.length}`;
}

function showCurrent(){
  if(session.index >= session.words.length){
    finishSession();
    return;
  }
  const mode = modeSelect.value;
  const current = session.words[session.index];
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');
  scoreEl.classList.add('hidden');

  if(mode === 'spelling'){
    meaningArea.classList.add('hidden');
    phonicsArea.classList.add('hidden');
    spellingArea.classList.remove('hidden');
    spellingResult.classList.add('hidden');
    promptEl.textContent = 'Listen to the word and type what you hear.';
    spellingInput.value = '';
    spellingInput.focus();
    currentWord = current;
    
    // Reset result area
    resultMessage.textContent = '';
    correctAnswer.classList.add('hidden');
    wordImage.innerHTML = '';
    
    // Automatically speak the word
    setTimeout(() => speakWord(current.word), 500);
  }else if(mode === 'phonics'){
    spellingArea.classList.add('hidden');
    meaningArea.classList.add('hidden');
    phonicsArea.classList.remove('hidden');
    promptEl.textContent = 'Learn how to sound out this word.';
    phonicsWordDisplay.textContent = current.word;
    phonicsPronounceBtn.onclick = () => speakWord(current.word);
    const container = document.getElementById('phonicsHelperContainer');
    container.innerHTML = ''; // Clear previous
    ensurePhonicsHelper(current, container);
    // Show next button immediately since no input required
    nextBtn.classList.remove('hidden');
  }else{
    spellingArea.classList.add('hidden');
    phonicsArea.classList.add('hidden');
    meaningArea.classList.remove('hidden');
    promptEl.textContent = 'Choose the correct meaning:';
    document.getElementById('wordDisplay').textContent = current.word;
    document.getElementById('pronounceBtn').onclick = () => speakWord(current.word);
    renderChoices(current);
  }
  updateSessionProgress();
}

function renderChoices(current){
  choicesEl.innerHTML = '';
  // correct meaning + 3 random wrongs from other words
  const pool = [];
  // vocab is organized as { level: { category: [words...] } }
  for (const levelKey in vocab) {
    const levelObj = vocab[levelKey];
    for (const cat in levelObj) {
      const arr = levelObj[cat];
      if (Array.isArray(arr)) {
        arr.forEach(w => pool.push(w.meaning));
      }
    }
  }
  // remove exact duplicate of correct
  const uniquePool = pool.filter(m=>m!==current.meaning);
  shuffle(uniquePool);
  const options = uniquePool.slice(0,3).concat(current.meaning);
  shuffle(options);
  options.forEach(opt=>{
    const b=document.createElement('button');
    b.className='choiceBtn';
    b.textContent=opt;
    b.onclick=()=>checkMeaning(opt,current);
    choicesEl.appendChild(b);
  });
}

function checkMeaning(selected,current){
  const isCorrect = selected === current.meaning;
  if(isCorrect){
    feedbackEl.textContent='Correct!';
    feedbackEl.className='feedback ok';
    session.score++;
  }else{
    feedbackEl.textContent=`Nope — correct: ${current.meaning}`;
    feedbackEl.className='feedback bad';
  }
  // Color the buttons
  const buttons = document.querySelectorAll('.choiceBtn');
  buttons.forEach(btn => {
    if (btn.textContent === current.meaning) {
      btn.classList.add('correct');
    } else if (btn.textContent === selected && !isCorrect) {
      btn.classList.add('wrong');
    }
    btn.disabled = true; // Disable all buttons after choice
  });
  nextBtn.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
  scoreEl.classList.remove('hidden');
  scoreEl.textContent = `Score: ${session.score}`;
}

function next(){
  session.index++;
  updateSessionProgress();
  showCurrent();
}

// Celebration ribbons effect
function createCelebrationRibbons() {
  const ribbonContainer = document.createElement('div');
  ribbonContainer.id = 'ribbonContainer';
  ribbonContainer.style.position = 'fixed';
  ribbonContainer.style.top = '0';
  ribbonContainer.style.left = '0';
  ribbonContainer.style.width = '100%';
  ribbonContainer.style.height = '100%';
  ribbonContainer.style.pointerEvents = 'none';
  ribbonContainer.style.zIndex = '9999';
  document.body.appendChild(ribbonContainer);

  const ribbonColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF78D2', '#FFB627', '#8BE3D8'];
  const ribbonCount = 80; // Increased from 40
  
  // Create ribbons
  for (let i = 0; i < ribbonCount; i++) {
    setTimeout(() => {
      const ribbon = document.createElement('div');
      ribbon.className = 'celebration-ribbon';
      const color = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
      ribbon.style.background = color;
      ribbon.style.left = Math.random() * 100 + '%';
      ribbon.style.animationDelay = (i * 0.05) + 's';
      ribbonContainer.appendChild(ribbon);
    }, i * 30); // Faster stagger for more dense effect
  }

  // Create sparkles
  const sparkleCount = 100; // Add sparkles
  for (let i = 0; i < sparkleCount; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'celebration-sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = (Math.random() * 3) + 's';
      ribbonContainer.appendChild(sparkle);
    }, i * 20);
  }

  // Remove container after animation
  setTimeout(() => {
    if (ribbonContainer.parentNode) {
      ribbonContainer.parentNode.removeChild(ribbonContainer);
    }
  }, 5500);
}

function next(){
  session.index++;
  updateSessionProgress();
  showCurrent();
}

function finishSession(){
  promptEl.textContent = 'Session complete!';
  feedbackEl.textContent = `Final score: ${session.score} / ${session.words.length}`;
  feedbackEl.className='feedback';
  nextBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  scoreEl.classList.remove('hidden');
  scoreEl.textContent = `Score: ${session.score}`;
  
  // Trigger celebration ribbons
  createCelebrationRibbons();
  
  if (!session.isReview) {
    // Update progress
    updateProgress(session.level, session.category, session.score, session.words.length);
    
    // Check achievements
    const progress = getProgress();
    // Check achievements if achievement utilities are available
    if (typeof checkAchievements === 'function') {
      const newAchievements = checkAchievements(progress, session) || [];
      newAchievements.forEach(achievementId => {
        const achievement = (typeof getAchievementDetails === 'function') ? getAchievementDetails(achievementId) : null;
        if (achievement) {
          if (typeof saveAchievement === 'function') saveAchievement(achievementId);
          if (typeof showAchievementNotification === 'function') showAchievementNotification(achievement);
        }
      });
    }
  }
  
  updateReviewStats();
  progressSection.classList.remove('hidden');
}

startBtn.addEventListener('click', (e)=>{
  // Avoid double-firing on touch devices that also fire click events
  if (buttonTouchHandled) {
    console.log('📱 Click event skipped - already handled by touch');
    buttonTouchHandled = false; // Reset for next interaction
    return;
  }
  
  if(!vocab || Object.keys(vocab).length===0){
    promptEl.textContent = 'Vocabulary not loaded yet.';return
  }
  
  // INSTANT visual feedback for desktop/non-touch devices
  const isMobile = window.innerWidth <= 768;
  const isIPhone = /iPhone/i.test(navigator.userAgent);
  
  if (isMobile || isIPhone) {
    console.log('📱 Adding INSTANT button animation (click event)');
    startBtn.classList.add('button-enlarge');
    // Remove animation immediately after adding it
    setTimeout(() => {
      startBtn.classList.remove('button-enlarge');
    }, 150); // Very short animation for visual feedback only
  }
  
  console.log('🖱️ ⚡ INSTANT session start via click');
  // IMMEDIATE execution - no delays
  startSession();
});

// IMMEDIATE iPhone touch support for Start Practice button - NO DELAYS
let touchStartTime = 0;
let buttonTouchHandled = false;

startBtn.addEventListener('touchstart', function(e) {
  console.log('📱 Start button touch started - IMMEDIATE MODE');
  touchStartTime = Date.now();
  buttonTouchHandled = false;
  
  // INSTANT visual feedback - no delay
  const isMobile = window.innerWidth <= 768;
  const isIPhone = /iPhone/i.test(navigator.userAgent);
  
  if (isMobile || isIPhone) {
    console.log('📱 Adding INSTANT button animation');
    startBtn.classList.add('button-enlarge');
  }
}, { passive: true });

startBtn.addEventListener('touchend', function(e) {
  console.log('📱 Start button touch ended - IMMEDIATE RESPONSE');
  
  const touchDuration = Date.now() - touchStartTime;
  
  // IMMEDIATE response - no delays or duration checks
  if (!buttonTouchHandled) {
    buttonTouchHandled = true;
    
    // Prevent the delayed click event
    e.preventDefault();
    e.stopPropagation();
    
    // Remove animation immediately
    startBtn.classList.remove('button-enlarge');
    
    // Check if vocab is loaded and button is not disabled
    if(!vocab || Object.keys(vocab).length===0){
      promptEl.textContent = 'Vocabulary not loaded yet.';
      return;
    }
    
    if (!startBtn.disabled) {
      console.log('📱 ⚡ INSTANT SESSION START - NO DELAY');
      // IMMEDIATE execution - no setTimeout at all
      startSession();
    }
  }
}, { passive: false });

listenWordBtn.addEventListener('click', () => {
  const current = session.words[session.index];
  speakWord(current.word);
});

submitSpelling.addEventListener('click', ()=>{checkSpelling();});

// Enhanced iPhone touch support for Check Answer button
submitSpelling.addEventListener('touchend', function(e) {
  console.log('📱 Check Answer button touched');
  e.preventDefault();
  if (!submitSpelling.disabled) {
    checkSpelling();
  }
}, { passive: false });

spellingInput.addEventListener('keydown',(e)=>{if(e.key==='Enter'){checkSpelling();}});
nextBtn.addEventListener('click', ()=>{next();});

// Enhanced iPhone touch support for Next button
nextBtn.addEventListener('touchend', function(e) {
  console.log('📱 Next button touched');
  e.preventDefault();
  if (!nextBtn.disabled && !nextBtn.classList.contains('hidden')) {
    next();
  }
}, { passive: false });

restartBtn.addEventListener('click', ()=>{startSession();});

// Mode selection handling
document.getElementById('practiceMode').addEventListener('change', (e) => {
  const learnControls = document.getElementById('learnControls');
  const reviewStats = document.getElementById('reviewStats');
  
  if (e.target.value === 'review') {
    learnControls.classList.add('hidden');
    reviewStats.classList.remove('hidden');
  } else {
    learnControls.classList.remove('hidden');
    reviewStats.classList.add('hidden');
  }
});

// Progress button handling
showProgressBtn.addEventListener('click', () => {
  if (progressSection.classList.contains('hidden')) {
    progressSection.classList.remove('hidden');
    displayProgress();
    showProgressBtn.textContent = 'Hide Progress';
  } else {
    progressSection.classList.add('hidden');
    showProgressBtn.textContent = 'Show Progress';
  }
});

function displayDailyChallenges() {
  // Use safe fallbacks if daily utilities are not available
  const daily = (typeof getDailyChallenge === 'function') ? getDailyChallenge() : { challenges: [] };
  const streak = (typeof getDailyStreak === 'function') ? getDailyStreak() : { current: 0, best: 0 };
  const container = document.getElementById('dailyChallenges');

  // Update streak display
  document.getElementById('currentStreak').textContent = streak.current;
  document.getElementById('bestStreak').textContent = streak.best;

  container.innerHTML = (daily.challenges || []).map(challenge => `
        <div class="daily-challenge ${challenge.completed ? 'completed' : ''}">
            <div class="challenge-header">
                <span class="challenge-emoji">${challenge.completed ? '✅' : '🎯'}</span>
                <span class="challenge-title">${challenge.description}</span>
            </div>
            <div class="challenge-progress">
                <div class="challenge-progress-fill" 
                     style="width: ${(challenge.progress / challenge.requirement) * 100}%">
                </div>
            </div>
        </div>
    `).join('');
}

// Update daily challenge progress based on actions
function updateChallengesForAction(action) {
    switch(action) {
        case 'word_complete':
      if (typeof updateDailyChallenge === 'function') updateDailyChallenge('category_master');
            break;
        case 'perfect_spell':
      if (typeof updateDailyChallenge === 'function') updateDailyChallenge('perfect_spell');
            break;
        case 'review_complete':
      if (typeof updateDailyChallenge === 'function') updateDailyChallenge('review_champion');
            break;
    }
}

// Speak event words with British female voice
function speakEventWord(word) {
  if (!synth) {
    console.error('Speech synthesis not supported');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-GB';
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  const voice = pickBritishFemaleVoice();
  if (voice) utterance.voice = voice;
  try { synth.cancel(); } catch {}
  synth.speak(utterance);
}

function checkAndDisplayEvent() {
  const eventSection = document.getElementById('eventSection');
  // Safely obtain current event and progress
  const currentEvent = (typeof getCurrentEvent === 'function') ? getCurrentEvent() : null;

  if (currentEvent) {
    eventSection.classList.remove('hidden');
    document.getElementById('eventTitle').textContent = currentEvent.name;

    // Display event words
    const wordsHTML = (currentEvent.words || []).map(word => `
        <div class="event-word">
          <span class="event-emoji">${word.emoji}</span>
          <span>${word.word}</span>
          <button class="pronounce-btn" onclick="speakEventWord('${word.word}')" title="Pronounce">🔊</button>
        </div>
      `).join('');
    document.getElementById('eventWords').innerHTML = `
      <h3>Special Words</h3>
      ${wordsHTML}
    `;

    // Display event challenges (guard getEventProgress)
    const progress = (typeof getEventProgress === 'function') ? getEventProgress(currentEvent.id) : { challengesCompleted: [] };
    const challengesHTML = (currentEvent.challenges || []).map(challenge => `
        <div class="event-challenge ${progress.challengesCompleted.includes(challenge.id) ? 'completed' : ''}">
          <div class="challenge-header">
            <span class="challenge-emoji">${challenge.reward}</span>
            <span>${challenge.title}</span>
          </div>
          <p>${challenge.description}</p>
        </div>
      `).join('');
    document.getElementById('eventChallenges').innerHTML = `
      <h3>Event Challenges</h3>
      ${challengesHTML}
    `;
  } else {
    eventSection.classList.add('hidden');
  }
}

function updatePracticeRecord() {
  // Safely update calendar data if calendar utilities are present
  const calendarData = (typeof updateCalendarData === 'function') ? updateCalendarData() : {};
  const dailyChallenge = (typeof getDailyChallenge === 'function') ? getDailyChallenge() : { completed: false };
  if (dailyChallenge.completed) {
    calendarData.dailyCompleted = true;
    if (typeof CALENDAR_KEY !== 'undefined' && typeof getCalendarData === 'function') {
      localStorage.setItem(CALENDAR_KEY, JSON.stringify(getCalendarData()));
    }
  }
  if (typeof updateCalendarDisplay === 'function') updateCalendarDisplay();
}

// Username handling
document.getElementById('saveUsername').addEventListener('click', () => {
    const input = document.getElementById('usernameInput');
    const name = input.value.trim();
    if (name) {
    if (typeof setUsername === 'function') setUsername(name);
    if (typeof displayLeaderboards === 'function') displayLeaderboards();
    if (typeof showNotification === 'function') showNotification('👤 Profile Updated', `Username set to: ${name}`);
    }
});

// Start loading vocabulary when page loads
loadVocab();

// Reset App Button - Restores app to original state
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('resetAppBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('⚠️ Are you sure you want to reset the app to its original state?\n\nThis will:\n• Clear all progress\n• Clear all achievements\n• Reset daily streaks\n• Clear review words\n• Clear leaderboard data\n\nThis action cannot be undone!')) {
        // Clear all localStorage data
        localStorage.clear();
        
        // Open a new page with the app
        window.open(window.location.href, '_blank');
        
        // Close the current page
        window.close();
        
        // Fallback: If window.close() doesn't work (requires page to be opened by script),
        // redirect to a blank page and then reload
        setTimeout(() => {
          window.location.href = 'about:blank';
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 100);
        }, 500);
      }
    });
    console.log('✅ Reset button listener attached');
  } else {
    console.warn('⚠️ Reset button not found in DOM');
  }
});

// Update leaderboard on session completion
function updateLeaderboardsOnFinish() {
    const progress = getProgress();
    const totalWords = Object.values(progress)
        .reduce((sum, level) => 
            sum + Object.values(level)
                .reduce((s, cat) => s + cat.correct, 0), 0);

  if (typeof updateLeaderboards === 'function') {
    updateLeaderboards('words', { total: totalWords });

    const streak = (typeof getDailyStreak === 'function') ? getDailyStreak() : { current: 0 };
    updateLeaderboards('streak', { current: streak.current });

    if (session.score === session.words.length && session.words.length >= 5) {
      const perfectScores = parseInt(localStorage.getItem('perfectScores') || '0') + 1;
      localStorage.setItem('perfectScores', perfectScores.toString());
      updateLeaderboards('perfect', { count: perfectScores });
    }
  }
}

// Update event leaderboard
function updateEventLeaderboard(eventId) {
  if (typeof EVENTS !== 'undefined' && EVENTS[eventId]) {
    const event = EVENTS[eventId];
    const progress = (typeof getEventProgress === 'function') ? getEventProgress(eventId) : null;
    if (typeof updateLeaderboards === 'function') {
      updateLeaderboards('event', {
        eventName: event.name,
        progress: progress
      });
    }
  }
}

// initialization
loadVocab();
displayProgress(); // Show initial progress
displayDailyChallenges(); // Show daily challenges
checkAndDisplayEvent(); // Check for seasonal events
if (typeof updateCalendarDisplay === 'function') updateCalendarDisplay(); // Initialize calendar if available
if (typeof displayLeaderboards === 'function') displayLeaderboards(); // Show leaderboards if available

// ------- Dynamic category options by level -------
function prettyCategoryLabel(key) {
  const MAP = {
    // Cambridge-style categories (exact keys from vocab.json)
    animals: '🐾 Animals',
    the_body_and_the_face: '👤 Body & Face',
    clothes: '👕 Clothes',
    colours: '🎨 Colours',
    family_and_friends: '👨‍👩‍👧‍👦 Family & Friends',
    food_and_drink: '🍽️ Food & Drink',
    the_home: '🏡 Home',
    materials: '🧱 Materials',
  names: '✨ Names',
    numbers: '🔢 Numbers',
    places_and_directions: '📍 Places & Directions',
    school: '🏫 School',
    sports_and_leisure: '⚽ Sports & Leisure',
    time: '⏰ Time',
    toys: '🧸 Toys',
    transport: '🚗 Transport',
    weather: '⛅ Weather',
    work: '💼 Work',
    the_world_around_us: '🌍 The World Around Us',
    health: '🏥 Health',
    // Legacy/custom keys (kept for compatibility; shown if present)
    colors_shapes: '🎨 Colors & Shapes',
    toys_games: '🧸 Toys & Games',
    school_classroom: '🏫 School & Classroom',
    body_face: '👤 Body & Face',
    food_drinks: '🍽️ Food & Drinks',
    family: '👨‍👩‍👧‍👦 Family',
    places: '🏠 Places',
    weather_legacy: '⛅ Weather',
    people: '👥 People',
    actions: '🏃 Actions',
    home: '🏡 Home',
    nouns: '📝 Nouns',
    colors: '🎨 Colors',
    activities: '🎯 Activities',
    nature: '🌳 Nature',
    sports: '⚽ Sports',
    learning: '📚 Learning',
    descriptions: '✨ Descriptions',
    education: '🎓 Education',
    environment: '🌍 Environment',
    technology: '💻 Technology',
    jobs: '💼 Jobs',
    emotions: '😊 Emotions',
    travel: '✈️ Travel',
    communication: '💬 Communication'
  };
  if (MAP[key]) return MAP[key];
  // Title-case and replace underscores as a fallback
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function updateCategoryOptions(level) {
  const select = document.getElementById('categorySelect');
  if (!select) {
    console.error('❌ categorySelect element not found');
    return;
  }
  if (!vocab || !vocab[level]) {
    console.warn('⚠️ No vocab available for level:', level);
    select.innerHTML = '<option value="">No categories available</option>';
    return;
  }
  const categories = Object.keys(vocab[level]);
  console.log(`📝 Updating categories for ${level}:`, categories);
  console.log(`🗑️ Clearing old options (had ${select.options.length} options)`);
  
  // Clear all existing options
  select.innerHTML = '';
  
  // Add new options
  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    const items = Array.isArray(vocab[level][c]) ? vocab[level][c] : [];
    const count = items.length || 0;
    option.textContent = `${prettyCategoryLabel(c)} (${count})`;
    select.appendChild(option);
  });
  
  console.log(`✅ Added ${select.options.length} new options`);
  
  // Select first category
  if (categories.length > 0) {
    select.value = categories[0];
    console.log(`👉 Selected category: ${select.value}`);
  }
}

// Event listener is now added inside loadVocab() function to ensure vocab is loaded first
