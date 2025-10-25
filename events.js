// Seasonal events and special challenges
const EVENTS = {
    easter: {
        id: 'easter',
        name: 'Easter Celebration 🐰',
        period: { start: '04-01', end: '04-15' },
        words: [
            { word: "egg", meaning: "decorated Easter egg", emoji: "🥚" },
            { word: "bunny", meaning: "Easter rabbit that brings eggs", emoji: "🐰" },
            { word: "basket", meaning: "container for Easter eggs", emoji: "🧺" },
            { word: "chick", meaning: "baby bird that hatches", emoji: "🐥" },
            { word: "flower", meaning: "spring plant that blooms", emoji: "🌷" },
            { word: "chocolate", meaning: "sweet Easter treat", emoji: "🍫" }
        ],
        challenges: [
            {
                id: 'egg_hunter',
                title: 'Egg Hunter',
                description: 'Find and learn all Easter words',
                reward: '🥚',
                requirement: 6
            },
            {
                id: 'easter_streak',
                title: 'Easter Joy',
                description: 'Practice Easter words 3 days in a row',
                reward: '🐰',
                requirement: 3
            }
        ]
    },
    summer: {
        id: 'summer',
        name: 'Summer Fun ☀️',
        period: { start: '06-15', end: '07-15' },
        words: [
            { word: "beach", meaning: "sandy place by the ocean", emoji: "🏖️" },
            { word: "swim", meaning: "move through water", emoji: "🏊" },
            { word: "ice cream", meaning: "cold sweet summer treat", emoji: "🍦" },
            { word: "sunscreen", meaning: "cream that protects from sun", emoji: "🧴" },
            { word: "sandcastle", meaning: "building made from sand", emoji: "🏰" },
            { word: "sunglasses", meaning: "protect eyes from sun", emoji: "🕶️" }
        ],
        challenges: [
            {
                id: 'summer_fun',
                title: 'Summer Expert',
                description: 'Master all summer words',
                reward: '☀️',
                requirement: 6
            },
            {
                id: 'beach_day',
                title: 'Beach Day',
                description: 'Practice summer words 5 times',
                reward: '🏖️',
                requirement: 5
            }
        ]
    },
    backToSchool: {
        id: 'backToSchool',
        name: 'Back to School 📚',
        period: { start: '08-15', end: '09-15' },
        words: [
            { word: "backpack", meaning: "bag for carrying school things", emoji: "🎒" },
            { word: "pencil", meaning: "tool for writing and drawing", emoji: "✏️" },
            { word: "notebook", meaning: "book for writing notes", emoji: "📓" },
            { word: "teacher", meaning: "person who helps you learn", emoji: "👩‍🏫" },
            { word: "classroom", meaning: "room where students learn", emoji: "🏫" },
            { word: "student", meaning: "person who learns at school", emoji: "👨‍🎓" }
        ],
        challenges: [
            {
                id: 'school_ready',
                title: 'School Ready',
                description: 'Learn all school preparation words',
                reward: '📚',
                requirement: 6
            },
            {
                id: 'eager_student',
                title: 'Eager Student',
                description: 'Practice school words for 4 days',
                reward: '🎓',
                requirement: 4
            }
        ]
    },
    halloween: {
        id: 'halloween',
        name: 'Halloween Special 🎃',
        period: { start: '10-25', end: '10-31' },
        words: [
            { word: "pumpkin", meaning: "orange vegetable used for Halloween", emoji: "🎃" },
            { word: "ghost", meaning: "spooky floating spirit", emoji: "👻" },
            { word: "witch", meaning: "person who does magic", emoji: "🧙‍♀️" },
            { word: "candy", meaning: "sweet treats for trick-or-treat", emoji: "🍬" },
            { word: "costume", meaning: "special clothes for Halloween", emoji: "👻" }
        ],
        challenges: [
            {
                id: 'halloween_master',
                title: 'Halloween Master',
                description: 'Learn all Halloween words',
                reward: '🎃',
                requirement: 5
            },
            {
                id: 'trick_or_treat',
                title: 'Trick or Treat',
                description: 'Complete 3 Halloween word reviews',
                reward: '🍬',
                requirement: 3
            }
        ]
    },
    christmas: {
        id: 'christmas',
        name: 'Christmas Joy 🎄',
        period: { start: '12-01', end: '12-25' },
        words: [
            { word: "snow", meaning: "white cold flakes from sky", emoji: "❄️" },
            { word: "santa", meaning: "brings presents at Christmas", emoji: "🎅" },
            { word: "gift", meaning: "present wrapped for Christmas", emoji: "🎁" },
            { word: "tree", meaning: "decorated Christmas tree", emoji: "🎄" },
            { word: "star", meaning: "bright shape on top of tree", emoji: "⭐" }
        ],
        challenges: [
            {
                id: 'santa_helper',
                title: 'Santa\'s Helper',
                description: 'Learn all Christmas words',
                reward: '🎄',
                requirement: 5
            },
            {
                id: 'christmas_spirit',
                title: 'Christmas Spirit',
                description: 'Practice for 5 days in December',
                reward: '🎅',
                requirement: 5
            }
        ]
    },
    spring: {
        id: 'spring',
        name: 'Spring Bloom 🌸',
        period: { start: '03-20', end: '04-20' },
        words: [
            { word: "flower", meaning: "colorful plant that blooms", emoji: "🌸" },
            { word: "butterfly", meaning: "pretty flying insect", emoji: "🦋" },
            { word: "rain", meaning: "water falling from clouds", emoji: "🌧️" },
            { word: "garden", meaning: "place where plants grow", emoji: "🌺" },
            { word: "rainbow", meaning: "colorful arch in the sky", emoji: "🌈" }
        ],
        challenges: [
            {
                id: 'spring_bloom',
                title: 'Spring Bloom',
                description: 'Learn all spring words',
                reward: '🌸',
                requirement: 5
            },
            {
                id: 'nature_friend',
                title: 'Nature Friend',
                description: 'Practice spring words 3 days in a row',
                reward: '🌺',
                requirement: 3
            }
        ]
    },
    thanksgiving: {
        id: 'thanksgiving',
        name: 'Thanksgiving Feast 🦃',
        period: { start: '11-20', end: '11-30' },
        words: [
            { word: "turkey", meaning: "big bird eaten at Thanksgiving", emoji: "🦃" },
            { word: "pie", meaning: "sweet baked dessert", emoji: "🥧" },
            { word: "family", meaning: "people related by blood", emoji: "👨‍👩‍👧‍👦" },
            { word: "grateful", meaning: "feeling thankful", emoji: "🙏" },
            { word: "feast", meaning: "big meal with lots of food", emoji: "🍽️" }
        ],
        challenges: [
            {
                id: 'thanksgiving_master',
                title: 'Thanksgiving Master',
                description: 'Learn all Thanksgiving words',
                reward: '🦃',
                requirement: 5
            },
            {
                id: 'grateful_learner',
                title: 'Grateful Learner',
                description: 'Complete 3 Thanksgiving word reviews',
                reward: '🥧',
                requirement: 3
            }
        ]
    },
    newyear: {
        id: 'newyear',
        name: 'New Year Celebration 🎉',
        period: { start: '12-26', end: '01-05' },
        words: [
            { word: "firework", meaning: "explosive colorful display", emoji: "🎆" },
            { word: "resolution", meaning: "promise to do better", emoji: "📅" },
            { word: "champagne", meaning: "sparkling drink for celebrations", emoji: "🍾" },
            { word: "midnight", meaning: "12 o'clock at night", emoji: "🕛" },
            { word: "toast", meaning: "drink to celebrate", emoji: "🥂" }
        ],
        challenges: [
            {
                id: 'new_year_master',
                title: 'New Year Master',
                description: 'Learn all New Year words',
                reward: '🎆',
                requirement: 5
            },
            {
                id: 'resolution_keeper',
                title: 'Resolution Keeper',
                description: 'Practice for 3 days in the new year',
                reward: '🥂',
                requirement: 3
            }
        ]
    },
    valentine: {
        id: 'valentine',
        name: 'Valentine\'s Love 💖',
        period: { start: '02-10', end: '02-20' },
        words: [
            { word: "heart", meaning: "symbol of love", emoji: "❤️" },
            { word: "rose", meaning: "red flower for love", emoji: "🌹" },
            { word: "chocolate", meaning: "sweet treat for Valentine's", emoji: "🍫" },
            { word: "card", meaning: "message of love", emoji: "💌" },
            { word: "candle", meaning: "light for romantic dinner", emoji: "🕯️" }
        ],
        challenges: [
            {
                id: 'love_master',
                title: 'Love Master',
                description: 'Learn all Valentine\'s words',
                reward: '💖',
                requirement: 5
            },
            {
                id: 'romantic_soul',
                title: 'Romantic Soul',
                description: 'Practice Valentine\'s words 3 times',
                reward: '🌹',
                requirement: 3
            }
        ]
    },
    easter: {
        id: 'easter',
        name: 'Easter Joy 🥚',
        period: { start: '03-25', end: '04-10' },
        words: [
            { word: "egg", meaning: "oval object from chicken", emoji: "🥚" },
            { word: "bunny", meaning: "fluffy rabbit for Easter", emoji: "🐰" },
            { word: "basket", meaning: "container for Easter eggs", emoji: "🧺" },
            { word: "chick", meaning: "baby chicken", emoji: "🐔" },
            { word: "hunt", meaning: "search for hidden eggs", emoji: "🔍" }
        ],
        challenges: [
            {
                id: 'easter_master',
                title: 'Easter Master',
                description: 'Learn all Easter words',
                reward: '🥚',
                requirement: 5
            },
            {
                id: 'egg_hunter',
                title: 'Egg Hunter',
                description: 'Complete 3 Easter word reviews',
                reward: '🐰',
                requirement: 3
            }
        ]
    }
};

