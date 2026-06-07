import { useState } from 'react';

export function RepoAnalyzerPanel() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const res = await fetch('/api/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (index: number) => {
    const colors = ['#f1e05a', '#3572A5', '#00ADD8', '#bc8cff', '#58a6ff', '#e34c26', '#563d7c'];
    return colors[index % colors.length];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-neon)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            Repository Analyzer
          </h2>
          <p className="subtle">Validate repository health, structure, and live deployment status.</p>
        </div>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
          <input
            type="text"
            className="input-github"
            placeholder="e.g. facebook/react or https://github.com/..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '6px' }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Scanning...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '16px', color: 'var(--git-red)', background: 'rgba(248,81,73,0.1)', padding: '12px', borderRadius: '6px', textAlign: 'center', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
      </section>

      {analysis && (
        <div className="dashboard-bento" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Stats */}
          <div className="stat-grid-github" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="stat-tile-github">
              <p>Repository</p>
              <strong style={{ fontSize: '1.2rem' }}>{analysis.name}</strong>
            </div>
            <div className="stat-tile-github">
              <p>Stars</p>
              <strong>⭐ {analysis.stars.toLocaleString()}</strong>
            </div>
            <div className="stat-tile-github">
              <p>Forks & Issues</p>
              <strong>🍴 {analysis.forks} / 🐞 {analysis.issues}</strong>
            </div>
            <div className="stat-tile-github">
              <p>Primary Language</p>
              <strong>{analysis.language || 'Mixed'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
            
            {/* Left Column */}
            <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '320px' }}>
              <section className="card" style={{ padding: '24px', margin: 0, boxShadow: 'var(--shadow-neon)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Description</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                  {analysis.description || 'No description provided.'}
                </p>
                {analysis.topics.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                    {analysis.topics.map((topic: string) => (
                      <span key={topic} style={{ background: 'var(--line-soft)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--git-blue)' }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section className="card" style={{ padding: '24px', margin: 0, boxShadow: 'var(--shadow-neon)', borderLeft: '4px solid var(--git-blue)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>💡 Actionable Advice</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0, padding: 0, listStyle: 'none' }}>
                  {!analysis.hasReadme && (
                    <li>
                      <strong>Add a README.md:</strong> Without a README, developers don't know what your project does. Add a description, setup instructions, and usage examples.
                    </li>
                  )}
                  {analysis.license === 'None' && (
                    <li>
                      <strong>Include an Open-Source License:</strong> Without a license, your code is legally locked. Add an MIT or Apache-2.0 license to allow others to contribute.
                    </li>
                  )}
                  {(!analysis.liveUrl || !analysis.isLive) && (
                    <li>
                      <strong>Setup a Live Demo:</strong> Connect your repository to Vercel, Netlify, or GitHub Pages and add the live URL to the repository 'About' section.
                    </li>
                  )}
                  {!analysis.description && (
                    <li>
                      <strong>Write a Description:</strong> Repositories without descriptions are harder to discover. Add a clear, concise 1-2 sentence description.
                    </li>
                  )}
                  {analysis.topics.length === 0 && (
                    <li>
                      <strong>Add Repository Topics:</strong> Tag your project with relevant topics (e.g. `react`, `typescript`) to improve SEO and discoverability on GitHub.
                    </li>
                  )}
                  {analysis.structure.filter((s: any) => s.type === 'file').length > 10 && (
                    <li>
                      <strong>Clean up Root Directory:</strong> You have {analysis.structure.filter((s: any) => s.type === 'file').length} loose files in the root directory. Consider moving source code into a `src/` directory.
                    </li>
                  )}
                  {analysis.hasReadme && analysis.license !== 'None' && analysis.liveUrl && analysis.isLive && analysis.description && analysis.topics.length > 0 && (
                    <li style={{ color: 'var(--git-green)' }}>
                      <strong>Perfect Repository Health!</strong> Your repository meets all standard health checks. You're doing great!
                    </li>
                  )}
                </ul>
              </section>

              <section className="card" style={{ padding: '24px', margin: 0, boxShadow: 'var(--shadow-neon)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Health & Security checks</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--line-strong)' }}>
                    <span>Community Health Profile</span>
                    <strong style={{ color: analysis.healthPercentage > 75 ? 'var(--git-green)' : 'var(--git-orange)' }}>
                      {analysis.healthPercentage}%
                    </strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--line-strong)' }}>
                    <span>README</span>
                    <strong>{analysis.hasReadme ? '✅ Present' : '❌ Missing'}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--line-strong)' }}>
                    <span>License</span>
                    <strong>{analysis.license !== 'None' ? `✅ ${analysis.license}` : '❌ Missing'}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--line-strong)' }}>
                    <span>Live Deployment URL</span>
                    <strong>
                      {analysis.liveUrl ? (
                        analysis.isLive ? '✅ Valid & Live' : '⚠️ Offline/Unreachable'
                      ) : (
                        '❌ No Homepage Set'
                      )}
                    </strong>
                  </li>
                </ul>
              </section>

              {Object.keys(analysis.languages).length > 0 && (
                <section className="card" style={{ padding: '24px', margin: 0, boxShadow: 'var(--shadow-neon)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Language Composition</h3>
                  <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                    {Object.entries(analysis.languages).map(([lang, bytes], idx) => {
                      const totalBytes = Object.values(analysis.languages).reduce((a: any, b: any) => a + b, 0) as number;
                      const percent = ((bytes as number) / totalBytes) * 100;
                      return (
                        <div key={lang} style={{ width: `${percent}%`, backgroundColor: getLanguageColor(idx) }} title={`${lang} ${percent.toFixed(1)}%`} />
                      );
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                    {Object.entries(analysis.languages).map(([lang, bytes], idx) => {
                      const totalBytes = Object.values(analysis.languages).reduce((a: any, b: any) => a + b, 0) as number;
                      const percent = ((bytes as number) / totalBytes) * 100;
                      return (
                        <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getLanguageColor(idx) }}></span>
                          <span style={{ color: 'var(--text-main)' }}>{lang}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{percent.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
              <section className="card" style={{ padding: '24px', margin: 0, boxShadow: 'var(--shadow-neon)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Top-Level Directory Structure</h3>
                <div style={{ background: 'var(--bg-deep)', padding: '12px', borderRadius: '6px', maxHeight: '400px', overflowY: 'auto' }}>
                  {analysis.structure.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {analysis.structure.map((item: any) => (
                        <li key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                          <span style={{ fontSize: '1.2rem', color: item.type === 'dir' ? 'var(--git-blue)' : 'var(--text-muted)' }}>
                            {item.type === 'dir' ? '📁' : '📄'}
                          </span>
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Repository is empty.</span>
                  )}
                </div>
              </section>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
