// Review mode functionality
const REVIEW_KEY = 'englishAppReview';

function saveForReview(word, correct) {
    const reviews = getReviewWords();
    if (!reviews[word.word]) {
        reviews[word.word] = {
            word: word.word,
            meaning: word.meaning,
            emoji: word.emoji,
            attempts: 0,
            correct: 0,
            lastSeen: Date.now(),
            needsReview: !correct
        };
    }
    reviews[word.word].attempts++;
    if (correct) reviews[word.word].correct++;
    reviews[word.word].lastSeen = Date.now();
    reviews[word.word].needsReview = !correct || 
        (reviews[word.word].correct / reviews[word.word].attempts) < 0.7;

    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
}

function getReviewWords() {
    return JSON.parse(localStorage.getItem(REVIEW_KEY) || '{}');
}

function getWordsForReview(count = 10) {
    const reviews = getReviewWords();
    const wordsToReview = Object.values(reviews)
        .filter(w => w.needsReview)
        .sort((a, b) => a.lastSeen - b.lastSeen)
        .slice(0, count);
    
    return wordsToReview.map(w => ({
        word: w.word,
        meaning: w.meaning,
        emoji: w.emoji
    }));
}

function getReviewStats() {
    const reviews = getReviewWords();
    const words = Object.values(reviews);
    return {
        total: words.length,
        needsReview: words.filter(w => w.needsReview).length,
        mastered: words.filter(w => !w.needsReview).length
    };
}

function updateReviewStats() {
    const stats = getReviewStats();
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn && stats.needsReview > 0) {
        reviewBtn.textContent = `📝 Review (${stats.needsReview})`;
        reviewBtn.style.display = 'inline-block';
    }
}