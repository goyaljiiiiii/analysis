/* eslint-disable */
import type { DeveloperProfile } from '../src/types/profile';

type ThemeConfig = {
  emojiHeader: string;
  emojiStat: string;
  emojiSkill: string;
  emojiAchievement: string;
  emojiQuest: string;
  badgeColor: string;
  accentBadgeColor: string;
  progressBarChar: string;
  progressBarEmptyChar: string;
  bannerUrl: string;
  footerText: string;
  statsTheme: string;
};

// Default styling sets
const STYLE_FALLBACKS: Record<string, ThemeConfig> = {
  gaming: {
    emojiHeader: '🎮',
    emojiStat: '⚡',
    emojiSkill: '🔮',
    emojiAchievement: '🏆',
    emojiQuest: '⚔️',
    badgeColor: 'ff007f', // pink
    accentBadgeColor: '39ff14', // green
    progressBarChar: '█',
    progressBarEmptyChar: '░',
    bannerUrl: 'https://img.shields.io/badge/🎮%20DEVELOPER--RPG%20-READY%20PLAYER%20ONE-blue?style=for-the-badge&logo=retroarch&color=4a0e4e',
    footerText: '🎮 Game saved. Powered by Developer RPG Profile Generator.',
    statsTheme: 'radical'
  },
  cute: {
    emojiHeader: '🌸',
    emojiStat: '🍬',
    emojiSkill: '✨',
    emojiAchievement: '🦄',
    emojiQuest: '🎀',
    badgeColor: 'ffb6c1', // light pink
    accentBadgeColor: 'dda0dd', // plum
    progressBarChar: '🌸',
    progressBarEmptyChar: '💮',
    bannerUrl: 'https://img.shields.io/badge/🌸%20SWEET--PROFILE-LEVEL%20UP-pink?style=for-the-badge&logo=heart&color=ffe4e1',
    footerText: '🌸 Have a magical coding day! Powered by Developer RPG.',
    statsTheme: 'gruvbox_light'
  },
  cloud: {
    emojiHeader: '☁️',
    emojiStat: '🌀',
    emojiSkill: '🌟',
    emojiAchievement: '🎖️',
    emojiQuest: '🌊',
    badgeColor: '4fc3f7', // sky blue
    accentBadgeColor: '0288d1', // deep sky blue
    progressBarChar: '🔵',
    progressBarEmptyChar: '⚪',
    bannerUrl: 'https://img.shields.io/badge/☁️%20CLOUD--NAVIGATOR-ESTABLISHED-blue?style=for-the-badge&logo=googlecloud&color=e0f7fa',
    footerText: '☁️ Systems nominal in the cloud. Powered by Developer RPG.',
    statsTheme: 'gotham'
  },
  cyberpunk: {
    emojiHeader: '⚡',
    emojiStat: '🔋',
    emojiSkill: '💿',
    emojiAchievement: '🤖',
    emojiQuest: '📡',
    badgeColor: '00ffcc', // neon cyan
    accentBadgeColor: 'ff007f', // hot pink
    progressBarChar: '▓',
    progressBarEmptyChar: '░',
    bannerUrl: 'https://img.shields.io/badge/⚡%20CYBERNETIC--CONSOLES-AUTHORIZED-yellow?style=for-the-badge&logo=future&color=0a0a0c',
    footerText: '⚡ Connection secure. Keep shipping in the cyber grid.',
    statsTheme: 'tokyonight'
  },
  minimalist: {
    emojiHeader: '🖤',
    emojiStat: '▪️',
    emojiSkill: '▫️',
    emojiAchievement: '▪️',
    emojiQuest: '▫️',
    badgeColor: '000000', // black
    accentBadgeColor: '6c757d', // grey
    progressBarChar: '■',
    progressBarEmptyChar: '□',
    bannerUrl: 'https://img.shields.io/badge/🖤%20MINIMALIST--CONSOLE-ACTIVE-black?style=for-the-badge&logo=git&color=f8f9fa',
    footerText: '🖤 Simplicity is the ultimate sophistication.',
    statsTheme: 'dark'
  },
};

