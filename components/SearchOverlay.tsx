
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useModal } from '../hooks/useModal';
import { SiteDataContext } from '../data/siteDataContext';
import { RouterContext, Project, BlogPost } from '../types';
import SearchIcon from './icons/SearchIcon';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, isOpen, onClose);

  const { projects, blogPosts } = useContext(SiteDataContext);
  const { navigate } = useContext(RouterContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ projects: Project[], blogPosts: BlogPost[] }>({ projects: [], blogPosts: [] });

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults({ projects: [], blogPosts: [] });
      return;
    }

    if (searchTerm.trim().length > 2) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(lowerCaseTerm) ||
        p.description.toLowerCase().includes(lowerCaseTerm) ||
        p.category.toLowerCase().includes(lowerCaseTerm)
      );
      const filteredBlogPosts = blogPosts.filter(b =>
        b.title.toLowerCase().includes(lowerCaseTerm) ||
        b.excerpt.toLowerCase().includes(lowerCaseTerm)
      );
      setResults({ projects: filteredProjects, blogPosts: filteredBlogPosts });
    } else {
      setResults({ projects: [], blogPosts: [] });
    }
  }, [searchTerm, projects, blogPosts, isOpen]);

  const handleResultClick = (path: string) => {
    navigate(path);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-heading"
    >
      <div
        ref={modalRef}
        className="relative max-w-2xl w-11/12 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            id="search-heading"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for projects, blog posts, services..."
            className="w-full bg-transparent border-b border-slate-800 p-4 pl-12 text-lg text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {searchTerm.length > 2 && results.projects.length === 0 && results.blogPosts.length === 0 ? (
            <p className="p-8 text-center text-slate-400">No results found for "{searchTerm}"</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {results.projects.map(project => (
                <li key={`proj-${project.slug}`}>
                  <button onClick={() => handleResultClick(`/project/${project.slug}`)} className="w-full text-left p-4 hover:bg-slate-800/50 transition-colors">
                    <p className="text-sm font-semibold text-blue-400">Project</p>
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-sm text-slate-400 truncate">{project.description}</p>
                  </button>
                </li>
              ))}
              {results.blogPosts.map(post => (
                <li key={`blog-${post.slug}`}>
                  <button onClick={() => handleResultClick(`/blog/${post.slug}`)} className="w-full text-left p-4 hover:bg-slate-800/50 transition-colors">
                    <p className="text-sm font-semibold text-purple-400">Blog</p>
                    <p className="text-white font-medium">{post.title}</p>
                    <p className="text-sm text-slate-400 truncate">{post.excerpt}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
