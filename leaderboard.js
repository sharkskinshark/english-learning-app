// Leaderboard system
const LEADERBOARD_KEY = 'englishAppLeaderboard';
const USERNAME_KEY = 'englishAppUsername';

// Leaderboard categories
const LEADERBOARD_TYPES = {
    DAILY_STREAK: 'dailyStreak',
    WORDS_LEARNED: 'wordsLearned',
    EVENT_POINTS: 'eventPoints',
    PERFECT_SCORES: 'perfectScores'
};

function getUsername() {
    return localStorage.getItem(USERNAME_KEY) || 'Anonymous';
}

function setUsername(name) {
    localStorage.setItem(USERNAME_KEY, name);
}

function getLeaderboard(type) {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    const leaderboards = saved ? JSON.parse(saved) : {};
    return leaderboards[type] || [];
}

function updateLeaderboard(type, score, details = {}) {
    const leaderboards = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '{}');
    if (!leaderboards[type]) {
        leaderboards[type] = [];
    }

    const entry = {
        username: getUsername(),
        score: score,
        timestamp: new Date().toISOString(),
        ...details
    };

    // Add new entry and sort
    leaderboards[type].push(entry);
    leaderboards[type].sort((a, b) => b.score - a.score);
    
    // Keep only top 100 scores
    leaderboards[type] = leaderboards[type].slice(0, 100);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboards));
    return leaderboards[type];
}

function calculateEventPoints(eventProgress) {
    let points = 0;
    if (!eventProgress) return points;

    // Points for words learned
    points += (eventProgress.wordsLearned?.length || 0) * 10;

    // Points for challenges completed
    points += (eventProgress.challengesCompleted?.length || 0) * 50;

    return points;
}

function generateLeaderboardHTML(type, limit = 10) {
    const leaderboard = getLeaderboard(type).slice(0, limit);
    const username = getUsername();
    
    return `
        <div class="leaderboard-section">
            <h3>${getLeaderboardTitle(type)}</h3>
            <div class="leaderboard-list">
                ${leaderboard.map((entry, index) => `
                    <div class="leaderboard-entry ${entry.username === username ? 'current-user' : ''}">
                        <span class="rank">${index + 1}</span>
                        <span class="username">${entry.username}</span>
                        <span class="score">${formatScore(type, entry.score)}</span>
                        ${entry.eventName ? `<span class="event-name">${entry.eventName}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function getLeaderboardTitle(type) {
    const titles = {
        [LEADERBOARD_TYPES.DAILY_STREAK]: '🔥 Longest Streaks',
        [LEADERBOARD_TYPES.WORDS_LEARNED]: '📚 Most Words Learned',
        [LEADERBOARD_TYPES.EVENT_POINTS]: '🏆 Event Champions',
        [LEADERBOARD_TYPES.PERFECT_SCORES]: '⭐ Perfect Sessions'
    };
    return titles[type] || 'Leaderboard';
}

function formatScore(type, score) {
    switch(type) {
        case LEADERBOARD_TYPES.DAILY_STREAK:
            return `${score} days`;
        case LEADERBOARD_TYPES.EVENT_POINTS:
            return `${score} pts`;
        default:
            return score;
    }
}

// Update leaderboards based on actions
function updateLeaderboards(action, data) {
    switch(action) {
        case 'streak':
            updateLeaderboard(LEADERBOARD_TYPES.DAILY_STREAK, data.current);
            break;
        case 'words':
            updateLeaderboard(LEADERBOARD_TYPES.WORDS_LEARNED, data.total);
            break;
        case 'event':
            const points = calculateEventPoints(data.progress);
            updateLeaderboard(LEADERBOARD_TYPES.EVENT_POINTS, points, {
                eventName: data.eventName
            });
            break;
        case 'perfect':
            updateLeaderboard(LEADERBOARD_TYPES.PERFECT_SCORES, data.count);
            break;
    }
    displayLeaderboards();
}

function displayLeaderboards() {
    const container = document.getElementById('leaderboardsContent');
    if (!container) return;

    container.innerHTML = Object.values(LEADERBOARD_TYPES)
        .map(type => generateLeaderboardHTML(type))
        .join('');
}