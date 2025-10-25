# 📚 English Learning App

An interactive web application for learning English vocabulary with three difficulty levels: Starters, Movers, and Flyers.

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
