import React from 'react';

const renderTextWithBold = (line: string) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index} className="font-semibold text-slate-100">{part}</strong> : part
    );
};

export const renderMarkdownContent = (text: string) => {
    const blocks = text.split('\n\n').filter(block => block.trim() !== '');
    const finalElements: React.ReactNode[] = [];
  
    blocks.forEach((block, blockIndex) => {
      const lines = block.split('\n');
      let listItems: {type: 'ul'|'ol', content: string}[] = [];
  
      const nonListLines = lines.filter(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- ')) {
          listItems.push({type: 'ul', content: line});
          return false;
        } else if (trimmedLine.match(/^\d+\.\s/)) {
          listItems.push({type: 'ol', content: line});
          return false;
        }
        return true;
      });
  
      nonListLines.forEach((line, lineIndex) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('### ')) {
          finalElements.push(<h3 key={`${blockIndex}-h3-${lineIndex}`} className="text-xl lg:text-2xl font-bold text-blue-400 mt-6 mb-3">{trimmedLine.substring(4)}</h3>);
        } else if (trimmedLine.startsWith('#### ')) {
          finalElements.push(<h4 key={`${blockIndex}-h4-${lineIndex}`} className="text-lg lg:text-xl font-semibold text-white mt-4 mb-2">{trimmedLine.substring(5)}</h4>);
        } else if (trimmedLine) {
          finalElements.push(<p key={`${blockIndex}-p-${lineIndex}`} className="text-slate-300 mb-4 leading-relaxed">{renderTextWithBold(trimmedLine)}</p>);
        }
      });
      
      if (listItems.length > 0) {
        const listType = listItems[0].type;
        const listKey = `${blockIndex}-${listType}`;
        const listElements = listItems.map((item, itemIndex) => {
            const content = listType === 'ul' 
                ? item.content.trim().replace(/^- \s*/, '')
                : item.content.trim().replace(/^\d+\.\s/, '');
            return <li key={itemIndex}>{renderTextWithBold(content)}</li>;
        });

        if (listType === 'ul') {
          finalElements.push(
              <ul key={listKey} className="list-disc list-inside space-y-2 mb-4 pl-4 text-slate-300">
                {listElements}
              </ul>
          );
        } else {
          finalElements.push(
              <ol key={listKey} className="list-decimal list-inside space-y-2 mb-4 pl-4 text-slate-300">
                {listElements}
              </ol>
          );
        }
      }
    });
  
    return finalElements;
};

/**
 * Performance: Helper function to generate responsive image sources for Unsplash URLs.
 * @param unsplashUrl The original URL from images.unsplash.com
 * @returns An object with a default src and a srcSet string.
 */
export const getUnsplashSrcSet = (unsplashUrl: string) => {
    if (!unsplashUrl || !unsplashUrl.includes('images.unsplash.com')) {
        return { src: unsplashUrl, srcSet: '' };
    }
    const baseUrl = unsplashUrl.split('?')[0] + '?q=80&auto=format&fit=crop&fm=webp';
    const srcSet = [400, 600, 800, 1200, 1600]
        .map(width => `${baseUrl}&w=${width} ${width}w`)
        .join(', ');
    return {
        src: `${baseUrl}&w=1200`, // Default high-res src
        srcSet,
    };
};

export const calculateWordCount = (text: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
};

export const stripMarkdown = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/#{1,6}\s/g, '') // Remove heading hashes
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/^- \s*/gm, '') // Remove list bullets
        .replace(/^\d+\.\s/gm, '') // Remove numbered list markers
        .replace(/\n/g, ' '); // Replace newlines with spaces
};
