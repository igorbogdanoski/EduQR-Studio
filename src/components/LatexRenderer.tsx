import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexRendererProps {
  content: string;
  className?: string;
  displayMode?: boolean;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({
  content,
  className = '',
  displayMode = false
}) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Доколку целата содржина е само чиста формула (без $)
    if (displayMode && !content.includes('$')) {
      try {
        return katex.renderToString(content, {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml'
        });
      } catch {
        return `<span class="text-rose-600 font-mono">${content}</span>`;
      }
    }

    // Обработка на мешан текст со $...$ (inline) и $$...$$ (block)
    try {
      // 1. Прво ги менуваме двојните $$...$$ во блок равенки
      let parsed = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="my-2.5 overflow-x-auto text-center">${katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
            output: 'htmlAndMathml'
          })}</div>`;
        } catch {
          return `<code>${math}</code>`;
        }
      });

      // 2. Потоа единечните $...$ во inline равенки
      parsed = parsed.replace(/\$([^\$\n\r]+?)\$/g, (_, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
            output: 'htmlAndMathml'
          });
        } catch {
          return `<code>${math}</code>`;
        }
      });

      // Претворање на нови редови во <br/> ако не се во HTML блокови
      parsed = parsed.replace(/\n/g, '<br />');

      return parsed;
    } catch {
      return content;
    }
  }, [content, displayMode]);

  return (
    <div
      className={`latex-container leading-relaxed select-text ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
