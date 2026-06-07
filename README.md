<div align="center">
  
  <h1>Developer RPG Profile Generator</h1>
  
  <p>
    Turn your GitHub profile (and optionally your resume) into an RPG-style character sheet,
    then export a themed <code>README.md</code> you can paste into your GitHub profile.
  </p>

  <p>
    <strong>GitHub stats → RPG stats</strong> (commits, merged PRs, stars, streak) •
    <strong>Power Level (0–100)</strong> + rank •
    <strong>Skill Tree</strong> + <strong>Quest Log</strong> •
    <strong>README exporter</strong> (copy / download)
  </p>

  <br />

  <div>
    <a href="https://github.com/goyaljiiiiii" target="_blank" rel="noreferrer" title="GitHub">
      <svg width="36" height="36" viewBox="0 0 19 19" style="vertical-align:middle;">
        <use href="/icons.svg#github-icon"></use>
      </svg>
    </a>
    <a href="https://x.com/goyaljiiiiii" target="_blank" rel="noreferrer" title="X (Twitter)" style="margin-left:10px;">
      <svg width="36" height="36" viewBox="0 0 19 19" style="vertical-align:middle;">
        <use href="/icons.svg#x-icon"></use>
      </svg>
    </a>
    <a href="https://linkedin.com/in/goyaljiiiiii" target="_blank" rel="noreferrer" title="LinkedIn" style="margin-left:10px;">
      <svg width="36" height="36" viewBox="0 0 20 20" style="vertical-align:middle;">
        <use href="/icons.svg#social-icon"></use>
      </svg>
    </a>
    <a href="mailto:nandini.solutions.software@email.com" title="Email" style="margin-left:10px;">
      <svg width="36" height="36" viewBox="0 0 20 20" style="vertical-align:middle;">
        <use href="/icons.svg#social-icon"></use>
      </svg>
    </a>
    <a href="https://youtube.com/self_taught_bob" target="_blank" rel="noreferrer" title="YouTube" style="margin-left:10px;">
      <svg width="36" height="36" viewBox="0 0 20 20" style="vertical-align:middle;">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>
    </a>
  </div>

  <br />

  <div style="max-width: 820px;">
    <p style="margin:0;">
      Built with <strong>React 19</strong>, <strong>TypeScript 6</strong>, <strong>Vite 8</strong>,
      <strong>Node.js Serverless Functions</strong>, and <strong>Vanilla CSS</strong> using a custom neobrutalist / cyberpunk design system.
    </p>
  </div>
</div>

---

## Quick start

1. Enter a <strong>GitHub username</strong> (public mode) or sign in with GitHub (OAuth).
2. The app fetches your profile, repository stats, PR merges, and contribution streak.
3. Your character sheet is generated: <strong>class</strong>, <strong>rank</strong>, <strong>power level</strong>, a <strong>skill tree</strong>, and a <strong>quest log</strong>.
4. (Optional) Upload your resume (PDF/DOCX) to extract skills and unlock achievements.
5. Use <strong>README Generator</strong> to copy / download your themed <code>README.md</code>.

---

## Features (what you get)

- <strong>GitHub OAuth & Public Search</strong>
  - Secure login via <code>/api/github</code>
  - Public fallback: type any username and generate instantly
- <strong>RPG Dashboard</strong>
  - Rank/guild identity panel
  - Combat stats grid (commits, merged PRs, stars, streak)
  - Achievement vault
  - Quest board (repos mapped to locked/active/unlocked)
  - Skill tree (language masteries + engineering lifecycle skills)
  - Diagnostics report (strengths, gaps, next recommendations)
- <strong>Resume Upgrader (Optional)</strong>
  - Parse PDF/DOCX on the server via <code>/api/resume</code>
  - Merge extracted skills into your dashboard
- <strong>Dynamic Themes</strong>
  - Gaming, Cute, Cloud, Cyberpunk, Minimalist
