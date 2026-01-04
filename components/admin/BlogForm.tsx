import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import type { BlogPost, NewBlogPost } from '../../types';
import Button from '../ui/Button';
import SparklesIcon from '../icons/SparklesIcon';
import AIImageGenerator from './AIImageGenerator';
import { generateBlogPostDraft, improveText, generateExcerpt, generateSeoMetadata } from '../../services/geminiService';
import { inputClass, labelClass } from './ui/formStyles';
import SeoIcon from '../icons/SeoIcon';
import { SiteDataContext } from '../../data/siteDataContext';
import UploadIcon from '../icons/UploadIcon';
import TrashIcon from '../icons/TrashIcon';


interface BlogFormProps {
  post: BlogPost | null;
  onSave: (postData: NewBlogPost, originalItem: BlogPost | null) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ post, onSave, onCancel }) => {
  const { blogPosts } = useContext(SiteDataContext);
  const [formData, setFormData] = useState<NewBlogPost>({
    title: '',
    author: '',
    category: '',
    image: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
  });
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isImprovingContent, setIsImprovingContent] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [aiError, setAiError] = useState('');

  const existingCategories = useMemo(() => {
    return [...new Set(blogPosts.map(p => p.category))].sort();
  }, [blogPosts]);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        author: post.author,
        category: post.category,
        image: post.image,
        excerpt: post.excerpt,
        content: post.content,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        focusKeyword: post.focusKeyword || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: existingCategories[0] || '',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop', // Default image
        excerpt: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
      });
    }
  }, [post, existingCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category' && value === '__new__') {
      setIsCreatingNewCategory(true);
    } else {
      setIsCreatingNewCategory(false);
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAiError('Please select an image file.');
        return;
      }
      setAiError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      category: isCreatingNewCategory ? newCategory.trim() : formData.category,
    };
    if (!finalData.category) {
        setAiError('Category is required.');
        return;
    }
    onSave(finalData, post);
  };
  
  const handleGenerateDraft = async () => {
    if (!formData.title) {
      setAiError('Please enter a title to generate a draft.');
      return;
    }
    setAiError('');
    setIsGeneratingDraft(true);
    try {
      const content = await generateBlogPostDraft(formData.title);
      setFormData(prev => ({ ...prev, content }));
    } catch(e) {
      setAiError('Failed to generate draft. Please try again.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleImproveContent = async () => {
      if (!formData.content) {
          setAiError('There is no content to improve.');
          return;
      };
      setAiError('');
      setIsImprovingContent(true);
      try {
          const improvedContent = await improveText(formData.content);
          setFormData(prev => ({ ...prev, content: improvedContent }));
      } catch(e) { 
          setAiError('Failed to improve content. Please try again.');
      } finally { 
          setIsImprovingContent(false); 
      }
  };

  const handleGenerateExcerpt = async () => {
      if (!formData.content) {
          setAiError('Please add content before generating an excerpt.');
          return;
      };
      setAiError('');
      setIsGeneratingExcerpt(true);
      try {
          const excerpt = await generateExcerpt(formData.content);
          setFormData(prev => ({ ...prev, excerpt }));
      } catch(e) { 
          setAiError('Failed to generate excerpt. Please try again.');
      } finally { 
          setIsGeneratingExcerpt(false);
      }
  };

  const handleGenerateSeo = async () => {
    if (!formData.content || !formData.focusKeyword) {
        setAiError('Please provide content and a focus keyword to generate SEO metadata.');
        return;
    }
    setAiError('');
    setIsGeneratingSeo(true);
    try {
        const { metaTitle, metaDescription } = await generateSeoMetadata(formData.content, formData.focusKeyword);
        setFormData(prev => ({ ...prev, metaTitle, metaDescription }));
    } catch(e) {
        setAiError('Failed to generate SEO data. Please try again.');
    } finally {
        setIsGeneratingSeo(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className={labelClass}>Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="author" className={labelClass}>Author</label>
                    <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="category" className={labelClass}>Category</label>
                    <div className="flex gap-2">
                        <select name="category" id="category" value={isCreatingNewCategory ? '__new__' : formData.category} onChange={handleChange} className={inputClass}>
                            {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            <option value="__new__">-- Create New Category --</option>
                        </select>
                        {isCreatingNewCategory && (
                            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className={`${inputClass} animate-fade-in`} required />
                        )}
                    </div>
                </div>
             </div>
             <div>
                <label htmlFor="image" className={labelClass}>Image</label>
                <div className="flex items-center gap-4">
                    <input type="text" name="image" id="image" value={formData.image} onChange={handleChange} className={`${inputClass} flex-grow`} placeholder="Enter image URL or upload" />
                    <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    <Button type="button" variant="secondary" onClick={() => imageInputRef.current?.click()}>
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                    {formData.image && (
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={handleRemoveImage} 
                            className="!px-3 !py-2 border-red-500/30 bg-red-900/30 text-red-400 hover:bg-red-900/60"
                            aria-label="Remove image"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                    )}
                </div>
                {formData.image && (
                    <div className="mt-4 p-2 bg-slate-800/50 rounded-lg inline-block">
                        <img src={formData.image} alt="Image preview" className="rounded-md max-h-48" />
                    </div>
                )}
                <AIImageGenerator 
                    onImageGenerated={(base64) => setFormData(prev => ({ ...prev, image: base64 }))}
                    promptSuggestion={formData.title} 
                />
            </div>

            {/* AI Tools */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4 space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-blue-400" />
                AI Content Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button type="button" variant="secondary" onClick={handleGenerateDraft} disabled={isGeneratingDraft || !formData.title}>
                  {isGeneratingDraft ? 'Generating...' : 'Generate Draft'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleImproveContent} disabled={isImprovingContent || !formData.content}>
                  {isImprovingContent ? 'Improving...' : 'Improve Content'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleGenerateExcerpt} disabled={isGeneratingExcerpt || !formData.content}>
                  {isGeneratingExcerpt ? 'Generating...' : 'Generate Excerpt'}
                </Button>
              </div>
              {aiError && <p className="text-red-400 text-xs text-center mt-2">{aiError}</p>}
            </div>

            <div>
                <label htmlFor="content" className={labelClass}>Content (Markdown supported)</label>
                <textarea name="content" id="content" rows={15} value={formData.content} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
                <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
                <textarea name="excerpt" id="excerpt" rows={3} value={formData.excerpt} onChange={handleChange} className={inputClass} required />
            </div>

            {/* SEO Tools */}
            <fieldset className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4 space-y-4">
                <legend className="text-lg font-semibold text-white flex items-center gap-2">
                    <SeoIcon className="w-5 h-5 text-green-400" />
                    SEO Metadata
                </legend>
                <div>
                    <label htmlFor="focusKeyword" className={labelClass}>Focus Keyword</label>
                    <input type="text" name="focusKeyword" id="focusKeyword" value={formData.focusKeyword} onChange={handleChange} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="metaTitle" className={labelClass}>Meta Title</label>
                        <input type="text" name="metaTitle" id="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputClass} maxLength={70} />
                        <p className={`text-xs mt-1 text-right ${
                            (formData.metaTitle?.length || 0) > 60 
                            ? 'text-red-400' 
                            : (formData.metaTitle?.length || 0) > 50 
                            ? 'text-yellow-400' 
                            : 'text-slate-400'
                        }`}>
                            {formData.metaTitle?.length || 0} / 60
                        </p>
                    </div>
                    <div>
                        <label htmlFor="metaDescription" className={labelClass}>Meta Description</label>
                        <textarea name="metaDescription" id="metaDescription" value={formData.metaDescription} onChange={handleChange} className={inputClass} rows={2} maxLength={170}></textarea>
                         <p className={`text-xs mt-1 text-right ${
                            (formData.metaDescription?.length || 0) > 160
                            ? 'text-red-400' 
                            : (formData.metaDescription?.length || 0) > 140
                            ? 'text-yellow-400' 
                            : 'text-slate-400'
                        }`}>
                            {formData.metaDescription?.length || 0} / 160
                        </p>
                    </div>
                </div>
                 <Button type="button" variant="secondary" onClick={handleGenerateSeo} disabled={isGeneratingSeo || !formData.content || !formData.focusKeyword}>
                  {isGeneratingSeo ? 'Generating...' : 'Generate SEO Metadata'}
                </Button>
            </fieldset>
            
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{post ? 'Save Changes' : 'Create Post'}</Button>
            </div>
        </form>
    </div>
  );
};

export default BlogForm;