const ACHIEVEMENTS = {
    beginner: [
        {
            id: 'first_perfect',
            title: 'Perfect Start! 🌟',
            description: 'Get 100% on your first practice session',
            emoji: '🌟'
        },
        {
            id: 'starters_10',
            title: 'Taking First Steps',
            description: 'Complete 10 words in Starters level',
            emoji: '🌱'
        },
        {
            id: 'family_expert',
            title: 'Family Circle',
            description: 'Learn all family-related words',
            emoji: '👨‍👩‍👧‍👦'
        },
        {
            id: 'place_explorer',
            title: 'Place Explorer',
            description: 'Visit all place-related words',
            emoji: '🗺️'
        },
        {
            id: 'school_ready',
            title: 'School Ready',
            description: 'Learn all school items',
            emoji: '📚'
        }
    ],
    intermediate: [
        {
            id: 'categories_3',
            title: 'Explorer',
            description: 'Try 3 different categories',
            emoji: '🗺️'
        },
        {
            id: 'streak_3',
            title: 'On a Roll!',
            description: 'Get 3 correct answers in a row',
            emoji: '🎯'
        },
        {
            id: 'daily_3',
            title: 'Daily Hero',
            description: 'Complete 3 daily challenges',
            emoji: '📅'
        },
        {
            id: 'review_master',
            title: 'Review Master',
            description: 'Master 10 words in review mode',
            emoji: '🎓'
        },
        {
            id: 'streak_week',
            title: 'Weekly Wonder',
            description: 'Complete daily challenges 7 days in a row',
            emoji: '🏆'
        }
    ],
    advanced: [
        {
            id: 'all_categories',
            title: 'Word Master',
            description: 'Try all categories in any level',
            emoji: '👑'
        },
        {
            id: 'perfect_session',
            title: 'Perfect Score!',
            description: 'Complete a session with 100% score',
            emoji: '🏆'
        }
    ]
};

// Achievement checking functions
function checkAchievements(progress, session) {
    const earned = [];
    const saved = getEarnedAchievements();

    // Check perfect first session
    if (!saved.includes('first_perfect') && 
        session.score === session.words.length) {
        earned.push('first_perfect');
    }

    // Check starters progress
    const startersTotal = Object.values(progress.starters || {})
        .reduce((sum, cat) => sum + cat.correct, 0);
    if (!saved.includes('starters_10') && startersTotal >= 10) {
        earned.push('starters_10');
    }

    // Check categories tried
    const allCategories = new Set();
    Object.values(progress).forEach(level => {
        Object.keys(level).forEach(cat => allCategories.add(cat));
    });
    if (!saved.includes('categories_3') && allCategories.size >= 3) {
        earned.push('categories_3');
    }
    if (!saved.includes('all_categories') && allCategories.size >= 6) {
        earned.push('all_categories');
    }

    // Perfect session
    if (!saved.includes('perfect_session') && 
        session.score === session.words.length && 
        session.words.length >= 5) {
        earned.push('perfect_session');
    }

    return earned;
}

function getEarnedAchievements() {
    return JSON.parse(localStorage.getItem('achievements') || '[]');
}

function saveAchievement(id) {
    const earned = getEarnedAchievements();
    if (!earned.includes(id)) {
        earned.push(id);
        localStorage.setItem('achievements', JSON.stringify(earned));
    }
}

function getAchievementDetails(id) {
    for (const category of Object.values(ACHIEVEMENTS)) {
        const achievement = category.find(a => a.id === id);
        if (achievement) return achievement;
    }
    return null;
}