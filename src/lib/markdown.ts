import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { THEMES } from './themes';

export const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight: function (str, lang) {
    let codeContent = '';
    if (lang && hljs.getLanguage(lang)) {
      try {
        codeContent = hljs.highlight(str, { language: lang }).value;
      } catch {
        codeContent = md.utils.escapeHtml(str);
      }
    } else {
      codeContent = md.utils.escapeHtml(str);
    }

    const dots = '<div style="margin-bottom: 12px; white-space: nowrap;"><span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; margin-right: 6px;"></span><span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; margin-right: 6px;"></span><span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></span></div>';

    return `<pre>${dots}<code class="hljs">${codeContent}</code></pre>`;
  }
});

export function preprocessMarkdown(content: string) {
  content = content.replace(/^[ ]{0,3}(\*[ ]*\*[ ]*\*[\* ]*)[ \t]*$/gm, '***');
  content = content.replace(/^[ ]{0,3}(-[ ]*-[ ]*-[- ]*)[ \t]*$/gm, '---');
  content = content.replace(/^[ ]{0,3}(_[ ]*_[ ]*_[_ ]*)[ \t]*$/gm, '___');
  content = content.replace(/\*\*[ \t]+\*\*/g, ' ');
  content = content.replace(/\*{4,}/g, '');
  content = content.replace(
    /([^\s])\*\*([+\-＋－%％~～!！?？,，.。:：;；、\\/|@#￥$^&*_=（）()【】\[\]《》〈〉「」『』"""'`…·][^\n*]*?)\*\*/g,
    '$1**​$2**'
  );
  return content;
}

export function applyTheme(html: string, themeId: string) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const style = theme.styles;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const headingInlineOverrides: Record<string, string> = {
    strong: 'font-weight: 700; color: inherit !important; background-color: transparent !important;',
    em: 'font-style: italic; color: inherit !important; background-color: transparent !important;',
    a: 'color: inherit !important; text-decoration: none !important; border-bottom: 1px solid currentColor !important; background-color: transparent !important;',
    code: 'color: inherit !important; background-color: transparent !important; border: none !important; padding: 0 !important;',
  };

  // Multi-image grid: merge consecutive image-only paragraphs
  const paragraphSnapshot = Array.from(doc.querySelectorAll('p'));
  const processed = new Set<HTMLParagraphElement>();

  const getSingleImageNode = (p: HTMLParagraphElement): HTMLElement | null => {
    const children = Array.from(p.childNodes).filter(n =>
      !(n.nodeType === Node.TEXT_NODE && !(n.textContent || '').trim()) &&
      !(n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === 'BR')
    );
    if (children.length !== 1) return null;
    const onlyChild = children[0];
    if (onlyChild.nodeName === 'IMG') return onlyChild as HTMLElement;
    if (onlyChild.nodeName === 'A' && onlyChild.childNodes.length === 1 && onlyChild.childNodes[0].nodeName === 'IMG') {
      return onlyChild as HTMLElement;
    }
    return null;
  };

  const isImageOnlyParagraph = (p: HTMLParagraphElement): boolean => {
    const children = Array.from(p.childNodes).filter(n =>
      !(n.nodeType === Node.TEXT_NODE && !(n.textContent || '').trim()) &&
      !(n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === 'BR')
    );
    if (children.length === 0) return false;
    return children.every(n =>
      n.nodeName === 'IMG' ||
      (n.nodeName === 'A' && n.childNodes.length === 1 && n.childNodes[0].nodeName === 'IMG')
    );
  };

  for (const paragraph of paragraphSnapshot) {
    if (!paragraph.isConnected || processed.has(paragraph)) continue;
    if (!getSingleImageNode(paragraph) && !isImageOnlyParagraph(paragraph)) continue;

    const run: HTMLParagraphElement[] = [paragraph];
    processed.add(paragraph);

    let cursor = paragraph.nextElementSibling;
    while (cursor && cursor.tagName === 'P') {
      const p = cursor as HTMLParagraphElement;
      if (!getSingleImageNode(p) && !isImageOnlyParagraph(p)) break;
      run.push(p);
      processed.add(p);
      cursor = p.nextElementSibling;
    }

    if (run.length < 2) continue;

    const allImages: HTMLElement[] = [];
    run.forEach(p => {
      if (getSingleImageNode(p)) {
        const img = getSingleImageNode(p);
        if (img) allImages.push(img);
      } else if (isImageOnlyParagraph(p)) {
        p.querySelectorAll('img').forEach(img => allImages.push(img as HTMLElement));
      }
    });

    const firstParagraph = run[0];
    let lastInserted: HTMLElement | null = null;

    for (let i = 0; i < allImages.length; i += 2) {
      const gridParagraph = doc.createElement('p');
      gridParagraph.classList.add('image-grid');
      gridParagraph.setAttribute('style', 'display: flex; justify-content: center; gap: 8px; margin: 24px 0; align-items: flex-start;');
      gridParagraph.appendChild(allImages[i]);
      if (i + 1 < allImages.length) gridParagraph.appendChild(allImages[i + 1]);

      if (i === 0) {
        firstParagraph.before(gridParagraph);
        lastInserted = gridParagraph;
      } else if (lastInserted) {
        lastInserted.after(gridParagraph);
        lastInserted = gridParagraph;
      }
    }

    run.forEach(p => { if (p.isConnected) p.remove(); });
  }

  // Process image grids
  doc.querySelectorAll('p').forEach(p => {
    const children = Array.from(p.childNodes).filter(n => !(n.nodeType === Node.TEXT_NODE && !(n.textContent || '').trim()));
    const isAllImages = children.length > 1 && children.every(n => n.nodeName === 'IMG' || (n.nodeName === 'A' && n.childNodes.length === 1 && n.childNodes[0].nodeName === 'IMG'));

    if (isAllImages) {
      p.classList.add('image-grid');
      p.setAttribute('style', 'display: flex; justify-content: center; gap: 8px; margin: 24px 0; align-items: flex-start;');
      p.querySelectorAll('img').forEach(img => {
        img.classList.add('grid-img');
        const w = 100 / children.length;
        img.setAttribute('style', `width: calc(${w}% - ${8 * (children.length - 1) / children.length}px); margin: 0; border-radius: 8px; height: auto;`);
      });
    }
  });

  // Apply theme styles
  Object.keys(style).forEach((selector) => {
    if (selector === 'pre code') return;
    const elements = doc.querySelectorAll(selector);
    elements.forEach(el => {
      if (selector === 'code' && el.parentElement?.tagName === 'PRE') return;
      if (el.tagName === 'IMG' && el.closest('.image-grid')) return;
      const currentStyle = el.getAttribute('style') || '';
      el.setAttribute('style', currentStyle + '; ' + style[selector as keyof typeof style]);
    });
  });

  // Restore list markers
  doc.querySelectorAll('ul').forEach(ul => {
    const s = ul.getAttribute('style') || '';
    ul.setAttribute('style', `${s}; list-style-type: disc !important; list-style-position: outside;`);
  });
  doc.querySelectorAll('ul ul').forEach(ul => {
    const s = ul.getAttribute('style') || '';
    ul.setAttribute('style', `${s}; list-style-type: circle !important;`);
  });
  doc.querySelectorAll('ol').forEach(ol => {
    const s = ol.getAttribute('style') || '';
    ol.setAttribute('style', `${s}; list-style-type: decimal !important; list-style-position: outside;`);
  });

  // Code highlight tokens
  const hljsLight: Record<string, string> = {
    'hljs-comment': 'color: #6a737d; font-style: normal;',
    'hljs-quote': 'color: #6a737d; font-style: normal;',
    'hljs-keyword': 'color: #d73a49; font-weight: 600;',
    'hljs-selector-tag': 'color: #d73a49; font-weight: 600;',
    'hljs-string': 'color: #032f62;',
    'hljs-title': 'color: #6f42c1; font-weight: 600;',
    'hljs-section': 'color: #6f42c1; font-weight: 600;',
    'hljs-type': 'color: #005cc5; font-weight: 600;',
    'hljs-number': 'color: #005cc5;',
    'hljs-literal': 'color: #005cc5;',
    'hljs-built_in': 'color: #005cc5;',
    'hljs-variable': 'color: #e36209;',
    'hljs-template-variable': 'color: #e36209;',
    'hljs-tag': 'color: #22863a;',
    'hljs-name': 'color: #22863a;',
    'hljs-attr': 'color: #6f42c1;',
  };

  doc.querySelectorAll('.hljs span').forEach(span => {
    let inlineStyle = span.getAttribute('style') || '';
    if (inlineStyle && !inlineStyle.endsWith(';')) inlineStyle += '; ';
    span.classList.forEach(cls => {
      if (hljsLight[cls]) inlineStyle += hljsLight[cls] + '; ';
    });
    if (inlineStyle) span.setAttribute('style', inlineStyle);
  });

  doc.querySelectorAll('pre').forEach(pre => {
    const s = pre.getAttribute('style') || '';
    pre.setAttribute('style', `${s}; font-variant-ligatures: none; tab-size: 2;`);
  });

  doc.querySelectorAll('pre code, pre .hljs, .hljs').forEach(codeNode => {
    const s = codeNode.getAttribute('style') || '';
    codeNode.setAttribute('style', `${s}; display: block; font-size: inherit !important; line-height: inherit !important; font-style: normal !important; white-space: pre; word-break: normal; overflow-wrap: normal;`);
  });

  // Heading inline overrides
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    Object.keys(headingInlineOverrides).forEach(tag => {
      heading.querySelectorAll(tag).forEach(node => {
        node.setAttribute('style', `${node.getAttribute('style') || ''}; ${headingInlineOverrides[tag]}`);
      });
    });
  });

  // Unify image styling
  doc.querySelectorAll('img').forEach(img => {
    const inGrid = Boolean(img.closest('.image-grid'));
    const s = img.getAttribute('style') || '';
    const appended = inGrid
      ? 'display:block; max-width:100%; height:auto; margin:0 !important; padding:8px !important; border-radius:14px !important; box-sizing:border-box; box-shadow:0 12px 28px rgba(15,23,42,0.18), 0 2px 8px rgba(15,23,42,0.12); border:1px solid rgba(255,255,255,0.75);'
      : 'display:block; width:100%; max-width:100%; height:auto; margin:30px auto !important; padding:8px !important; border-radius:14px !important; box-sizing:border-box; box-shadow:0 16px 34px rgba(15,23,42,0.22), 0 4px 10px rgba(15,23,42,0.12); border:1px solid rgba(15,23,42,0.12);';
    img.setAttribute('style', `${s}; ${appended}`);
  });

  const container = doc.createElement('div');
  container.setAttribute('style', style.container);
  container.innerHTML = doc.body.innerHTML;

  return container.outerHTML;
}
