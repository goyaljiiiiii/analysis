/* eslint-disable */
import * as pdfParseModule from 'pdf-parse';

const pdfParse = (pdfParseModule as any).default ?? (pdfParseModule as any);



import mammoth from 'mammoth';
import type { SkillNode, Achievement } from '../src/types/profile';

function coercePdfBuffer(raw: any): any {
  const B: any = (globalThis as any).Buffer;
  if (!B) return raw;
  if (B.isBuffer(raw)) return raw;
  if (raw instanceof ArrayBuffer) return B.from(new Uint8Array(raw));
  if (ArrayBuffer.isView(raw)) return B.from(raw.buffer);
  if (raw && typeof raw === 'object' && 'data' in raw && B.isBuffer((raw as any).data)) return (raw as any).data;
  return B.from(raw ?? []);
}




// We disable Vite/Vercel default JSON/form body parsing for this endpoint so we receive the raw binary file buffer
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to accumulate the raw body chunks into a single Buffer
async function getRawBody(req: any): Promise<any> {
  const B: any = (globalThis as any).Buffer;
  const chunks: any[] = [];
  for await (const chunk of req) {
    if (typeof chunk === 'string' && B?.from) chunks.push(B.from(chunk));
    else chunks.push(chunk);
  }
  if (B?.concat) return B.concat(chunks);
  // Fallback for environments without Buffer typing/runtime
  return chunks;
}

