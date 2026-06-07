/* eslint-disable */
import { useState, useEffect } from 'react';
import { SideNav } from './components/SideNav';
import { ProfilePanel } from './components/ProfilePanel';
import { StatPanel } from './components/StatPanel';
import { AchievementVault } from './components/AchievementVault';
import { QuestBoard } from './components/QuestBoard';
import { SkillTree } from './components/SkillTree';
import { AnalysisReport } from './components/AnalysisReport';
import { ReadmePanel } from './components/ReadmePanel';
import { RepoAnalyzerPanel } from './components/RepoAnalyzerPanel';
import { characterProfile } from './data/character';
import type { DeveloperProfile } from './types/profile';

type ChecklistItem = {
  id: string;
  name: string;
  checked: boolean;
  weight: number;
  tip: string;
};

type RatingBreakdown = {
  completeness: number;
  consistency: number;
  impact: number;
  powerLevel: number;
  rank: string;
  checklist: ChecklistItem[];
  tips: string[];
};

function App() {
  const [profile, setProfile] = useState<DeveloperProfile>(characterProfile);
  const [activeTheme, setActiveTheme] = useState<string>('github-dark');
  const [activeTab, setActiveTab] = useState<'overview' | 'ratings' | 'readme' | 'repo-analyzer'>('overview');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [rating, setRating] = useState<RatingBreakdown | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);


  // Sync active theme class to HTML body element
  useEffect(() => {
    document.body.className = `theme-${activeTheme}`;
  }, [activeTheme]);

  // Update rating metrics whenever the profile changes
  useEffect(() => {
    calculateProfileRating();
  }, [profile]);

  const calculateProfileRating = async () => {
    try {
      const response = await fetch('/api/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        const ratingData: RatingBreakdown = await response.json();
        setRating(ratingData);
        if (ratingData.checklist) {
          setChecklist(ratingData.checklist);
        }
        
        // Sync rank and power level back to the profile display
        if (ratingData.powerLevel !== profile.powerLevel || ratingData.rank !== profile.rank) {
          setProfile((prev) => ({
            ...prev,
            powerLevel: ratingData.powerLevel,
            rank: ratingData.rank,
            title: `Developer Tier: ${ratingData.rank}`,
            analysis: {
              ...prev.analysis,
              powerLevel: `${ratingData.powerLevel}/100`,
            },
          }));
        }
      }
    } catch (e) {
      console.error('Failed to calculate profile ratings:', e);
    }
  };

  const handleToggleCheck = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, checked: !item.checked };
        }
        return item;
      });

      // Recalculate completeness
      const newCompleteness = updated.reduce((acc, item) => acc + (item.checked ? item.weight : 0), 0);

      // Recalculate power level and rank based on new completeness
      const newPowerLevel = Math.max(10, Math.min(100, Math.floor(newCompleteness * 0.3 + (rating?.consistency || 0) * 0.4 + (rating?.impact || 0) * 0.3)));
      let newRank = 'Bronze IV';
      if (newPowerLevel > 85) newRank = 'Challenger I';
      else if (newPowerLevel > 70) newRank = 'Diamond IV';
      else if (newPowerLevel > 55) newRank = 'Gold III';
      else if (newPowerLevel > 35) newRank = 'Silver II';

      // Update rating breakdown state
      setRating((prevRating) => {
        if (!prevRating) return null;
        return {
          ...prevRating,
          completeness: newCompleteness,
          powerLevel: newPowerLevel,
          rank: newRank,
        };
      });

      // Also sync back to profile for rendering avatar/rank on sidebar
      setProfile((prevProf) => ({
        ...prevProf,
        powerLevel: newPowerLevel,
        rank: newRank,
        title: `Developer Tier: ${newRank}`,
        analysis: {
          ...prevProf.analysis,
          powerLevel: `${newPowerLevel}/100`,
        }
      }));

      return updated;
    });
  };

  const handleGenerateProfile = async () => {
    if (!usernameInput.trim()) {
      setErrorMessage('Please enter a GitHub username.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Fetch GitHub profile
      let currentProfile: DeveloperProfile = JSON.parse(JSON.stringify(characterProfile)) as DeveloperProfile;
      const response = await fetch(
        `/api/github?username=${encodeURIComponent(usernameInput.trim())}`,
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch GitHub profile details.');
      }
      currentProfile = await response.json();

      setProfile(currentProfile);
      setIsLoaded(true);
      setSuccessMessage(`Generated RPG profile for ${currentProfile.name}!`);

      // README tab is more likely desired right after generation
      setActiveTab('readme');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error compiling profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(characterProfile);
    setIsLoaded(false);
    setUsernameInput('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSandboxDemo = () => {
    setProfile(characterProfile);
    setIsLoaded(true);
    setSuccessMessage('Loaded sandbox demo profile.');
  };


  return (
    <div className="github-layout-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. GATED Streamlined Login Screen */}
      {!isLoaded ? (
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '24px' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '32px', border: '1px solid var(--line-strong)', borderRadius: '6px', backgroundColor: 'var(--bg-panel)', boxShadow: 'var(--shadow-neon)' }}>
            
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>⚔️</div>
              <h1 style={{ fontSize: '1.62rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                Developer RPG Profile Generator
              </h1>
              <p className="subtle" style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>
                Transform your GitHub activity into an RPG character dashboard and download a custom profile README.md.
              </p>
            </div>

            {errorMessage && (
              <div className="card" style={{ borderColor: 'var(--git-red)', background: 'rgba(248, 81, 73, 0.1)', color: 'var(--git-red)', padding: '12px', marginBottom: '16px', fontSize: '0.82rem', fontWeight: 600 }}>
                ⚠️ ERROR: {errorMessage}
              </div>
            )}

            {loading && (
              <div className="card loading-overlay" style={{ marginBottom: '16px' }}>
                <div className="spinner"></div>
                <span style={{ fontSize: '0.85rem' }}>Deciphering developer profiles...</span>
              </div>
            )}

            <div className="auth-stack" style={{ width: '100%' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>GitHub Username</label>
                <input
                  type="text"
                  placeholder="Enter username (e.g. torvalds)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  style={{ height: '38px', padding: '0 12px' }}
                  aria-label="GitHub Username"
                />
              </div>


              <button
                className="primary-assemble"
                onClick={handleGenerateProfile}
                type="button"
                style={{ height: '40px', marginTop: '20px' }}
              >
                Generate RPG Profile
              </button>

              <div className="divider-row" aria-hidden="true" style={{ margin: '14px 0' }}>
                <span></span>
                <strong>OR</strong>
                <span></span>
              </div>

              <button
                onClick={handleSandboxDemo}
                className="theme-btn"
                style={{ width: '100%', height: '38px', background: 'transparent' }}
                type="button"
              >
                🚀 Browse Sandbox with Demo Profile
              </button>

            </div>
          </div>
        </main>
      ) : (
        
        /* 2. UNLOCKED 3-TAB DASHBOARD PAGE */
        <>
          {/* Header Nav */}
          <SideNav battleTag={profile.battleTag} onReset={handleReset} />

          {/* Subheader Navigation Tab Buttons */}
          <div className="github-tabs-bar">
            <div className="github-tabs-container">
              <button
                className={`github-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                type="button"
              >
                <span>👤</span> Character Sheet
              </button>
              <button
                className={`github-tab ${activeTab === 'ratings' ? 'active' : ''}`}
                onClick={() => setActiveTab('ratings')}
                type="button"
              >
                <span>📊</span> Profile Ratings
              </button>
              <button
                className={`github-tab ${activeTab === 'readme' ? 'active' : ''}`}
                onClick={() => setActiveTab('readme')}
                type="button"
              >
                <span>📝</span> README Generator
              </button>
              <button
                className={`github-tab ${activeTab === 'repo-analyzer' ? 'active' : ''}`}
                onClick={() => setActiveTab('repo-analyzer')}
                type="button"
              >
                <span>🔍</span> Repo Analyzer
              </button>
            </div>
          </div>

          <div className="github-profile-layout">
            
            {/* Left Side: Summary Sidebar */}
            <aside className="github-sidebar">
              {/* Profile Card */}
              <ProfilePanel profile={profile} />

              {/* Theme Customizer widget */}
              <section className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 10px 0' }}>🎨 Switch Profile Theme</h3>
                <div className="theme-pill-grid">
                  {[
                    { id: 'github-dark', name: 'Dark 🖤' },
                    { id: 'github-light', name: 'Light 🤍' },
                    { id: 'github-dim', name: 'Dim 🐨' },
                    { id: 'github-cyberpunk', name: 'Cyberpunk ⚡' },
                    { id: 'github-sakura', name: 'Sakura 🌸' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`theme-btn ${activeTheme === theme.id ? 'active' : ''}`}
                      onClick={() => setActiveTheme(theme.id)}
                      type="button"
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </section>

              </aside>

            {/* Right Side: Tabbed Content Panel */}
            <section className="github-content">
              {successMessage && (
                <div className="card" style={{ borderColor: 'var(--git-green)', background: 'rgba(46, 164, 79, 0.1)', color: 'var(--git-green)', fontWeight: 600, fontSize: '0.82rem', padding: '12px' }}>
                  🏆 SUCCESS: {successMessage}
                </div>
              )}

              {loading && (
                <section className="card loading-overlay" style={{ padding: '16px' }}>
                  <div className="spinner"></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Syncing sandbox profile details...</span>
                </section>
              )}

              {/* TAB 1: CHARACTER SHEET OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="dashboard-bento" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Top Level: Combat Stats Full Width */}
                  <div className="bento-header">
                    <StatPanel stats={profile.stats} />
                  </div>

                  {/* Two Column Layout for the rest */}
                  <div className="bento-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
                    
                    {/* Left Column (Main Content) - roughly 65% width */}
                    <div className="bento-main" style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '320px' }}>
                      <section className="card contrib-calendar" style={{ padding: '24px', margin: 0, boxShadow: 'var(--shadow-neon)' }}>
                        <div className="section-head">
                          <h3>Activity Grid</h3>
                        </div>
                        <div className="contrib-grid-wrapper">
                          <div className="contrib-grid" aria-label="Contribution activity grid">
                            {Array.from({ length: 70 }).map((_, idx) => {
                              const commitsFactor = Math.min(1, (Number(profile.stats.find((s) => s.label === 'Commits')?.value ?? 0) || 0) / 200);
                              const prsFactor = Math.min(1, (Number(profile.stats.find((s) => s.label === 'Merged PRs')?.value ?? 0) || 0) / 50);
                              const streakStr = (profile.stats.find((s) => s.label === 'Contrib Streak')?.value ?? '1').toString();
                              const streakNumMatch = streakStr.match(/\d+/);
                              const streakNum = streakNumMatch ? parseInt(streakNumMatch[0], 10) : 0;
                              const streakFactor = Math.min(1, streakNum / 30);

                              const raw = commitsFactor * 0.55 + prsFactor * 0.25 + streakFactor * 0.20;
                              const density = 0.18 + raw * 0.65; 

                              const t = (idx * 9301 + 49297) % 233280; 
                              const r = t / 233280;

                              let level = '';
                              if (r < density * 0.10) level = 'level-4';
                              else if (r < density * 0.28) level = 'level-3';
                              else if (r < density * 0.48) level = 'level-2';
                              else if (r < density * 0.70) level = 'level-1';

                              return <div key={idx} className={`contrib-box ${level}`} title="Activity cell"></div>;
                            })}
                          </div>
                        </div>
                      </section>

                      <QuestBoard repositories={profile.repositories} />
                      
                      <AnalysisReport report={profile.analysis} />
                    </div>

                    {/* Right Column (Sidebar Content) - roughly 35% width */}
                    <div className="bento-side" style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
                      <section className="card" style={{ padding: '24px', margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--shadow-neon)' }}>
                        <div className="section-head" style={{ marginBottom: '4px' }}>
                          <h3>Language Mastery &amp; Skills</h3>
                        </div>
                        <div className="lang-distribution-bar" style={{ margin: 0, height: '12px', borderRadius: '6px' }}>
                          {profile.skillTree.filter(s => s.branch === 'Core Magic' || s.branch === 'Deep Systems').map((skill, idx) => {
                            const colors = ['#f1e05a', '#3572A5', '#00ADD8', '#bc8cff', '#58a6ff'];
                            return (
                              <div
                                key={skill.name}
                                className="lang-distribution-segment"
                                style={{
                                  width: `${100 / Math.max(1, profile.skillTree.filter(s => s.branch === 'Core Magic' || s.branch === 'Deep Systems').length)}%`,
                                  backgroundColor: colors[idx % colors.length]
                                }}
                                title={`${skill.name}: ${skill.level}%`}
                              ></div>
                            );
                          })}
                        </div>
                        <SkillTree skills={profile.skillTree.slice(0, 5)} />
                      </section>

                      <AchievementVault achievements={profile.achievements.slice(0, 5)} />
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE RATINGS */}
              {activeTab === 'ratings' && rating && (
                <section className="card" id="rating-breakdown" style={{ padding: '24px' }}>
                  <div className="section-head">
                    <h3>Profile Integrity Ratings &amp; Checklist</h3>
                    <p className="subtle">Quantitative scores evaluating completeness, activity volumes, and repository social impact. Complete checklist items to hit 100%!</p>
                  </div>
                  <div className="rating-breakdown-card">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
                      {/* Left: Progression Scores & Tips */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="rating-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
                          <div className="rating-bar-container">
                            <div className="rating-bar-label">
                              <span>Profile Completeness</span>
                              <strong>{rating.completeness}%</strong>
                            </div>
                            <div className="rating-bar-track">
                              <div className="rating-bar-fill" style={{ width: `${rating.completeness}%` }}></div>
                            </div>
                          </div>

                          <div className="rating-bar-container">
                            <div className="rating-bar-label">
                              <span>Contribution Consistency</span>
                              <strong>{rating.consistency}%</strong>
                            </div>
                            <div className="rating-bar-track">
                              <div className="rating-bar-fill" style={{ width: `${rating.consistency}%` }}></div>
                            </div>
                          </div>

                          <div className="rating-bar-container">
                            <div className="rating-bar-label">
                              <span>Social Impact</span>
                              <strong>{rating.impact}%</strong>
                            </div>
                            <div className="rating-bar-track">
                              <div className="rating-bar-fill" style={{ width: `${rating.impact}%` }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="tips-box" style={{ marginTop: '10px' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>💡</span> Progression Recommendations
                          </h4>
                          <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {rating.tips.map((tip, idx) => (
                              <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Integrity Checklist */}
                      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--line-strong)', borderRadius: '6px' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>🛡️ Integrity Checklist</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--git-green)', fontWeight: 600 }}>
                            {rating.completeness === 100 ? '🎉 100% Complete!' : `${rating.completeness}% Cleared`}
                          </span>
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {checklist.map((item) => (
                            <label
                              key={item.id}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '12px',
                                border: '1px solid var(--line-strong)',
                                borderRadius: '6px',
                                backgroundColor: item.checked ? 'rgba(46, 164, 79, 0.04)' : 'var(--bg-panel)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderLeft: item.checked ? '3px solid var(--git-green)' : '3px solid var(--line-soft)'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleToggleCheck(item.id)}
                                style={{
                                  marginTop: '3px',
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer',
                                  accentColor: 'var(--git-green)'
                                }}
                                aria-label={item.name}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ 
                                  fontSize: '0.85rem', 
                                  fontWeight: 600, 
                                  color: item.checked ? 'var(--git-green)' : 'var(--text-main)',
                                  textDecoration: item.checked ? 'line-through' : 'none',
                                  opacity: item.checked ? 0.75 : 1
                                }}>
                                  {item.name} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(+{item.weight}%)</span>
                                </span>
                                {!item.checked && (
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                                    {item.tip}
                                  </span>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 3: README GENERATOR */}
              {activeTab === 'readme' && (
                <ReadmePanel
                  profile={profile}
                />
              )}

              {/* TAB 4: REPO ANALYZER */}
              {activeTab === 'repo-analyzer' && (
                <RepoAnalyzerPanel />
              )}

            </section>
          </div>
        </>
      )}

    </div>
  );
}

export default App;
