# Developer RPG Profile (Hackathon Edition)

An interactive, gaming-inspired profile dashboard system where a developer's GitHub identity and contributions are visualized as a premium RPG character sheet. The application is built with **React 19**, **TypeScript 6**, **Vite 8**, and **Vanilla CSS** with a custom neobrutalist/cyberpunk design system.

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Directory Structure](#directory-structure)
3. [Core Data Models (TypeScript Types)](#core-data-models-typescript-types)
4. [Component Specifications](#component-specifications)
5. [Static Registries (Data Layer)](#static-registries-data-layer)
6. [Design Tokens & Styling System](#design-tokens--styling-system)
7. [App Flow & Sandbox State](#app-flow--sandbox-state)
8. [Extension & Contribution Model](#extension--contribution-model)
9. [GitHub Sign-In & Integration Roadmap](#github-sign-in--integration-roadmap)
10. [Local Development & Commands](#local-development--commands)

---

## System Architecture

The project is structured as a **statically rendered single-page application (SPA)** that reads character data from central data registries. Key interactions include:
- **Sandbox Role Selection**: Toggles the display state between "Contributor" and "Maintainer" perspectives.
- **Interactive Character Creator (Origin Selector)**: Allows users to click on predefined origin themes (e.g., Space Explorer, Cyber Warrior) and instantly preview the active state, styling tokens (`--origin-accent`), and descriptive perks in an interactive block.
- **Scroll Spy Anchoring**: Side-nav links navigate to section containers on the page.

---

## Directory Structure

```text
├── docs/
│   └── component-api.md          # Contributor-facing guidelines for component extension
├── src/
│   ├── components/               # Presentation & interactive React components
│   │   ├── AchievementVault.tsx  # Grid of developer achievements and milestone cards
│   │   ├── AnalysisReport.tsx    # Diagnostic panel containing strengths, weaknesses, and missing skills
│   │   ├── OriginSelector.tsx    # Interactive character creator for theme customization
│   │   ├── ProfilePanel.tsx      # Main character avatar, level, rank, and XP progress bar
│   │   ├── QuestBoard.tsx        # Repositories modeled as locked/active/unlocked quests
│   │   ├── SideNav.tsx           # Sticky left-hand navigation linking page anchors
│   │   ├── SkillTree.tsx         # Skill progression nodes with visual level progress meters
│   │   └── StatPanel.tsx         # Matrix of combat tiles displaying commits, stars, streak, and PR metrics
│   ├── data/                     # Content registries (JSON-like TS configs)
│   │   ├── character.ts          # Central developer profile, combat statistics, and achievements data
│   │   └── origins.ts            # Archetypes data registry for the Character Creator
│   ├── styles/                   # Modular CSS stylesheets
│   │   ├── base.css              # Global layout, resets, card wrappers, and sandbox login panel styles
│   │   ├── components.css        # Detailed layouts, hover effects, and grid rules for all widgets
│   │   └── tokens.css            # Custom CSS variables, colors, fonts, borders, and shadows
│   ├── types/                    # Core TypeScript contracts
│   │   └── profile.ts            # Data models and interfaces
│   ├── App.tsx                   # App shell layout composition and sandbox role management state
│   ├── index.css                 # Main stylesheet import router including Google Web Fonts
│   └── main.tsx                  # React Application DOM mount node
├── index.html                    # Root HTML document structure and Google Web Font configurations
├── package.json                  # Scripts and dependencies configurations
├── tsconfig.json                 # Core TypeScript compiler configuration
├── tsconfig.app.json             # App compiler configuration targeting browser execution
├── tsconfig.node.json            # Node compiler configurations for Vite configs
└── vite.config.ts                # Vite bundler execution configurations
```

---

## Core Data Models (TypeScript Types)

Defined in [`src/types/profile.ts`](file:///Users/nandini/Downloads/analysis/analysis/src/types/profile.ts), these types form the strict contract between components and data files:

```typescript
// Individual combat metrics card data
export type Stat = {
  label: string;
  value: number | string;
  modifier: string; // e.g. "+14 this week" or "Personal best"
};

// Milestone achievements
export type Achievement = {
  title: string;
  tier: string;      // Gold, Silver, Emerald, Cyan, etc.
  detail: string;    // unlocked details
};

// Repository mapped as quests
export type RepositoryQuest = {
  name: string;
  stars: number;
  questType: string; // e.g. "UI Artifact", "Component Forge"
  difficulty: 'Normal' | 'Hard' | 'Epic';
  status: 'Unlocked' | 'Active' | 'Locked';
};

// Skills in the skill tree
export type SkillNode = {
  name: string;
  level: number;     // 0 to 100
  branch: string;    // e.g. "Core Magic", "Rune Control"
};

// Diagnostics performance analysis report
export type Analysis = {
  characterClass: string;
  powerLevel: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  nextQuest: string;
};

// Complete Character profile structure
export type DeveloperProfile = {
  name: string;
  title: string;
  className: string;
  specialization: string;
  guild: string;
  avatarInitials: string;
  powerLevel: number;
  xpProgress: number;
  rank: string;
  battleTag: string;
  stats: Stat[];
  achievements: Achievement[];
  repositories: RepositoryQuest[];
  skillTree: SkillNode[];
  analysis: Analysis;
};

// README Origin Themes (Character Creator)
export type OriginTheme = {
  id: string;
  name: string;
  flavor: string;
  accent: string;    // CSS custom color variable or hex
  perks: string[];
};
```

---

## Component Specifications

All UI panels are functional/presentation components mapping profile sections.

### 1. `SideNav` ([SideNav.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/SideNav.tsx))
- **Props**: `{ battleTag: string }`
- **Description**: Displays the title ("Character Console"), developer's `battleTag`, and a navigation menu targeting hash anchor IDs on the layout page.
- **Anchors**: `#character`, `#stats`, `#achievements`, `#quests`, `#skills`, `#origins`, `#analysis`

### 2. `ProfilePanel` ([ProfilePanel.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/ProfilePanel.tsx))
- **Props**: `{ profile: DeveloperProfile }`
- **Description**: Renders the developer's avatar (Initials badge), guild name, developer title, specialty class, rank, overall power level, and an animated Experience progress bar matching `xpProgress` dynamically.
- **A11y**: Progress bar matches `role="progressbar"` with standard `aria-valuenow` mapping.

### 3. `StatPanel` ([StatPanel.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/StatPanel.tsx))
- **Props**: `{ stats: Stat[] }`
- **Description**: Displays quantitative developer output metrics (e.g. Commits, Merged PRs, Stars, Streak) mapped in a 4-column grid layout.

### 4. `AchievementVault` ([AchievementVault.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/AchievementVault.tsx))
- **Props**: `{ achievements: Achievement[] }`
- **Description**: A grid of unlocked developer milestones. Card list items implement a sequential animation transition delay (`index * 90ms`) for a staggered loading slide effect.

### 5. `QuestBoard` ([QuestBoard.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/QuestBoard.tsx))
- **Props**: `{ repositories: RepositoryQuest[] }`
- **Description**: Mapped quests highlighting repositories. Card styling transitions visually depending on `repo.status` values (`locked`, `active`, `unlocked`).

### 6. `SkillTree` ([SkillTree.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/SkillTree.tsx))
- **Props**: `{ skills: SkillNode[] }`
- **Description**: Abilties matrix including interactive visual progress meters indicating level metrics (0-100) and respective branches.

### 7. `OriginSelector` ([OriginSelector.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/OriginSelector.tsx))
- **Props**: `{ origins: OriginTheme[] }`
- **Description**: Displays clickable grid tiles for each character archetype (themes). Active state is set in a local React state variable (`selectedId`).
- **Accent Injection**: Pass the custom CSS variable directly using React's inline style bindings: `style={{ '--origin-accent': origin.accent }}` to dynamically tint active card borders.

### 8. `AnalysisReport` ([AnalysisReport.tsx](file:///Users/nandini/Downloads/analysis/analysis/src/components/AnalysisReport.tsx))
- **Props**: `{ report: Analysis }`
- **Description**: Performance analysis reporting strengths, gaps (missing skills), and the next recommended quest action.

---

## Static Registries (Data Layer)

### Character Profile Data ([character.ts](file:///Users/nandini/Downloads/analysis/analysis/src/data/character.ts))
Exposes the single static export `characterProfile: DeveloperProfile` with preset properties:
- **BattleTag**: `'UIArcana#2842'`
- **Developer Name**: `'Nandini'`
- **Class/Specialization**: `Frontend Mage` / `React`
- **Stats**: Commits (`1324`), Merged PRs (`278`), Stars (`941`), Streak (`29 days`).
- **Achievements**: `100 Commits`, `First Pull Request`, `Documentation Master`, `Bug Hunter`.
- **Quests**: `spellbook-ui`, `react-raid-kit` (Active), `guild-docs-engine`, `quest-log-api` (Locked).
- **Skills**: React Mastery (`92`), TypeScript Precision (`85`), UI Crafting (`90`), Testing Discipline (`46`), CI/CD (`38`), DB Architecture (`31`).

### Themes Registry ([origins.ts](file:///Users/nandini/Downloads/analysis/analysis/src/data/origins.ts))
Exposes `originThemes: OriginTheme[]` containing the archetypes selectable in the creator selector:
1. **Space Explorer** (`id: 'space-explorer'`) - Electric Blue accent
2. **Cyber Warrior** (`id: 'cyber-warrior'`) - Cyan accent
3. **Guild Master** (`id: 'guild-master'`) - Emerald accent
4. **Open Source Hero** (`id: 'open-source-hero'`) - Gold accent
5. **Dungeon Coder** (`id: 'dungeon-coder'`) - Steel Light accent
6. **Pixel Adventurer** (`id: 'pixel-adventurer'`) - Frost White accent

---

## Design Tokens & Styling System

The application uses an aesthetic style pattern inspired by gaming panels and retro/neobrutalist card games. The stylesheets are cleanly split:

### 1. Style Entry Point ([index.css](file:///Users/nandini/Downloads/analysis/analysis/src/index.css))
Imports Google Web Fonts and chains stylesheets in sequence:
```css
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Chakra+Petch:wght@400;500;600;700&display=swap');
@import './styles/tokens.css';
@import './styles/base.css';
@import './styles/components.css';
```

### 2. Design Tokens ([tokens.css](file:///Users/nandini/Downloads/analysis/analysis/src/styles/tokens.css))
Declares primary colors and layout presets:
- **Core Gaming Accents**: Electric blue, cyan, emerald green, and gold.
- **Palette Backgrounds**: Cream background tones (`--bg-void: #f4efe4`, `--bg-deep: #fbf8f1`, `--bg-panel: #fffaf0`).
- **Typography & Borders**: Strict dark borders (`--line-strong: #101114`) and shadow arrays (`--shadow-neon`).

### 3. Layout CSS Rules ([base.css](file:///Users/nandini/Downloads/analysis/analysis/src/styles/base.css))
- **Typography bindings**: All body copy uses `Chakra Petch`. Headings (`h1`, `h2`, `h3`, `h4`, `strong`) use the futuristic `Rajdhani` font.
- **Background Details**: Renders a repeating scanline grid linear gradient (`repeating-linear-gradient(0deg, rgba(16,17,20,0.08)...)`) overlay.
- **App Shell Grid**: Configured with a 2-column sidebar layout (`310px 1fr`) aligning the sticky navigation panel to the left, scaling smoothly down to a 1-column layout on smaller screens.

### 4. Interactive Components styling ([components.css](file:///Users/nandini/Downloads/analysis/analysis/src/styles/components.css))
- **Neobrutalist Borders & Shadows**: Custom cards style using `border: 4px solid var(--line-strong)` and `box-shadow: var(--shadow-neon)`.
- **Card Slide Animations**: Implements `@keyframes reveal` translating cards upwards (`translateY(8px)`) while animating opacity.
- **Active State Highlights**: Applies transform movements on hover: `transform: translateX(3px)` for side links, and `transform: translateY(-2px)` for selection tiles.

---

## App Flow & Sandbox State

[`src/App.tsx`](file:///Users/nandini/Downloads/analysis/analysis/src/App.tsx) composes the visual UI shell:
- **`role` state**: Toggle buttons manage active role views (`Contributor` or `Maintainer`). When toggled, headers change content copy dynamically.
- **Auth Stack**: Provides a mocked sandbox input sequence (GitHub Sign In, Email, Password, Assemble action).
- **Layout Order**: Displays the `ProfilePanel`, `StatPanel`, `AchievementVault`, `QuestBoard`, `SkillTree`, `OriginSelector` and `AnalysisReport` components in a single column layout side-by-side with the sticky `SideNav` control sidebar.

---

## Extension & Contribution Model

You can add stats, content registries, achievements, or theme profiles without breaking rendering logic.

### Steps to Add a New Theme/Origin:
1. Open [`src/data/origins.ts`](file:///Users/nandini/Downloads/analysis/analysis/src/data/origins.ts).
2. Add a new object following the `OriginTheme` model structure:
   ```typescript
   {
     id: 'dungeon-master',
     name: 'Dungeon Master',
     flavor: 'Control the rules of play, organize dungeons, and design systems.',
     accent: 'var(--emerald-core)',
     perks: ['Rule Arbitrage', 'Spawn Entities', 'System Diagnostics']
   }
   ```
3. Save the file. The `OriginSelector` component automatically loops through and displays the new card option immediately.

### Steps to Add Custom Achievements or Quests:
1. Open [`src/data/character.ts`](file:///Users/nandini/Downloads/analysis/analysis/src/data/character.ts).
2. Insert new object records into either the `achievements` or `repositories` lists.
3. Save the file to trigger automated rendering updates in the respective UI panels.

---

## GitHub Sign-In & Integration Roadmap

For full real-world utility (moving beyond static mock previews), follow this recommended development flow:

1. **OAuth Setup**: Initialize a GitHub OAuth App (or GitHub App) on your GitHub account settings. Add credentials and Callback URL redirects to your server backend application.
2. **Access Tokens**: Securely store returned access credentials in database storage or active user sessions.
3. **Octokit Calls**: Fetch the active user's metrics (total commits, merged PRs, stars, repository stats) and map them directly to replace the static properties of the `DeveloperProfile` object dynamically.
4. **README Creator integration**: Set up write API pipelines. User confirms their selected Origin Theme -> UI makes a POST request to push the generated character card directly to the repository's `README.md` or submits a PR proposal branch.

---

## Local Development & Commands

Run commands from the root directory path:

- **Start Local Dev Server**:
  ```bash
  npm run dev
  ```
  Runs Vite to hot-reload and host local instances on port `5173` (by default).

- **Typecheck & Compile Build Bundle**:
  ```bash
  npm run build
  ```
  Runs TypeScript compiler check (`tsc -b`) and bundles files inside the `dist` directory.

- **Lint Source Files**:
  ```bash
  npm run lint
  ```
  Executes ESLint configs to ensure code conforms to standards.

- **Local Production Bundle Preview**:
  ```bash
  npm run preview
  ```
  Launches a local production server to verify build states.
