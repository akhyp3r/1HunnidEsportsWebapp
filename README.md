# One Hunnid Esports // Team Operations & Scrim Hub

A clean, minimalist esports management hub inspired by Google Gemini (`#131314` dark canvas), built for **One Hunnid Esports**.

---

## 🚀 Features

- **👑 Distinct Admin Operations Console:**
  - Create and manage individual player logins & passwords with one-click credential clipboard export.
  - Announce scrim schedules with automatic 12-hour clock and device timezone adjustment.
  - Live RSVP attendance tracking (Free vs. Not Free vs. Pending) & Discord scrim ping formatter.
  - Team roster management with confirmation safeguards.
  - Squad availability heatmap (7-day matrix) across player time slots.
  - Official team bulletins and notices.

- **🎮 Dedicated Player Portal:**
  - Clean player-only interface (restricted from admin tools).
  - 1-click RSVP for scrims (`I'm Free` / `Cannot Play`).
  - Weekly availability scheduler with daily dropdown menus.
  - Player profile & custom avatar (PFP) editor.

- **🗺️ Valoplant Strategy Creator & Repository:**
  - Valoplant standalone launcher (`https://valoplant.gg`).
  - Fast strat capture with drag-and-drop, file upload, or instant `Ctrl + V` clipboard paste.
  - Full Valorant map roster: `Abyss`, `Ascent`, `Haven`, `Lotus`, `Split`, `Summit`, `Sunset`, `Bind`, `Breeze`, `Corrode`, `Fracture`, `Icebox`, `Pearl`.
  - Dynamic site dropdown (`Default`, `A`, `B`, and dynamic `C` on Haven & Lotus).
  - Dedicated **Strategies** library with filter by Map, filter by Site, search, and fullscreen lightbox viewer.

- **🌐 Gankster Scrims:**
  - Direct launcher and pop-out window for Gankster Valorant Scrims & Tournaments.

---

## ⚡ Deployment to Vercel (GitHub Integration)

This repository is pre-configured with `vercel.json` and a serverless entrypoint (`api/index.js`).

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `one-hunnid-esports-hub`).
3. Leave it Public or Private, and click **Create repository**.

### Step 2: Push Your Code to GitHub
Open your terminal (PowerShell or Bash) in this project folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: One Hunnid Esports hub ready for Vercel"

# Rename branch to main
git branch -M main

# Link to your new GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# Push to GitHub
git push -u origin main
```

---

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** → **"Project"**.
3. Under **Import Git Repository**, find and select your `one-hunnid-esports-hub` repository.
4. **Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (or `vite build`).
   - **Output Directory**: `dist`.
   - **Install Command**: `npm install`.
5. *(Optional)* In **Environment Variables**, you can add:
   - `JWT_SECRET`: Any random secure string (e.g. `onehunnid_secret_2026`).
6. Click **Deploy**.

Within 1-2 minutes, your project will be live with a free SSL `.vercel.app` URL!

---

## 🔑 Initial Default Admin Account

| Role | Username | Password |
|---|---|---|
| **Operations Director (Admin)** | `admin` | `admin123` |

*Log in with these credentials to create accounts for all your players!*

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Build client
npm run build

# Start local server
npm start
```
Runs at `http://localhost:5000`.
