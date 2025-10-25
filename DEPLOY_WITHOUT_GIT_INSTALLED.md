# GitHub Pages Deployment - Two Methods

## ⚠️ You Need Git

Your computer doesn't have Git installed yet. **Two options:**

---

## Option A: Install Git (Recommended)

### Installation Steps:

1. **Download Git:**
   - Go to https://git-scm.com/download/win
   - Click "Click here to download"

2. **Install:**
   - Open the .exe file
   - Click through installer (default is fine)
   - Choose Visual Studio Code as editor
   - Complete installation

3. **Verify (close PowerShell first, then reopen):**
   ```powershell
   git --version
   # Should show: git version 2.42.0.windows.1 (or similar)
   ```

4. **Then deploy (see commands below)**

---

## Option B: Use GitHub Desktop (Easier UI Alternative)

If you prefer clicking over command line:

1. Download: https://desktop.github.com/
2. Install and sign in with GitHub account
3. File → Clone Repository → Select your repo
4. Made changes? Commit and push in the UI
5. Done!

---

## Quick Deploy After Git Installation

Once Git is installed, run these 3 commands:

```powershell
# 1. Navigate to your app
cd "C:\Users\CLUSTER-E6\Documents\AIsCode\VScode\gemini-cli\English Learning App Gemini"

# 2. Initialize and commit
git init
git add .
git commit -m "Initial commit - English Learning App v1.0"

# 3. Connect to GitHub (use your GitHub repo URL)
# First, create a repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/english-learning-app.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages in repository settings (via browser)
```

---

## Full Step-by-Step After Git is Installed

### 1. Create GitHub Account (if you don't have one)
- Visit https://github.com
- Sign up (free)
- Verify email

### 2. Create GitHub Repository
- Go to https://github.com/new
- Name: `english-learning-app`
- Public or Private (your choice)
- Check "Add a README file"
- Click "Create repository"
- Copy the URL shown (ends with `.git`)

### 3. Push Code to GitHub
```powershell
cd "C:\Users\CLUSTER-E6\Documents\AIsCode\VScode\gemini-cli\English Learning App Gemini"

git init
git add .
git commit -m "Initial commit - English Learning App v1.0"
git remote add origin https://github.com/YOUR_USERNAME/english-learning-app.git
git branch -M main
git push -u origin main
```

When asked for password, use your GitHub personal access token (not your password):
- Generate at: https://github.com/settings/tokens
- Or use GitHub CLI which handles this automatically

### 4. Enable GitHub Pages
1. Go to your GitHub repository
2. Click Settings (top right)
3. Click Pages (left sidebar)
4. Under "Build and deployment":
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
5. Click Save
6. Wait 1-2 minutes
7. Your URL appears: `https://YOUR_USERNAME.github.io/english-learning-app/`

### 5. Visit Your Live App
- Click the URL GitHub provides
- App should load ✅
- Test features to verify

---

## After Deployment

### To Update Your App:
```powershell
# Make changes to files in VS Code

# Then:
cd "C:\Users\CLUSTER-E6\Documents\AIsCode\VScode\gemini-cli\English Learning App Gemini"
git add .
git commit -m "Updated vocabulary"
git push

# GitHub Pages auto-redeploys in 1-2 minutes!
```

---

## Troubleshooting

### "git command not found"
→ Git not installed. Install from https://git-scm.com/download/win

### "fatal: not a git repository"
→ Run `git init` first

### "fatal: 'origin' does not appear to be a 'git' repository"
→ Check repo URL is correct

### "Authentication failed"
→ Use personal access token instead of password:
  1. Generate at https://github.com/settings/tokens
  2. Use as password when prompted

### "404 after pushing"
→ GitHub Pages still building. Wait 2-3 minutes and refresh.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Check git status | `git status` |
| View commits | `git log --oneline` |
| Add all files | `git add .` |
| Commit | `git commit -m "message"` |
| Push to GitHub | `git push` |
| Pull from GitHub | `git pull` |

---

## What You'll Get After Deployment

✅ Public URL: `https://YOUR_USERNAME.github.io/english-learning-app/`  
✅ HTTPS security: 🔒 Locked  
✅ Global CDN: Fast worldwide  
✅ Free hosting: $0  
✅ Easy updates: Just `git push`  
✅ Version control: Full Git history  

---

## Next Steps

1. **Install Git** from https://git-scm.com/download/win (5 min)
2. **Close and reopen PowerShell**
3. **Come back to this guide and run the commands** (3 min)
4. **Celebrate!** Your app is live 🎉

---

## Need Help?

- Git installation stuck? See: GIT_SETUP_REQUIRED.md
- GitHub Pages not working? See: DEPLOY_GITHUB_PAGES.md
- Want GUI instead? Download GitHub Desktop: https://desktop.github.com/

---

**Status:** Ready to deploy once Git is installed! ✅

Last Updated: October 26, 2025