// GIF pools for randomized sticker drops
const GIF_STICKERS = {
  gaming: [
    'https://media.giphy.com/media/l0HlIDueXmcWNTPO0/giphy.gif', // retro controller
    'https://media.giphy.com/media/3knKct3fGqxhK/giphy.gif',     // coding gaming room
    'https://media.giphy.com/media/26BGD4l7u35IpwhS8/giphy.gif', // 8bit computer
  ],
  cute: [
    'https://media.giphy.com/media/9d3LQ6TdV2Flo8ODTU/giphy.gif', // cute pixel flower
    'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',     // coding cat
    'https://media.giphy.com/media/LpLfRYn5n9QpYlRkmC/giphy.gif', // cute gaming sleep
  ],
  general: [
    'https://media.giphy.com/media/26ufj00q7AtrZgVvW/giphy.gif', // hacker screen grid
    'https://media.giphy.com/media/K3BvSRfyo0ye4/giphy.gif',     // retro workspace
    'https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif', // dynamic text cursor
  ]
};

const RPG_QUOTES = [
  "\"Talk is cheap. Show me the code.\" — Linus Torvalds",
  "\"The only way to go fast, is to go well.\" — Robert C. Martin",
  "\"It's dangerous to go alone! Take this compile script.\" — The Old Hermit",
  "\"Every bug is just a hidden quest waiting to be unlocked.\" — Guild Master",
  "\"Make it work, make it right, make it fast.\" — Kent Beck",
  "\"Programs must be written for people to read, and only incidentally for machines to execute.\" — Abelson & Sussman"
];

