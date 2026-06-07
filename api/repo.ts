import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  // Parse owner and repo from URL
  let owner = '';
  let repo = '';
  try {
    // Handle both full URLs and owner/repo formats
    let parsedUrl = url.trim();
    if (!parsedUrl.startsWith('http')) {
      parsedUrl = `https://github.com/${parsedUrl}`;
    }
    const urlObj = new URL(parsedUrl);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      throw new Error('Invalid repository URL format');
    }
    owner = parts[0];
    repo = parts[1];
  } catch (e) {
    return res.status(400).json({ error: 'Invalid repository URL format. Please use owner/repo or full GitHub URL.' });
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'developer-rpg-profile-generator',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch Basic Repo Info
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return res.status(404).json({ error: 'Repository not found or is private' });
      }
      throw new Error(`GitHub API Error: ${repoRes.statusText}`);
    }
    const repoData = await repoRes.json();

    // 2. Fetch Directory Structure (Top Level)
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const contentsRes = await fetch(treeUrl, { headers });
    let contents = [];
    if (contentsRes.ok) {
      contents = await contentsRes.json();
    }

    // 3. Check Live Status (Homepage)
    let isLive = false;
    let liveUrl = repoData.homepage;
    if (liveUrl) {
      if (!liveUrl.startsWith('http')) {
         liveUrl = `https://${liveUrl}`;
      }
      try {
        const liveRes = await fetch(liveUrl, { method: 'HEAD' });
        isLive = liveRes.ok;
      } catch (e) {
        // Fetch failed, maybe CORS or DNS, but we can just say false or unknown
        isLive = false;
      }
    }

    // 4. Fetch Community Profile for Security/License/Readme info
    const communityRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/community/profile`, { 
      headers: {
         ...headers,
         Accept: 'application/vnd.github.black-panther-preview+json' // needed for community profile
      }
    });
    
    let communityData = null;
    if (communityRes.ok) {
      communityData = await communityRes.json();
    }

    // 5. Fetch Languages
    const langRes = await fetch(repoData.languages_url, { headers });
    let languages = {};
    if (langRes.ok) {
      languages = await langRes.json();
    }

    // 6. Security Advisories (If Public, checking security policy is best we can do without admin)
    const hasSecurityPolicy = communityData?.files?.code_of_conduct ? true : false; // Github community profile returns security policy too if it exists

    // Assemble payload
    const result = {
      name: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      issues: repoData.open_issues_count,
      language: repoData.language,
      isLive,
      liveUrl: repoData.homepage || null,
      topics: repoData.topics || [],
      license: repoData.license?.name || 'None',
      hasReadme: communityData?.files?.readme !== null,
      hasSecurityPolicy: communityData?.files?.issue_template ? true : false, // Simplification due to API limitations
      healthPercentage: communityData?.health_percentage || 0,
      structure: Array.isArray(contents) ? contents.map((c: any) => ({
        name: c.name,
        type: c.type, // 'file' or 'dir'
        size: c.size,
      })) : [],
      languages,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in repo analyzer API:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