function getCurrentEvent() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const currentDate = `${month}-${day}`;

    return Object.values(EVENTS).find(event => {
        const [startMonth, startDay] = event.period.start.split('-');
        const [endMonth, endDay] = event.period.end.split('-');
        const start = `${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
        const end = `${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;
        
        return currentDate >= start && currentDate <= end;
    });
}

// Event progress tracking
const EVENT_PROGRESS_KEY = 'englishAppEventProgress';

function getEventProgress(eventId) {
    const saved = localStorage.getItem(EVENT_PROGRESS_KEY);
    if (!saved) return {};
    return JSON.parse(saved)[eventId] || { wordsLearned: [], challengesCompleted: [] };
}

function updateEventProgress(eventId, type, data) {
    const saved = localStorage.getItem(EVENT_PROGRESS_KEY);
    const allProgress = saved ? JSON.parse(saved) : {};
    
    if (!allProgress[eventId]) {
        allProgress[eventId] = { wordsLearned: [], challengesCompleted: [] };
    }
    
    if (type === 'word' && !allProgress[eventId].wordsLearned.includes(data)) {
        allProgress[eventId].wordsLearned.push(data);
    } else if (type === 'challenge' && !allProgress[eventId].challengesCompleted.includes(data)) {
        allProgress[eventId].challengesCompleted.push(data);
    }
    
    localStorage.setItem(EVENT_PROGRESS_KEY, JSON.stringify(allProgress));
    return allProgress[eventId];
}

// Check if an event challenge is completed
function checkEventChallenges(event, progress) {
    event.challenges.forEach(challenge => {
        if (!progress.challengesCompleted.includes(challenge.id)) {
            if (challenge.id.includes('master') && progress.wordsLearned.length >= challenge.requirement) {
                updateEventProgress(event.id, 'challenge', challenge.id);
                showEventReward(challenge);
            } else if (challenge.id.includes('spirit') || challenge.id.includes('friend')) {
                // Check consecutive days logic here
                const streak = getDailyStreak();
                if (streak.current >= challenge.requirement) {
                    updateEventProgress(event.id, 'challenge', challenge.id);
                    showEventReward(challenge);
                }
            }
        }
    });
}

function showEventReward(challenge) {
    showNotification(
        `${challenge.reward} Event Challenge Complete!`,
        challenge.description
    );
}