// Helper to generate custom progress bars
const generateProgressBar = (level: number, char: string, emptyChar: string) => {
  const totalBlocks = 10;
  const filledBlocks = Math.round((level / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  return `${char.repeat(filledBlocks)}${emptyChar.repeat(emptyBlocks)}`;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const { profile, customStyle = '' } = req.body;

    if (!profile) {
      throw new Error('No profile data provided for README generation.');
    }

    // Determine random configuration parameters on each invocation
    const randLayoutType = Math.floor(Math.random() * 5); 
    const randBadgeStyle = ['for-the-badge', 'flat-square', 'plastic', 'flat'][Math.floor(Math.random() * 4)];
    const randProgressBarChar = ['█', '▓', '■', '🔴', '🔵', '🌸', '✨', '🔥'][Math.floor(Math.random() * 8)];
    const randIncludeAvatar = false; 
    const randIncludeGif = false;

    // 1. DYNAMIC AI GENERATION (using Gemini API if Key is present)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
    if (GEMINI_API_KEY && customStyle.trim()) {
      try {
        const layoutPromptInstructions = [
          `Structure: Capsule Header -> Socials -> Infographic Stats -> Project Timeline -> Diagnostic Report -> RPG motivational Quote.`,
          `Structure: ASCII Art code banner -> Character Sheet JSON block -> Skill badges -> Tables of active quests -> contribution snake -> call to action.`,
          `Structure: Dynamic Typing SVG Header -> bullet stats sheet -> visual metrics table -> GIFs + Stats cards -> Party Invitation.`,
          `Structure: Centered Heading -> narrative developer bio (prose) -> badges skill tree -> Experience cards -> social icons -> custom footer.`,
          `Structure: Clean layout without banners -> Project quest tables -> code block details -> diagnostics report -> icons list.`
        ][Math.floor(Math.random() * 5)];

        const aboutMeTones = ['playful and gaming-oriented', 'cyberpunk grid Operator status', 'soft and cute sakura aesthetic', 'minimalist and clean developer prose', 'highly professional enterprise engineer'][Math.floor(Math.random() * 5)];
        const socialAlignments = ['center aligned', 'left aligned', 'right aligned'][Math.floor(Math.random() * 3)];
        const skillsFormats = ['shields.io grid format', 'nested lists with custom progress bar icons', 'structured markdown tables'][Math.floor(Math.random() * 3)];

        const aiPrompt = `You are an expert GitHub profile README generator. Create a complete, bespoke, visual developer profile README.md in markdown format.

Developer Profile details: ${JSON.stringify(profile)}
User's style request: "${customStyle}"

Core Constraints:
- Layout Sequence: ${layoutPromptInstructions}
- Tone of about/intro: "${aboutMeTones}"
- Social alignment: "${socialAlignments}"
- Tech Stack Skills representation: "${skillsFormats}"
- Shields.io badge style format: "${randBadgeStyle}"
- Output ONLY raw Markdown content. Do NOT wrap output in markdown code fences (\`\`\`markdown ... \`\`\`). Do NOT include metadata fields. Make it instant GitHub copy-pasteable.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: aiPrompt }]
            }],
            generationConfig: {
              temperature: 0.9, 
              maxOutputTokens: 2048,
            }
          })
        });

        if (response.ok) {
          const aiData = await response.json();
          let markdown = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          markdown = markdown.trim();
          
          if (markdown.startsWith('```markdown')) {
            markdown = markdown.slice(11);
          }
          if (markdown.startsWith('```')) {
            markdown = markdown.slice(3);
          }
          if (markdown.endsWith('```')) {
            markdown = markdown.slice(0, -3);
          }
          
          markdown = markdown.trim();

          if (markdown) {
            res.setHeader('Content-Type', 'text/markdown');
            res.status(200).send(markdown);
            return;
          }
        }
      } catch (aiErr) {
        console.error('Gemini API call failed, falling back to rule-based parser:', aiErr);
      }
    }

    // 2. INTELLIGENT RULE-BASED FALLBACK (Completely randomized & shuffled component builder)
    const lowercasePrompt = customStyle.toLowerCase();
    
    // Determine theme archetype
    let baseTheme = 'minimalist';
    if (lowercasePrompt.includes('cute') || lowercasePrompt.includes('pink') || lowercasePrompt.includes('sakura')) {
      baseTheme = 'cute';
    } else if (lowercasePrompt.includes('game') || lowercasePrompt.includes('retro') || lowercasePrompt.includes('arcade')) {
      baseTheme = 'gaming';
    } else if (lowercasePrompt.includes('cloud') || lowercasePrompt.includes('sky') || lowercasePrompt.includes('blue')) {
      baseTheme = 'cloud';
    } else if (lowercasePrompt.includes('cyber') || lowercasePrompt.includes('neon') || lowercasePrompt.includes('tech')) {
      baseTheme = 'cyberpunk';
    } else {
      // Pick a random one if nothing specified
      const themes = ['gaming', 'cute', 'cloud', 'cyberpunk', 'minimalist'];
      baseTheme = themes[Math.floor(Math.random() * themes.length)];
    }

    const cfg = { ...STYLE_FALLBACKS[baseTheme] };

    // Set custom accent colors if matching keywords are found
    const COLOR_MAP: Record<string, { primary: string; secondary: string }> = {
      purple: { primary: 'bc8cff', secondary: '8a2be2' },
      violet: { primary: 'bc8cff', secondary: '8a2be2' },
      orange: { primary: 'f0883e', secondary: 'd75a20' },
      blue: { primary: '58a6ff', secondary: '0d47a1' },
      sky: { primary: '4fc3f7', secondary: '0288d1' },
      green: { primary: '2ea44f', secondary: '238636' },
      emerald: { primary: '2ea44f', secondary: '10c778' },
      red: { primary: 'f85149', secondary: 'da3633' },
      rose: { primary: 'ff8da1', secondary: 'ffb6c1' },
      gold: { primary: 'd7aa3a', secondary: 'b8860b' },
      yellow: { primary: 'd7aa3a', secondary: 'f1e05a' },
      pink: { primary: 'ff8da1', secondary: 'ffb6c1' },
      sakura: { primary: 'ffb6c1', secondary: 'ffeef0' },
      black: { primary: '000000', secondary: '21262d' },
      dark: { primary: '161b22', secondary: '0d1117' },
      grey: { primary: '8b949e', secondary: '30363d' },
      gray: { primary: '8b949e', secondary: '30363d' },
    };

    let colorMatched = false;
    for (const [key, colors] of Object.entries(COLOR_MAP)) {
      if (lowercasePrompt.includes(key)) {
        cfg.badgeColor = colors.primary;
        cfg.accentBadgeColor = colors.secondary;
        colorMatched = true;
        break;
      }
    }

    if (lowercasePrompt.includes('black') || lowercasePrompt.includes('dark')) {
      cfg.bannerUrl = `https://img.shields.io/badge/DEVELOPER--RPG-DARK_MODE-black?style=for-the-badge&logo=github`;
      cfg.footerText = `🖤 Dark Mode // Cyber Grid Loaded.`;
      cfg.statsTheme = 'tokyonight';
    } else if (colorMatched) {
      cfg.bannerUrl = `https://img.shields.io/badge/DEVELOPER--RPG-CUSTOM_THEME-${cfg.badgeColor}?style=for-the-badge&logo=git`;
      cfg.footerText = `✨ Color Accent Locked: ${cfg.badgeColor}.`;
    }

    cfg.progressBarChar = randProgressBarChar;
    cfg.progressBarEmptyChar = randProgressBarChar === '█' || randProgressBarChar === '▓' ? '░' : '⚪';

    // Scan emojis
    if (lowercasePrompt.includes('cute') || lowercasePrompt.includes('sakura') || lowercasePrompt.includes('heart')) {
      cfg.emojiHeader = '🌸';
      cfg.emojiStat = '🍬';
      cfg.emojiSkill = '✨';
      cfg.emojiAchievement = '🦄';
      cfg.emojiQuest = '🎀';
    } else if (lowercasePrompt.includes('space') || lowercasePrompt.includes('star') || lowercasePrompt.includes('rocket')) {
      cfg.emojiHeader = '🚀';
      cfg.emojiStat = '🌀';
      cfg.emojiSkill = '🌟';
      cfg.emojiAchievement = '🛸';
      cfg.emojiQuest = '🪐';
    } else if (lowercasePrompt.includes('fire') || lowercasePrompt.includes('hot') || lowercasePrompt.includes('lava')) {
      cfg.emojiHeader = '🔥';
      cfg.emojiStat = '⚡';
      cfg.emojiSkill = '☄️';
      cfg.emojiAchievement = '🌋';
      cfg.emojiQuest = '🧨';
    }

    // Pick Theme Sticker GIF (Disabled per user request)
    const stickerPool = baseTheme === 'cute' 
      ? GIF_STICKERS.cute 
      : baseTheme === 'gaming' 
        ? GIF_STICKERS.gaming 
        : GIF_STICKERS.general;
    const randSticker = '';

    // ----------------------------------------------------
    // 1. OPENING SECTION BUILDER
    // ----------------------------------------------------
    const buildOpening = () => {
      const type = Math.floor(Math.random() * 4);
      let content = '';

      if (type === 0) {
        // Capsule Render Banner
        const capsuleType = ['waving', 'egg', 'soft', 'slice', 'rect', 'jelly', 'rounded'][Math.floor(Math.random() * 7)];
        const capsuleTheme = ['dark', 'light', 'transparent', 'silent', 'washed'][Math.floor(Math.random() * 5)];
        content = `<div align="center">\n  <img src="https://capsule-render.vercel.app/api?type=${capsuleType}&color=${cfg.badgeColor}&height=140&section=header&text=${encodeURIComponent(profile.name)}&fontSize=35&theme=${capsuleTheme}" alt="Capsule Banner" style="max-width: 100%; border-radius: 6px;" />\n</div>\n\n`;
      } else if (type === 1) {
        // ASCII Box Header
        content = `\`\`\`text\n+-------------------------------------------------------------+\n|  BATTLETAG: ${profile.battleTag.toUpperCase().padEnd(47)} |\n|  CLASS: ${profile.className.toUpperCase().padEnd(51)} |\n|  GUILD: ${profile.guild.toUpperCase().padEnd(51)} |\n|  RANK: ${profile.rank.toUpperCase().padEnd(52)} |\n+-------------------------------------------------------------+\n\`\`\`\n\n`;
      } else if (type === 2) {
        // Centered Emojis Header
        content = `<div align="center">\n  <h1>${cfg.emojiHeader} ${profile.name} // ${profile.rank}</h1>\n  <p><em>"${profile.guild} // Specialization: ${profile.specialization}"</em></p>\n</div>\n\n`;
      } else {
        // Simple Markdown header
        content = `# ${cfg.emojiHeader} ${profile.name}\n\n`;
      }

      // Add Typing SVG occasionally (50% chance)
      if (Math.random() > 0.5) {
        const svgLines = [
          `Class: ${profile.className}`,
          `Rank: ${profile.rank}`,
          `Guild: ${profile.guild}`
        ].map(l => encodeURIComponent(l)).join(';');
        content += `<div align="center">\n  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=${cfg.badgeColor}&width=435&lines=${svgLines}" alt="Typing SVG" />\n</div>\n\n`;
      }

      return content;
    };

    // ----------------------------------------------------
    // 2. ABOUT ME BUILDER
    // ----------------------------------------------------
    const buildAboutMe = () => {
      const type = Math.floor(Math.random() * 4);
      const toneType = Math.floor(Math.random() * 4); // playful, professional, cyberpunk, cute
      
      let prose = '';
      if (toneType === 0) {
        prose = `A wild \`${profile.className}\` appeared! Emerging from the deep coding dungeons of the \`${profile.guild}\` guild, I specialize in the arcane arts of \`${profile.specialization}\`. Armed with standard compilation scrolls and bug-slaying runes, my current tier is \`${profile.rank}\` with an overall power level of \`${profile.powerLevel}\`! Let's clear some quests together. ⚔️`;
      } else if (toneType === 1) {
        prose = `I am \`${profile.name}\`, a professional engineer specialized in \`${profile.specialization}\`. Affiliated with the \`${profile.guild}\` ecosystem, I work as a \`${profile.className}\`. Holding the active designation of \`${profile.rank}\`, my focus is on performance optimization, clean architectures, and high-completeness contribution systems.`;
      } else if (toneType === 2) {
        prose = `System Initialized. Interface name: \`${profile.name}\`. Guild Node: \`${profile.guild}\`. Operating Specialization: \`${profile.specialization}\`. Operating Class: \`${profile.className}\`. Status: Online. Security clearance level: \`${profile.rank}\`. Core potency factor: \`${profile.powerLevel}\`. Connection to grid is nominal.`;
      } else {
        prose = `Hi, I'm \`${profile.name}\`! 🌸 Soft developer and proud member of the lovely \`${profile.guild}\` guild! As a sweet \`${profile.className}\`, I spend my days building cozy wonders with \`${profile.specialization}\`! (* ^ ω ^) Level \`${profile.rank}\` with a magic power level of \`${profile.powerLevel}\`! ✨ Let's be friends!`;
      }

      if (type === 0) {
        // Code block object format
        const jsonAbout = {
          adventurer: profile.name,
          class: profile.className,
          specialization: profile.specialization,
          guild: profile.guild,
          rank: profile.rank,
          powerLevel: `${profile.powerLevel}/100`,
          status: "Cleared for active duty"
        };
        return `## 👤 Character Properties\n\`\`\`json\n${JSON.stringify(jsonAbout, null, 2)}\n\`\`\`\n\n`;
      } else if (type === 1) {
        // Bullet list attributes
        return `## 👤 Character Sheet\n- 🛡️ **BattleTag**: \`${profile.battleTag}\`\n- ⚔️ **Class Spec**: \`${profile.className} (${profile.specialization})\`\n- 🏰 **Guild / Faction**: \`${profile.guild}\`\n- 🎖️ **Combat Rank**: \`${profile.rank}\`\n- ⚡ **Power Factor**: \`${profile.powerLevel}/100\`\n\n`;
      } else if (type === 2) {
        // Prose paragraph
        return `## 📜 Lore & Origins\n${prose}\n\n`;
      } else {
        // Infographic Badges format
        const encodedClass = encodeURIComponent(profile.className);
        const encodedGuild = encodeURIComponent(profile.guild);
        const encodedPower = encodeURIComponent(`${profile.powerLevel}/100`);
        const badges = [
          `![Class](https://img.shields.io/badge/Class-${encodedClass}-${cfg.badgeColor}?style=${randBadgeStyle})`,
          `![Guild](https://img.shields.io/badge/Guild-${encodedGuild}-${cfg.accentBadgeColor}?style=${randBadgeStyle})`,
          `![Power](https://img.shields.io/badge/Power-${encodedPower}-red?style=${randBadgeStyle})`,
          `![Rank](https://img.shields.io/badge/Rank-${encodeURIComponent(profile.rank)}-blue?style=${randBadgeStyle})`
        ].join(' ');
        
        return `## 🛡️ Character Status\n${badges}\n\n${prose}\n\n`;
      }
    };

    // ----------------------------------------------------
    // 3. SOCIAL LINKS BUILDER
    // ----------------------------------------------------
    const buildSocialLinks = () => {
      const align = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
      
      const linkBlock = `🐙 **[GitHub](https://github.com/${profile.battleTag.split('#')[0].toLowerCase()})** &nbsp; // &nbsp; 💼 **[LinkedIn](https://linkedin.com)** &nbsp; // &nbsp; 🐦 **[Twitter](https://twitter.com)**`;

      if (align === 'center') {
        return `<div align="center">\n  ${linkBlock}\n</div>\n\n`;
      } else if (align === 'right') {
        return `<div align="right">\n  ${linkBlock}\n</div>\n\n`;
      } else {
        return `### 🌐 Comm Channels\n${linkBlock}\n\n`;
      }
    };

    // ----------------------------------------------------
    // 4. EXPERIENCE / WORK BUILDER
    // ----------------------------------------------------
    const buildExperience = () => {
      const type = Math.floor(Math.random() * 3);
      
      if (type === 0) {
        // Structured Quest Table
        const rows = profile.repositories.map((repo: any) => {
          let statusIcon = '🔓';
          if (repo.status === 'Active') statusIcon = '⚔️';
          else if (repo.status === 'Cleared') statusIcon = '⭐';
          return `| \`${repo.name}\` | **${repo.questType}** | \`${repo.difficulty}\` | ⭐ ${repo.stars} | ${statusIcon} **${repo.status}** |`;
        }).join('\n');

        return `## 🗺️ Quest Log (Repositories)\n| 🗺️ Quest Name | 💎 Quest Type | ⚔️ Difficulty | 🏆 Reward (Fame) | 🚦 Quest Status |\n| :--- | :--- | :--- | :--- | :--- |\n${rows}\n\n`;
      } else if (type === 1) {
        // Timeline List
        const timeline = profile.repositories.map((repo: any) => {
          const statusPrefix = repo.status === 'Cleared' ? '⭐ `[CLEARED]`' : repo.status === 'Active' ? '⚔️ `[ACTIVE]`' : '🔒 `[LOCKED]`';
          return `- ${statusPrefix} **${repo.name}**: An adventure in **${repo.questType}**. Complexity: \`${repo.difficulty}\` // Reward: \`${repo.stars} Fame\`.`;
        }).join('\n');
        return `## 📅 Quest Clearance Timeline\n${timeline}\n\n`;
      } else {
        // Project cards layout
        const cards = profile.repositories.map((repo: any) => {
          const icon = repo.status === 'Cleared' ? '🏆' : '⚔️';
          return `> ### ${icon} Quest: ${repo.name}\n> - **Quest Objective**: ${repo.questType}\n> - **Difficulty Rating**: \`${repo.difficulty}\`\n> - **Bounty**: \`${repo.stars} Fame\` // **Status**: \`${repo.status}\``;
        }).join('\n\n');
        return `## 🗃️ Active Bounties & Clearance Cards\n${cards}\n\n`;
      }
    };

    // ----------------------------------------------------
    // 5. SKILLS / TECH STACK BUILDER
    // ----------------------------------------------------
    const buildSkills = () => {
      const type = Math.floor(Math.random() * 3);
      
      // Shuffle categories/branches
      const uniqueBranches = Array.from(new Set(profile.skillTree.map((s: any) => s.branch)));
      uniqueBranches.sort(() => Math.random() - 0.5);

      if (type === 0) {
        // Shields.io badges grid categorized
        let content = `## 🔮 Spellbook & Skills\n`;
        uniqueBranches.forEach((branch) => {
          const skills = profile.skillTree.filter((s: any) => s.branch === branch);
          const skillBadges = skills.map((s: any) => {
            return `![${s.name}](https://img.shields.io/badge/${encodeURIComponent(s.name)}-${s.level}%25-${cfg.badgeColor}?style=${randBadgeStyle})`;
          }).join(' ');
          content += `### ✦ ${branch}\n${skillBadges}\n\n`;
        });
        return content;
      } else if (type === 1) {
        // Nested bullet list with progress bar symbols
        let content = `## 🔮 Spellbook & Skills\n`;
        uniqueBranches.forEach((branch) => {
          content += `### ✦ ${branch}\n`;
          const skills = profile.skillTree.filter((s: any) => s.branch === branch);
          skills.forEach((s: any) => {
            const bar = generateProgressBar(s.level, cfg.progressBarChar, cfg.progressBarEmptyChar);
            content += `- **${s.name}** \n  \`${bar}\` **${s.level}%**\n`;
          });
          content += `\n`;
        });
        return content;
      } else {
        // Structured table format
        let rows = '';
        profile.skillTree.forEach((s: any) => {
          const bar = generateProgressBar(s.level, cfg.progressBarChar, cfg.progressBarEmptyChar);
          rows += `| \`${s.name}\` | **${s.branch}** | \`${bar}\` | \`${s.level}%\` |\n`;
        });
        return `## 🔮 Mastery Matrix (Skills)\n| ✨ Skill Name | 🏷️ Skill Category | 📊 Proficiency Tracker | 🎓 Mastery |\n| :--- | :--- | :--- | :--- |\n${rows}\n\n`;
      }
    };

    // ----------------------------------------------------
    // 6. STATS & VISUALS BUILDER
    // ----------------------------------------------------
    const buildStats = () => {
      const username = profile.battleTag.split('#')[0].toLowerCase();
      
      const statsCard = `![Stats Card](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=false&theme=${cfg.statsTheme})`;
      const snakeGame = ``;
      const imageSticker = ``;

      const options = [
        // Option A: Center aligned blocks
        `<div align="center">\n  ${statsCard}\n  <br /><br />\n  ${imageSticker}\n</div>\n\n`,
        // Option B: Table containing visual side-by-side stats
        `### 📊 Battle Records & Statistics\n| 🛡️ Combat Analytics | 🕹️ Activity Sticker |\n| :---: | :---: |\n| ${statsCard} | ${imageSticker || '`Offline Node`'} |\n\n`,
        // Option C: Snake chart + stats card stack
        `### 📊 Contribution Matrix\n${statsCard}\n\n${snakeGame.includes('raw.githubusercontent') ? `#### 🐍 Commits Grid Slither\n${snakeGame}\n\n` : ''}`
      ];

      return options[Math.floor(Math.random() * options.length)];
    };

    // ----------------------------------------------------
    // 7. ENDING SECTION BUILDER
    // ----------------------------------------------------
    const buildEnding = () => {
      const quote = RPG_QUOTES[Math.floor(Math.random() * RPG_QUOTES.length)];
      const type = Math.floor(Math.random() * 3);

      let text = '';
      if (type === 0) {
        text = `> ${quote}\n\n<div align="center"><sub>${cfg.footerText}</sub></div>\n`;
      } else if (type === 1) {
        text = `### 🤝 Join the Party\n- ⚔️ **Looking for a party member?** Let's collaborate on epic repos!\n- ✉️ Reach out on socials or open a Quest Issue in my repositories.\n\n<div align="center"><sub>${cfg.footerText}</sub></div>\n`;
      } else {
        text = `### 🏆 Milestones Unlocked\n${profile.achievements.slice(0, 2).map((a: any) => `- **${a.title}** (${a.tier}): _${a.detail}_`).join('\n')}\n\n<div align="center"><sub>${cfg.footerText}</sub></div>\n`;
      }

      return text;
    };

    // ----------------------------------------------------
    // SHUFFLE & ASSEMBLE PIPELINE
    // ----------------------------------------------------
    const segments: { id: string; content: string }[] = [
      { id: 'about', content: buildAboutMe() },
      { id: 'skills', content: buildSkills() },
      { id: 'experience', content: buildExperience() },
      { id: 'stats', content: buildStats() }
    ];

    // Shuffle core segments
    segments.sort(() => Math.random() - 0.5);

    const socials = buildSocialLinks();
    const socialsTop = Math.random() > 0.5;

    let finalMarkdown = '';
    
    // Add Opening Banner
    finalMarkdown += buildOpening();
    
    // Add Socials if chosen at the top
    if (socialsTop) {
      finalMarkdown += socials;
    }

    // Add core segments in their randomized order
    segments.forEach((seg) => {
      finalMarkdown += seg.content;
    });

    // Add Socials if chosen at the bottom
    if (!socialsTop) {
      finalMarkdown += socials;
    }

    // Add Diagnostic Report
    const strengthsItems = profile.analysis.strengths.map((s: string) => `- ${s}`).join('\n');
    const weaknessesItems = profile.analysis.weaknesses.map((w: string) => `- ${w}`).join('\n');
    const missingSkillsItems = profile.analysis.missingSkills.map((m: string) => `- ${m}`).join('\n');

    finalMarkdown += `## 📊 Diagnosis & Performance Report\n`;
    finalMarkdown += `### 💪 Current Attuned Strengths\n${strengthsItems}\n\n`;
    finalMarkdown += `### ⚠️ Warning Gaps & Weaknesses\n${weaknessesItems}\n\n`;
    finalMarkdown += `### 🔮 Locked Arcana (Skills to attune)\n${missingSkillsItems}\n\n`;
    finalMarkdown += `> **Recommended Next Quest**: _${profile.analysis.nextQuest}_\n\n---\n\n`;

    // Add Ending Quote / CTA
    finalMarkdown += buildEnding();

    res.setHeader('Content-Type', 'text/markdown');
    res.status(200).send(finalMarkdown);
  } catch (error: any) {
    console.error('Error generating README:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
  }
}
