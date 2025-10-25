// Daily challenge system
const DAILY_KEY = 'englishAppDaily';
const DAILY_STREAK_KEY = 'englishAppDailyStreak';

const DAILY_CHALLENGES = [
    {
        type: 'category_master',
        description: 'Complete 5 words from any category',
        reward: 'daily_category_master',
        requirement: 5
    },
    {
        type: 'perfect_spell',
        description: 'Get 3 perfect spelling answers',
        reward: 'daily_perfect_speller',
        requirement: 3
    },
    {
        type: 'review_champion',
        description: 'Review 4 words from your review list',
        reward: 'daily_reviewer',
        requirement: 4
    }
];

function getDailyChallenge() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(DAILY_KEY);
    if (saved) {
        const daily = JSON.parse(saved);
        if (daily.date === today) {
            return daily;
        }
    }

    // Create new daily challenges
    const daily = {
        date: today,
        challenges: DAILY_CHALLENGES.map(c => ({
            ...c,
            progress: 0,
            completed: false
        })),
        completed: false
    };
    localStorage.setItem(DAILY_KEY, JSON.stringify(daily));
    return daily;
}

function updateDailyChallenge(type, increment = 1) {
    const daily = getDailyChallenge();
    const challenge = daily.challenges.find(c => c.type === type);
    
    if (challenge && !challenge.completed) {
        challenge.progress += increment;
        if (challenge.progress >= challenge.requirement) {
            challenge.completed = true;
            showDailyChallengeComplete(challenge);
        }
    }

    // Check if all challenges are complete
    if (!daily.completed && daily.challenges.every(c => c.completed)) {
        daily.completed = true;
        updateDailyStreak();
        showAllChallengesComplete();
    }

    localStorage.setItem(DAILY_KEY, JSON.stringify(daily));
    displayDailyChallenges();
    return daily;
}

function updateDailyStreak() {
    const streak = getDailyStreak();
    streak.current++;
    streak.best = Math.max(streak.current, streak.best);
    localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(streak));
}

function getDailyStreak() {
    const saved = localStorage.getItem(DAILY_STREAK_KEY);
    if (!saved) {
        return { current: 0, best: 0, lastComplete: '' };
    }

    const streak = JSON.parse(saved);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (streak.lastComplete !== yesterday && streak.lastComplete !== today) {
        streak.current = 0;
    }
    streak.lastComplete = today;
    localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(streak));
    return streak;
}

function showDailyChallengeComplete(challenge) {
    const emoji = {
        daily_category_master: '📚',
        daily_perfect_speller: '✍️',
        daily_reviewer: '🔄'
    }[challenge.reward];

    showNotification(`${emoji} Daily Challenge Complete!`, challenge.description);
}

function showAllChallengesComplete() {
    const streak = getDailyStreak();
    showNotification('🌟 All Daily Challenges Complete!', 
        `Current Streak: ${streak.current} days`);
}

function showNotification(title, message) {
    const notif = document.createElement('div');
    notif.className = 'daily-notification';
    notif.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}