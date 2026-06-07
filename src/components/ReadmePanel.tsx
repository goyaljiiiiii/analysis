/* eslint-disable */
import { useState, useEffect } from 'react';
import type { DeveloperProfile } from '../types/profile';

type ReadmePanelProps = {
  profile: DeveloperProfile;
};

// Client-side simple Markdown to HTML parser for high-fidelity visual preview
function renderMarkdownToHtml(markdown: string) {
  if (!markdown) return '<p>No content generated yet.</p>';
  
  let html = markdown;
  
  // Escape HTML entities to prevent rendering breaking or XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1 style="border-bottom: 1px solid var(--line-strong); padding-bottom: 6px; margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25;">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="border-bottom: 1px solid var(--line-strong); padding-bottom: 6px; margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25;">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 style="margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; font-size: 1.25rem;">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 style="margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; font-size: 1rem;">$1</h4>');
  
  // Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Inline Code blocks
  html = html.replace(/`(.*?)`/g, '<code style="background-color: rgba(110, 118, 129, 0.2); padding: 0.2em 0.4em; border-radius: 6px; font-family: monospace; font-size: 85%;">$1</code>');
  
  // Badges & Images — max-width: 100% so they never overflow
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; max-height: 28px; border-radius: 4px; margin: 4px 4px 4px 0; display: inline-block; vertical-align: middle;" />');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--git-blue); text-decoration: none;">$1</a>');
  
  // Table Renderer Heuristics
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        // Wrap table in a scrollable div so it never blows out on mobile
        tableHtml = '<div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 16px 0; max-width: 100%;"><table style="width: 100%; min-width: 300px; border-collapse: collapse; font-size: 0.85rem; text-align: left; border: 1px solid var(--line-strong);">';
      }
      
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if separator line (e.g. | :--- | :--- |)
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }
      
      const isHeaderRow = !tableHtml.includes('</th>');
      tableHtml += `<tr style="border-bottom: 1px solid var(--line-strong); background-color: ${isHeaderRow ? 'var(--bg-deep)' : 'transparent'};">`;      
      cells.forEach((cell) => {
        const tag = isHeaderRow ? 'th' : 'td';
        tableHtml += `<${tag} style="padding: 6px 10px; border: 1px solid var(--line-strong); font-weight: ${isHeaderRow ? '600' : 'normal'}; white-space: nowrap;">${cell}</${tag}>`;
      });
      
      tableHtml += '</tr>';
      lines[i] = ''; // clear current line representation
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table></div>'; // close both table and wrapper div
        // Put completed table block in the previous blank slot
        lines[i - 1] = tableHtml;
        tableHtml = '';
      }
    }
  }
  
  html = lines.filter(l => l !== '').join('\n');
  
  // Horizontal Dividers
  html = html.replace(/^---$/gim, '<hr style="border: 0; height: 1px; background-color: var(--line-strong); margin: 24px 0;" />');
  
  // Blockquotes
  html = html.replace(/^\>&nbsp;(.*$)/gim, '<blockquote style="border-left: 4px solid var(--line-strong); padding-left: 16px; margin: 16px 0; color: var(--text-muted);">$1</blockquote>');
  html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--line-strong); padding-left: 16px; margin: 16px 0; color: var(--text-muted);">$1</blockquote>');
  
  // Bullet lists
  html = html.replace(/^\- (.*$)/gim, '<li style="margin-left: 24px; list-style-type: disc; margin-bottom: 4px;">$1</li>');
  
  // Paragraph block enclosures
  const paragraphs = html.split('\n\n');
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    // If it starts with HTML elements, don't wrap in <p>
    if (/^<(h1|h2|h3|h4|table|div|hr|blockquote|li|ul|ol|img)/i.test(trimmed)) {
      return trimmed;
    }
    return `<p style="margin: 8px 0; line-height: 1.6; word-break: break-word; overflow-wrap: break-word;">${trimmed}</p>`;
  }).join('\n');
  
  return html;
}

export function ReadmePanel({ profile }: ReadmePanelProps) {
  const [customStyle, setCustomStyle] = useState('cute + black theme');
  const [readmeContent, setReadmeContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    // Generate default on mount / profile change
    handleGenerate();
  }, [profile]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, customStyle }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate README');
      }

      const text = await response.text();
      setReadmeContent(text);
    } catch (error) {
      console.error(error);
      setReadmeContent('Error generating README. Please make sure the local server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([readmeContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'README.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Compile visual preview
  const renderedPreviewHtml = renderMarkdownToHtml(readmeContent);

  return (
    <article className="readme-panel-card" id="readme-generator">
      <div className="section-head">
        <h3>📝 README.md Generator</h3>
        <p className="subtle">Describe a style and get a custom GitHub profile README.</p>
      </div>

      {/* Compact collapsible tip */}
      <details className="readme-tip-block">
        <summary>💡 How it works &amp; style tips</summary>
        <div className="readme-tip-body">
          <p>Our engine reads your GitHub stats (commits, PRs, language bytes) and compiles them into a profile README using your style prompt.</p>
          <p><strong>Try styles like:</strong> <em>"neon purple hacker"</em>, <em>"cute sakura dark mode"</em>, <em>"minimalist orange"</em></p>
        </div>
      </details>

      {/* Style Prompt Input */}
      <div className="readme-prompt-section">
        <label className="readme-prompt-label">Visual Style Request</label>
        <div className="readme-input-row">
          <input
            type="text"
            placeholder="e.g. cute + black theme, neon green space..."
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            style={{
              flex: 1,
              height: '38px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--line-strong)',
              backgroundColor: 'var(--bg-deep)',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: '0.88rem',
              minWidth: 0
            }}
            aria-label="README style prompt"
          />
          <button
            onClick={handleGenerate}
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--git-green)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            type="button"
          >
            ✨ Generate
          </button>
        </div>
      </div>

      {/* Preview / Code Tab Switcher */}
      <div className="readme-tab-bar">
        <button
          onClick={() => setActiveTab('preview')}
          className={`readme-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          type="button"
        >
          👁️ Preview
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`readme-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          type="button"
        >
          📑 Markdown
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>Generating README...</span>
        </div>
      ) : (
        <>
          {activeTab === 'preview' ? (
            <div
              className="readme-preview-box readme-preview-rendered"
              dangerouslySetInnerHTML={{ __html: renderedPreviewHtml }}
            />
          ) : (
            <textarea
              className="readme-preview-box readme-preview-code"
              value={readmeContent}
              readOnly
              aria-label="Generated README markdown"
            />
          )}

          <div className="readme-actions">
            <button className="readme-action-btn readme-action-primary" onClick={handleCopy} type="button">
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
            <button className="readme-action-btn" onClick={handleDownload} type="button">
              💾 Download
            </button>
          </div>
        </>
      )}
    </article>
  );
}