// Dictionary of skills and their corresponding branch names
const SKILL_KEYWORDS: Record<string, { branch: string; officialName: string }> = {
  react: { branch: 'Core Magic', officialName: 'React Mastery' },
  vue: { branch: 'Core Magic', officialName: 'Vue Mastery' },
  angular: { branch: 'Core Magic', officialName: 'Angular Mastery' },
  svelte: { branch: 'Core Magic', officialName: 'Svelte Mastery' },
  nextjs: { branch: 'Core Magic', officialName: 'Next.js Arch' },
  typescript: { branch: 'Rune Control', officialName: 'TypeScript Precision' },
  javascript: { branch: 'Core Magic', officialName: 'JavaScript Mastery' },
  python: { branch: 'Rune Control', officialName: 'Python Analytics' },
  java: { branch: 'Defense', officialName: 'Java Systems' },
  go: { branch: 'Deep Systems', officialName: 'Go Engineering' },
  golang: { branch: 'Deep Systems', officialName: 'Go Engineering' },
  rust: { branch: 'Deep Systems', officialName: 'Rust Precision' },
  cplusplus: { branch: 'Deep Systems', officialName: 'C++ Systems' },
  'c++': { branch: 'Deep Systems', officialName: 'C++ Systems' },
  aws: { branch: 'Machinery', officialName: 'AWS Cloud Magic' },
  docker: { branch: 'Machinery', officialName: 'Docker Conjuring' },
  kubernetes: { branch: 'Machinery', officialName: 'Kubernetes Command' },
  k8s: { branch: 'Machinery', officialName: 'Kubernetes Command' },
  postgres: { branch: 'Deep Systems', officialName: 'Database Tuning' },
  postgresql: { branch: 'Deep Systems', officialName: 'Database Tuning' },
  mongodb: { branch: 'Deep Systems', officialName: 'NoSQL Summoning' },
  mysql: { branch: 'Deep Systems', officialName: 'SQL Mastery' },
  redis: { branch: 'Deep Systems', officialName: 'Caching Matrix' },
  git: { branch: 'Rune Control', officialName: 'Git Control' },
  github: { branch: 'Rune Control', officialName: 'Git Control' },
  testing: { branch: 'Defense', officialName: 'Testing Discipline' },
  jest: { branch: 'Defense', officialName: 'Testing Discipline' },
  cypress: { branch: 'Defense', officialName: 'Testing Discipline' },
  cicd: { branch: 'Machinery', officialName: 'CI/CD Automation' },
  jenkins: { branch: 'Machinery', officialName: 'CI/CD Automation' },
  graphql: { branch: 'Core Magic', officialName: 'GraphQL Rituals' },
  node: { branch: 'Deep Systems', officialName: 'Node.js Backend' },
  nodejs: { branch: 'Deep Systems', officialName: 'Node.js Backend' },
  express: { branch: 'Deep Systems', officialName: 'Node.js Backend' },
  django: { branch: 'Deep Systems', officialName: 'Django Arch' },
  flask: { branch: 'Deep Systems', officialName: 'Flask Spells' },
  spring: { branch: 'Defense', officialName: 'Spring Framework' },
  tailwind: { branch: 'Visual Arts', officialName: 'UI Crafting' },
  css: { branch: 'Visual Arts', officialName: 'UI Crafting' },
  html: { branch: 'Visual Arts', officialName: 'UI Crafting' },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const filename = req.query.name || '';
    const contentType = req.headers['content-type'] || '';

    // In local dev (Vite), the apiPlugin injects POST raw body into req.body.
    // In other runtimes, we stream the raw body from the request.
    const injectedBody = (req as any).body;
    const buffer = injectedBody ? injectedBody : await getRawBody(req);
    const pdfBuffer = coercePdfBuffer(buffer);

    const bufferLength = typeof pdfBuffer?.length === 'number' ? pdfBuffer.length : (buffer?.length ?? 0);

    if (bufferLength === 0) {
      throw new Error('Empty file uploaded.');
    }

    let text = '';

    // Check file type and parse
    if (filename.endsWith('.pdf') || contentType.includes('pdf')) {
      const parsedData = await pdfParse(pdfBuffer);
      text = parsedData.text || '';
    } else if (filename.endsWith('.docx') || contentType.includes('word') || contentType.includes('octet-stream')) {
      // Mammoth extracts raw text from docx
      const result = await mammoth.extractRawText({ buffer: pdfBuffer });
      text = result.value || '';
    } else {
      // Fallback: try parsing as text
      text = pdfBuffer.toString('utf-8');
    }


    if (!text.trim()) {
      throw new Error('Unable to extract readable text from the uploaded file.');
    }

    // Parse skills
    const lowercaseText = text.toLowerCase();
    const skillsMap = new Map<string, SkillNode>();

    Object.entries(SKILL_KEYWORDS).forEach(([keyword, config]) => {
      // Find keyword matches
      const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      
      if (regex.test(lowercaseText)) {
        // Find match count for level scaling
        const matches = lowercaseText.match(new RegExp(`\\b${escapedKeyword}\\b`, 'gi'));
        const count = matches ? matches.length : 1;
        // Scale level between 45 and 95 based on counts
        const level = Math.min(95, 45 + count * 8);

        skillsMap.set(config.officialName, {
          name: config.officialName,
          level,
          branch: config.branch,
        });
      }
    });

    const parsedSkills = Array.from(skillsMap.values());

    // Guess years of experience
    let yearsOfExperience = 1;
    const expRegexes = [
      /(\d+)\+?\s*years?\s+of\s+experience/i,
      /(\d+)\+?\s*years?\s+experience/i,
      /(\d+)\+?\s*yrs?\s+exp/i,
    ];

    for (const regex of expRegexes) {
      const match = lowercaseText.match(regex);
      if (match && match[1]) {
        yearsOfExperience = Math.max(yearsOfExperience, parseInt(match[1], 10));
      }
    }

    // If years aren't directly stated, try counting job entries or years in resume
    if (yearsOfExperience === 1) {
      const yearMatches = lowercaseText.match(/\b(201\d|202\d)\b/g);
      if (yearMatches && yearMatches.length > 1) {
        const uniqueYears = Array.from(new Set(yearMatches)).map(Number);
        const minYear = Math.min(...uniqueYears);
        const maxYear = Math.max(...uniqueYears);
        const diff = maxYear - minYear;
        if (diff > 0 && diff < 15) {
          yearsOfExperience = diff;
        }
      }
    }

    // Look for education
    let education = 'Self-taught Adventurer';
    const eduKeywords = [
      { key: 'bachelor', label: "Bachelor's Degree" },
      { key: 'master', label: "Master's Degree" },
      { key: 'phd', label: 'PhD' },
      { key: 'ph.d.', label: 'PhD' },
      { key: 'degree', label: 'College Degree' },
      { key: 'university', label: 'University Graduate' },
      { key: 'college', label: 'College Graduate' },
      { key: 'computer science', label: 'CS Graduate' },
    ];

    for (const item of eduKeywords) {
      if (lowercaseText.includes(item.key)) {
        education = item.label;
        break;
      }
    }

    // Determine Suggested Class based on top skills
    let suggestedClass = 'Fullstack Paladin';
    const branches = parsedSkills.reduce((acc: Record<string, number>, s) => {
      acc[s.branch] = (acc[s.branch] || 0) + 1;
      return acc;
    }, {});

    const topBranch = Object.entries(branches).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (topBranch === 'Core Magic' || topBranch === 'Visual Arts') {
      suggestedClass = 'Frontend Mage';
    } else if (topBranch === 'Machinery') {
      suggestedClass = 'Infrastructure Golem';
    } else if (topBranch === 'Deep Systems') {
      suggestedClass = 'Backend Knight';
    } else if (topBranch === 'Rune Control') {
      suggestedClass = 'Systems Druid';
    }

    // achievements unlocked
    const newAchievements: Achievement[] = [
      { title: 'Resume Parsed', tier: 'Bronze', detail: 'Uploaded and deciphered an adventurer resume.' },
    ];

    if (yearsOfExperience >= 5) {
      newAchievements.push({ title: 'Battle Hardened', tier: 'Gold', detail: `${yearsOfExperience} years of industry dungeon raids.` });
    } else if (yearsOfExperience >= 2) {
      newAchievements.push({ title: 'Seasoned Mercenary', tier: 'Silver', detail: `${yearsOfExperience} years of experience verified.` });
    }

    if (education !== 'Self-taught Adventurer') {
      newAchievements.push({ title: 'Scholar Archetype', tier: 'Emerald', detail: `Graduated as a verified ${education}.` });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      skills: parsedSkills,
      experience: yearsOfExperience,
      education,
      suggestedClass,
      achievements: newAchievements,
    });
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Error parsing resume file.' }));
  }
}
