import React from 'react';
import type { ContentResult } from '../types';
import Button from './ui/Button';
import ProjectIcon from './icons/ProjectIcon';
import FileTextIcon from './icons/FileTextIcon';

interface ContentResultCardProps {
  result: ContentResult;
}

const ContentResultCard: React.FC<ContentResultCardProps> = ({ result }) => {
  if (!result.items || result.items.length === 0) {
    return <p className="text-sm text-slate-400 my-2">I couldn't find any specific content, but feel free to ask me more about that topic.</p>;
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-2 animate-fade-in space-y-3">
      {result.items.map((item, index) => {
        const Icon = item.type === 'Case Study' ? ProjectIcon : FileTextIcon;
        return (
          <Button
            key={index}
            href={item.url}
            variant="link"
            className="block text-left !p-0 w-full"
          >
            <div className="hover:bg-slate-700/50 p-3 rounded-md transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase text-blue-400">{item.type}</p>
                  <p className="font-semibold text-slate-100 group-hover:text-white">{item.title}</p>
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ContentResultCard;