- <strong>README.md Generator</strong>
  - Renders themed markdown from your live stats
  - Copy to clipboard or download as a <code>.md</code> file

---

## Socials & links

<div>
  <ul>
    <li><a href="https://github.com/goyaljiiiiii" target="_blank" rel="noreferrer">GitHub</a></li>
    <li><a href="https://x.com/goyaljiiiiii" target="_blank" rel="noreferrer">X (Twitter)</a></li>
    <li><a href="https://linkedin.com/in/goyaljiiiiii" target="_blank" rel="noreferrer">LinkedIn</a></li>
    <li><a href="mailto:nandini.solutions.software@email.com">Email</a></li>
    <li><a href="https://youtube.com/self_taught_bob" target="_blank" rel="noreferrer">YouTube</a></li>
  </ul>
</div>

---

## Tech stack

- <strong>Frontend:</strong> React 19, TypeScript, Vite
- <strong>Backend:</strong> Node.js serverless handlers (<code>/api/*</code>)
- <strong>Styling:</strong> Vanilla CSS with a token-based design system (neobrutalist/cyberpunk)
- <strong>UX:</strong> Theme-driven dashboard + live README export

---

## 🎮 How it works (deep but still readable)

1. Open the app and enter a <strong>GitHub username</strong> (public mode) or sign in with GitHub (OAuth).
2. The backend fetches your GitHub profile, repositories, commit/PR counts, and contribution activity.
3. The app converts those metrics into RPG-style stats: <strong>class, rank, power level</strong>, a <strong>skill tree</strong>, and a <strong>quest log</strong>.
4. (Optional) Upload your resume (PDF/DOCX). We extract skill keywords and upgrade your skill tree + achievements.
5. Go to <strong>README Generator</strong> and export a themed <code>README.md</code> for your GitHub profile (copy or download).


---

## 🎮 Features & Gameplay

1. **GitHub OAuth Login & Public Search**

   - Click "Sign in with GitHub" to securely exchange authentication codes for an access token via `/api/github`.
   - Fetches profile info, repositories, commit counts, and merged pull request totals.
   - Parses the active event stream to calculate a real contribution streak.
   - **Fallback**: Enter any public username to compile profile details instantly without signing in.

2. **Interactive RPG Dashboard**
   - **Identity Panel**: Visualizes developer rank (e.g. Diamond, Gold, Silver), guild (company), custom specialization, and level.
   - **Combat Stats Grid**: Commits, merged PRs, stars earned, and streak days translated to game statistics.
   - **Achievement Vault**: Sequential loading cards displaying milestones (e.g. Code Crusader, Guild Leader, Flame Keeper).
   - **Quest Log**: Visual quest cards representing repositories (mapped to Unlocked, Active, or Locked statuses with difficulty classes).
   - **Skill Tree**: Progress meters showing language masteries (calculated from repository bytes) alongside engineering lifecycle skills (Git, CI/CD, Testing).
   - **Diagnostics Performance Report**: Formulates strengths, weaknesses, missing skills, and next recommended quests.

3. **Resume Upgrader (Optional)**
   - Upload PDF or DOCX resumes directly in the sandbox to parse experience metrics.
   - Parses document text on the server (`/api/resume`), extracts skills, and merges them to upgrade your dashboard Skill Tree and unlock special achievements (e.g. "Battle Hardened", "Scholar Archetype").

4. **Dynamic Visual Themes**
   - Five prebuilt dashboard themes: **Gaming 🎮**, **Cute 🌸**, **Cloud ☁️**, **Cyberpunk ⚡**, and **Minimalist 🖤**.
   - Redefines design tokens (backgrounds, fonts, shadows, borders, and corner rounding) to visually transform the interface instantly.

5. **README.md Generator**
   - Renders a markdown string based on your active dashboard statistics, skills, achievements, and selected theme.
   - Features dynamic text-based progress bars, shields.io badges, and quest logs.
   - Provides options to copy to clipboard or download as a `.md` file.

---

## 📁 System Architecture & Directory Structure

```text
├── api/                          # Vercel Serverless Backend Functions (Node.js)
│   ├── github.ts                 # Fetches GitHub profile details, events, and repo stats
│   ├── rating.ts                 # Evaluates profile completeness, consistency, and impact scores
│   ├── readme.ts                 # Compiles themed markdown layouts (5 prebuilt styles)
│   └── resume.ts                 # Deciphers text from PDF and DOCX binary resumes
├── src/
│   ├── components/               # React Presentation & Feature Widgets
│   │   ├── AchievementVault.tsx  # Grid of developer milestones
│   │   ├── AnalysisReport.tsx    # Diagnostic panel containing strengths & growth recommendations
│   │   ├── OriginSelector.tsx    # Interactive character creator for theme previews
│   │   ├── ProfilePanel.tsx      # Main character avatar, rank, and XP progress bar
│   │   ├── QuestBoard.tsx        # Repositories styled as active/locked/unlocked quests
│   │   ├── ReadmePanel.tsx       # Live README generator, preview, copy, and download actions
│   │   ├── SideNav.tsx           # Sticky left-hand navigation linking page anchors
│   │   ├── SkillTree.tsx         # Skill progression nodes with visual meters
│   │   └── StatPanel.tsx         # Matrix of combat tiles displaying commits, stars, and PRs
│   ├── data/                     # Content registries
│   │   ├── character.ts          # Central developer profile (initial fallback data)
│   │   └── origins.ts            # Archetypes data registry for the Character Creator
│   ├── styles/                   # Modular CSS stylesheets
│   │   ├── base.css              # Reset rules, layouts, uploader, rating meters, and loading states
│   │   ├── components.css        # Interactive grids, cards, transitions, and hover animations
│   │   └── tokens.css            # Scoped variables defining Gaming, Cute, Cloud, Cyberpunk, and Minimalist overrides
│   ├── types/                    # Core TypeScript contracts
│   │   └── profile.ts            # Data models
│   ├── App.tsx                   # Central React composition containing state coordinates
│   ├── index.css                 # Style entry point importing Google Web Fonts
│   └── main.tsx                  # React mounting node
├── index.html                    # Root HTML template
├── package.json                  # Scripts and dependencies configurations
├── tsconfig.json                 # TypeScript compiler configuration
├── vercel.json                   # Vercel SPA rewrites and API routing configuration
└── vite.config.ts                # Intercepts /api/* requests to execute handlers locally in development
```

---

## 🛠️ Local Development & Setup

### 1. Prerequisites
- **Node.js**: `v20+` or `v24+` recommended.
- **nvm** (Optional): Used to switch node environments.

### 2. Environment Configuration
Create a `.env` or `.env.local` file at the root based on [`.env.example`](./.env.example):

```bash
# Register a GitHub OAuth App to obtain client keys:
# Homepage URL = http://localhost:5173
# Callback URL = http://localhost:5173
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Optional: Add a Personal Access Token to avoid public API rate limits:
GITHUB_TOKEN=your_personal_access_token_here
```

### 3. Execution Commands
Run these commands from the root directory:

- **Start Dev Server**
  ```bash
  npm run dev
  ```
  Starts Vite on **http://localhost:5173** and serves the SPA + local `/api/*` routes.

- **Build (production bundle)**
  ```bash
  npm run build
  ```
  Runs `tsc -b` then builds the app into `dist/`.

- **Lint**
  ```bash
  npm run lint
  ```

- **Preview production build**
  ```bash
  npm run preview
  ```


---

## 🚀 Deployment to Vercel

1. Connect the repo in your Vercel dashboard.
2. Vercel builds the React SPA and deploys the `/api/*` serverless handlers.
3. Add env vars in **Vercel → Project Settings → Environment Variables**:
   - `VITE_GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_TOKEN` (optional but recommended to reduce rate limits)
4. Deploy.

