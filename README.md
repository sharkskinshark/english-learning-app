# 🥝 Cambridge Vocabulary Practice App

An interactive web application for English language learners to practice vocabulary through speaking, spelling, and comprehension exercises aligned with Cambridge English exams.

## ✨ Features

### � Three Learning Levels
- **Starters (Beginner)** - 17 categories, 119 words
- **Movers (Elementary)** - 8 categories, 55 words  
- **Flyers (Pre-Intermediate)** - 8 categories, 49 words

### 🎮 Interactive Learning Modes
- **Spelling Practice** - Listen and type what you hear
- **Learn New Words** - Study vocabulary with meanings
- **Phonics Helper** - Improve pronunciation with audio feedback
- **Meaning Match** - Select the correct definition

### 📊 Progress & Engagement
- 📈 Real-time progress tracking
- 🏆 Achievement system
- 🔥 Daily learning streaks
- 🎯 Leaderboard to track top learners
- ⭐ Special seasonal events (Halloween, Thanksgiving, Christmas, etc.)
- 💾 Auto-save with localStorage

### 🎨 User Experience
- 🥝 Interactive Kiwi mascot with hover effects
- 🎉 Celebration animations (ribbons & sparkles)
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🌊 Smooth animations and transitions
- ♿ Accessible UI with keyboard support

## 🚀 Live Demo

**Coming Soon!** Your app will be available at your GitHub Pages URL once deployed.

## 💻 Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.6+ (for local development server)

### Local Development

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/english-learning-app.git
   cd english-learning-app
   ```

2. **Open in browser directly** or run a local server:
   ```bash
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000`

## 📁 Project Structure

```
├── index.html           # Main application page
├── app.js              # Core application logic
├── styles.css          # All styling (responsive design)
├── vocab.json          # Cambridge vocabulary database
│
├── achievements.js     # Achievement system
├── leaderboard.js      # Leaderboard functionality
├── daily.js           # Daily streak tracking
├── events.js          # Seasonal events (Halloween, etc.)
├── calendar.js        # Calendar view
├── review.js          # Review system for difficult words
│
├── README.md          # This file
└── .gitignore         # Git configuration
```

## 🎓 Vocabulary Database

The app includes **223 Cambridge English vocabulary words** across 33 categories:

**Starters:** Animals, Clothes, Colors, Family, Food, House, Numbers, Parts of Body, Prepositions, School, Shapes, Sports, Tools, Toys, Transportation, Vegetables, Weather

**Movers:** Actions, Adjectives, Food, Habits, House, Places, School, Weather

**Flyers:** Actions, Adjectives, Animals, Daily Life, Education, Environment, Family, Habits

## 🔊 Text-to-Speech

- Uses Web Speech API for pronunciation
- Native English (British) speaker
- Adjustable speech rate and pitch
- Auto-play option for each word

## 💾 Data Storage

- All progress stored locally in browser's localStorage
- No server required - 100% client-side application
- Reset option to clear all data

## 🔒 Security & Privacy

- ✅ No external API calls (except Web Speech API)
- ✅ No personal data collection
- ✅ GDPR compliant
- ✅ Safe for children (COPPA compliant)
- ✅ All data stays on user's device

## 🛠 Development

### Validation Tool (Optional)

Keep vocab.json healthy:
```bash
python validate_vocab.py
```

Checks:
- Valid JSON syntax
- No duplicate words
- Required fields present
- Proper emoji formatting

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## 📝 License

This project is open source and available for educational purposes.

## 🎯 Future Enhancements

- [ ] Audio recordings of native speakers
- [ ] Game-based challenges
- [ ] Multiplayer competitions
- [ ] Progress export to PDF
- [ ] Dark mode
- [ ] Additional languages

## 📧 Support

For questions or suggestions, please create an issue on GitHub.

---

**Made with ❤️ for English learners everywhere**

## 🎯 Features

- **Three Learning Levels:**
  - **Starters (Beginner)** - 17 categories, 119 words
  - **Movers (Elementary)** - 8 categories, 55 words  
  - **Flyers (Pre-Intermediate)** - 8 categories, 49 words

- **Interactive Learning Modes:**
  - Spelling practice (type what you hear)
  - Learn new words mode
  - Speech synthesis for pronunciation

- **Progress Tracking:**
  - Track mastered words
  - Review difficult words
  - Achievement system
  - Daily streaks
  - Leaderboard

## 🚀 Live Demo

Visit the app: [Your GitHub Pages URL will be here]

## 💻 Local Development

1. Clone this repository
2. Open `index.html` in a browser, or
3. Run a local server:
   ```bash
   python -m http.server 8000
   ```
4. Open `http://localhost:8000`

## ✅ Validation

Keep `vocab.json` healthy with a quick validator that checks JSON syntax and duplicate words.

- Run with Python:
  ```powershell
  python validate_vocab.py
  ```

- Or via VS Code task:
  - Open the Command Palette (Ctrl+Shift+P) → “Run Task” → `Validate vocab`

What it checks:
- JSON syntax is valid
- No duplicate words within a category
- No duplicate words across categories in the same level
- No duplicate words across different levels

## 📖 Vocabulary Categories

### Starters
Numbers, Colors & Shapes, Toys & Games, Family, Places, School & Classroom, Body & Face, Clothes, Food & Drinks, Weather, People, Actions, Animals, Home, Nouns, Colors, Activities

### Movers
Nouns, Actions, Places, Nature, Sports, Time, Learning, Descriptions

### Flyers
Education, Environment, Technology, Jobs, Emotions, Activities, Travel, Communication

## 🛠️ Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
- LocalStorage for progress tracking

## 📁 Files Structure

- `index.html` — Main UI
- `styles.css` — Styling
- `app.js` — Core application logic
- `vocab.json` — Vocabulary database (223 words)
- `review.js` — Review functionality
- `achievements.js` — Achievement system
- `daily.js` — Daily streak tracking
- `calendar.js` — Calendar view
- `leaderboard.js` — Leaderboard system
- `events.js` — Event handling

## 📄 License

Free to use for educational purposes.

## 🤝 Contributing

Feel free to fork and submit pull requests!

---

Made with ❤️ for English learners
