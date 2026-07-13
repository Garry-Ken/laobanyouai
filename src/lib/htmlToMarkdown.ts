import TurndownService from 'turndown';
// @ts-ignore
import { gfm } from 'turndown-plugin-gfm';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined'
});

turndownService.use(gfm);

// 剥离从 Word / Pages / TextEdit 等富文本粘贴时带进来的 <style>/<head> 等噪音,
// 否则 macOS Cocoa HTML 的 CSS 定义(p.p1{font:Menlo…})会被当成正文塞进来。
turndownService.remove(['style', 'script', 'head', 'meta', 'link', 'title', 'noscript']);
// 富文本 → 公众号 markdown 专用场景:不转义 # ** - > 等记号,
// 保留用户在源文档里手写的 markdown 结构(否则「# 标题」会变成「\# 标题」,排版不识别)。
turndownService.escape = (str: string) => str;

turndownService.addRule('image', {
  filter: 'img',
  replacement: (_content: string, node: any) => {
    const alt = node.alt || '图片';
    const src = (node.getAttribute?.('src') || node.src || '').trim();
    const title = (node.title || '').replace(/"/g, '\\"');
    if (!src) return '';
    return `![${alt}](${src}${title ? ` "${title}"` : ''})\n`;
  }
});

function isIDEFormattedHTML(htmlData: string, textData: string): boolean {
  if (!htmlData || !textData) return false;
  const ideSignatures: (RegExp | ((html: string) => boolean))[] = [
    /<meta\s+charset=['"]utf-8['"]/i,
    /<div\s+class=["']ace_line["']/,
    /style=["'][^"']*font-family:\s*['"]?(?:Consolas|Monaco|Menlo|Courier)/i,
    (html: string) => {
      const hasDivSpan = /<(?:div|span)[\s>]/.test(html);
      const hasSemanticTags = /<(?:p|h[1-6]|strong|em|ul|ol|li|blockquote)[\s>]/i.test(html);
      return hasDivSpan && !hasSemanticTags;
    },
    (html: string) => {
      const stripped = html.replace(/<[^>]+>/g, '').trim();
      return stripped === textData.trim();
    }
  ];
  let matchCount = 0;
  for (const sig of ideSignatures) {
    if (typeof sig === 'function') { if (sig(htmlData)) matchCount++; }
    else if (sig.test(htmlData)) matchCount++;
  }
  return matchCount >= 2;
}

function isMarkdown(text: string): boolean {
  if (!text) return false;
  const patterns = [/^#{1,6}\s+/m, /\*\*[^*]+\*\*/, /\*[^*\n]+\*/, /\[[^\]]+\]\([^)]+\)/, /!\[[^\]]*\]\([^)]+\)/, /^[\*\-\+]\s+/m, /^\d+\.\s+/m, /^>\s+/m, /`[^`]+`/, /```[\s\S]*?```/, /^\|.*\|$/m, /^---+$/m];
  return patterns.filter(p => p.test(text)).length >= 2;
}

function getClipboardImageFiles(clipboardData: DataTransfer): File[] {
  const fromItems = Array.from(clipboardData.items || [])
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter((file): file is File => Boolean(file));
  if (fromItems.length > 0) return fromItems;
  return Array.from(clipboardData.files || []).filter((file) => file.type.startsWith('image/'));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Failed to read clipboard image'));
    reader.readAsDataURL(file);
  });
}

function insertAtSelection(textarea: HTMLTextAreaElement, insertedText: string, setMarkdownInput: (val: string) => void) {
  const currentValue = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newValue = currentValue.substring(0, start) + insertedText + currentValue.substring(end);
  setMarkdownInput(newValue);
  setTimeout(() => {
    const nextPos = start + insertedText.length;
    textarea.selectionStart = textarea.selectionEnd = nextPos;
    textarea.focus();
  }, 0);
}

export function handleSmartPaste(e: React.ClipboardEvent<HTMLTextAreaElement>, setMarkdownInput: (val: string) => void): void {
  const clipboardData = e.clipboardData;
  if (!clipboardData) return;

  const htmlData = clipboardData.getData('text/html');
  const textData = clipboardData.getData('text/plain');
  const imageFiles = getClipboardImageFiles(clipboardData);

  if (imageFiles.length > 0) {
    e.preventDefault();
    const textarea = e.currentTarget;
    Promise.all(imageFiles.map(fileToDataUrl))
      .then((dataUrls) => {
        const markdownImages = dataUrls.filter(Boolean).map((src, i) => `![图片${dataUrls.length > 1 ? ` ${i + 1}` : ''}](${src})`).join('\n\n');
        if (!markdownImages) return;
        insertAtSelection(textarea, markdownImages, setMarkdownInput);
      })
      .catch((err) => { console.error('Clipboard image conversion failed:', err); });
    return;
  }

  if (textData && /^\[Image\s*#?\d*\]$/i.test(textData.trim())) { e.preventDefault(); return; }

  const isFromIDE = isIDEFormattedHTML(htmlData, textData);
  if (isFromIDE && textData && isMarkdown(textData)) return;

  if (htmlData && htmlData.trim() !== '') {
    const hasPreTag = /<pre[\s>]/.test(htmlData);
    const hasCodeTag = /<code[\s>]/.test(htmlData);
    const isMainlyCode = (hasPreTag || hasCodeTag) && !htmlData.includes('<p') && !htmlData.includes('<div');
    if (isMainlyCode) return;
    if (htmlData.includes('file:///') || htmlData.includes('src="file:')) { e.preventDefault(); return; }

    e.preventDefault();
    try {
      let markdown = turndownService.turndown(htmlData);
      markdown = markdown.replace(/\n{3,}/g, '\n\n');
      insertAtSelection(e.currentTarget, markdown, setMarkdownInput);
    } catch (err) {
      console.error('HTML to Markdown conversion failed:', err);
      insertAtSelection(e.currentTarget, textData, setMarkdownInput);
    }
  }
}
