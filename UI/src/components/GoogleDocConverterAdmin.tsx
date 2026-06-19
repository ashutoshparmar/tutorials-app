import React, { useState } from 'react';

interface GoogleDocConverterAdminProps {
  navigateTo: (path: string) => void;
}

// Conversion function from GoogleDocHTMLConverter.tsx
function convertGoogleDocToTutorialHtml(sourceHtml: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sourceHtml, "text/html");

  const nodes = [...doc.body.children];

  let output: string[] = [];
  let currentQuestion: string | null = null;
  let answerPoints: string[] = [];

  function flushAnswerBox() {
    if (answerPoints.length === 0) return;

    output.push(`
<div class="highlight-box">
    <ul class="info-list">
        ${answerPoints.map(x => `<li>${x}</li>`).join("")}
    </ul>
</div>
        `);

    answerPoints = [];
  }

  function isQuestion(text: string) {
    return /^\d+\.\s/.test(text);
  }

  function isSection(text: string) {
    return /^Section\s+\d+/i.test(text);
  }

  function isFollowupHeading(text: string) {
    return (
      text.includes("Follow-up") ||
      text.includes("Common Follow-up")
    );
  }

  function isRealExample(text: string) {
    return (
      text.includes("Real Example") ||
      text.includes("Real Project Example")
    );
  }

  function isCodeExample(text: string) {
    return (
      text === "Example" ||
      text.includes("Code Example") ||
      text.includes("Practical Code Example")
    );
  }

  function isQuestionAnswer(text: string) {
    return text.startsWith("Q:");
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i] as HTMLElement;
    const text = node.textContent?.trim() || "";

    if (!text) continue;

    //--------------------------------
    // SECTION
    //--------------------------------
    if (isSection(text)) {

      flushAnswerBox();

      output.push(`
<h1 class="detailed-heading">${text}</h1>
            `);

      continue;
    }

    //--------------------------------
    // QUESTION
    //--------------------------------
    if (isQuestion(text)) {

      flushAnswerBox();

      output.push(`
<p class="section-tag">${text}</p>
            `);

      currentQuestion = text;
      continue;
    }

    //--------------------------------
    // REAL EXAMPLE
    //--------------------------------
    if (isRealExample(text)) {

      flushAnswerBox();

      output.push(`
<h3 class="section-heading">${text}</h3>
            `);

      const next = nodes[i + 1] as HTMLElement | undefined;

      if (next) {

        output.push(`
<div class="intro-text">
${next.textContent?.trim() || ""}
</div>
                `);

        i++;
      }

      continue;
    }

    //--------------------------------
    // FOLLOWUPS
    //--------------------------------
    if (isFollowupHeading(text)) {

      flushAnswerBox();

      output.push(`
<h3 class="section-heading">Follow-up Questions</h3>
            `);

      continue;
    }

    //--------------------------------
    // FOLLOWUP QUESTION
    //--------------------------------
    if (isQuestionAnswer(text)) {

      output.push(`
<strong>${text}</strong>
            `);

      const next = nodes[i + 1] as HTMLElement | undefined;

      if (next) {

        output.push(`
<div class="intro-text">
${next.textContent?.trim() || ""}
</div>
                `);

        i++;
      }

      continue;
    }

    //--------------------------------
    // CODE EXAMPLE
    //--------------------------------
    if (isCodeExample(text)) {

      flushAnswerBox();

      let codeLines: string[] = [];

      let j = i + 1;

      while (
        j < nodes.length &&
        (nodes[j] as HTMLElement).tagName.toLowerCase() === "p"
      ) {

        const codeText = (nodes[j] as HTMLElement).textContent?.trim() || "";

        if (
          codeText.startsWith("Q:") ||
          codeText.includes("Follow-up") ||
          codeText.includes("Real Example")
        ) {
          break;
        }

        codeLines.push(codeText);
        j++;
      }

      output.push(`
<div class="section-gap">

<h3 class="section-heading">
💻 Practical Code Example
</h3>

<div class="code-panel">

<pre class="code-block">
${escapeHtml(codeLines.join("\n"))}</pre>

</div>

</div>
            `);

      i = j - 1;

      continue;
    }

    //--------------------------------
    // NORMAL ANSWER POINT
    //--------------------------------
    answerPoints.push(text);
  }

  flushAnswerBox();

  output.push(`
<hr>
<br>
    `);

  return `
<div class="detailed-container">
${output.join("\n")}
</div>
    `;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const GoogleDocConverterAdmin: React.FC<GoogleDocConverterAdminProps> = ({
  navigateTo
}) => {
  const [inputHtml, setInputHtml] = useState('');
  const [outputHtml, setOutputHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      if (!inputHtml.trim()) {
        setError('Please paste Google Docs HTML first');
        return;
      }
      const converted = convertGoogleDocToTutorialHtml(inputHtml);
      setOutputHtml(converted);
    } catch (err) {
      setError(`Conversion error: ${err instanceof Error ? err.message : String(err)}`);
      setOutputHtml('');
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputHtml('');
    setOutputHtml('');
    setError('');
  };

  return (
    <div className="converter-container panel">
      <div className="converter-header">
        <button className="back-btn" onClick={() => navigateTo('/admin')}>
          ← Back to Admin
        </button>
        <h1>📝 Google Docs to HTML Converter</h1>
      </div>

      <div className="converter-content">
        {/* Input Section */}
        <div className="converter-section">
          <label htmlFor="input-html">
            <h3>Step 1: Paste Google Docs Exported HTML</h3>
            <p className="hint">Export your Google Doc as HTML and paste the contents below</p>
          </label>
          <textarea
            id="input-html"
            className="converter-textarea"
            placeholder="Paste Google Docs HTML here..."
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            rows={10}
          />
          <div className="input-hint">
            💡 <strong>How to export from Google Docs:</strong> File → Download → Web Page (.html)
          </div>
        </div>

        {/* Control Buttons */}
        <div className="converter-actions">
          <button className="btn-primary" onClick={handleConvert}>
            ✨ Convert to Website HTML
          </button>
          <button className="btn-secondary" onClick={handleClear}>
            🗑️ Clear All
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Output Section */}
        {outputHtml && (
          <div className="converter-section">
            <label htmlFor="output-html">
              <h3>Step 2: Your Website HTML</h3>
              <p className="hint">Copy this HTML and use it in your website</p>
            </label>
            <textarea
              id="output-html"
              className="converter-textarea output-textarea"
              value={outputHtml}
              readOnly
              rows={15}
            />
            <div className="output-actions">
              <button className="btn-success" onClick={handleCopyOutput}>
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy HTML'}
              </button>
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              <h3>📺 Preview</h3>
              <div className="preview-box" dangerouslySetInnerHTML={{ __html: outputHtml }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
