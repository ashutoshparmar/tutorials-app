import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content by code blocks to avoid parsing markdown symbols inside code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-content">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0]?.trim();
          const hasLang = firstLine && /^[a-zA-Z0-9+#-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const code = (hasLang ? lines.slice(1) : lines).join('\n');

          return (
            <div key={index} className="markdown-code-block-container">
              {lang && <div className="markdown-code-lang">{lang.toUpperCase()}</div>}
              <pre className="markdown-code-block">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          const lines = part.split('\n');
          const elements: React.ReactNode[] = [];
          let currentList: string[] = [];

          const renderInline = (text: string): React.ReactNode[] => {
            // Parses bold **text** and inline code `code`
            const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
            return tokens.map((token, i) => {
              if (token.startsWith('**') && token.endsWith('**')) {
                return <strong key={i}>{token.slice(2, -2)}</strong>;
              } else if (token.startsWith('`') && token.endsWith('`')) {
                return <code key={i} className="inline-code">{token.slice(1, -1)}</code>;
              }
              return token;
            });
          };

          const flushList = (key: number) => {
            if (currentList.length > 0) {
              elements.push(
                <ul key={`list-${key}`} className="markdown-list">
                  {currentList.map((item, idx) => (
                    <li key={idx}>{renderInline(item)}</li>
                  ))}
                </ul>
              );
              currentList = [];
            }
          };

          lines.forEach((line, lineIdx) => {
            const trimmed = line.trim();
            if (!trimmed) {
              flushList(lineIdx);
              return;
            }

            // Headings
            const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
            if (headingMatch) {
              flushList(lineIdx);
              const level = headingMatch[1].length;
              const text = headingMatch[2];
              const Tag = `h${level}` as keyof JSX.IntrinsicElements;
              elements.push(<Tag key={lineIdx} className={`markdown-h${level}`}>{renderInline(text)}</Tag>);
              return;
            }

            // List Items
            const listMatch = line.match(/^-\s+(.*)$/);
            if (listMatch) {
              currentList.push(listMatch[1]);
              return;
            }

            // Regular paragraph
            flushList(lineIdx);
            elements.push(<p key={lineIdx}>{renderInline(line)}</p>);
          });

          flushList(lines.length);
          return <React.Fragment key={index}>{elements}</React.Fragment>;
        }
      })}
    </div>
  );
};
