import React, { useState, useEffect, useContext } from 'react';
import type { Project, NewProject } from '../../types';
import { slugify } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';
import { SiteDataContext } from '../../data/siteDataContext';

interface ProjectFormProps {
  project: Project | null;
  onSave: (projectData: NewProject, originalItem: Project | null) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const { clients } = useContext(SiteDataContext);
  const [formData, setFormData] = useState<NewProject>({
    title: '',
    slug: '',
    category: '',
    description: '',
    image: '',
    url: '',
    clientId: '',
    showOnHomepage: true,
    caseStudy: {
        challenge: '',
        solution: '',
        results: '',
        keyMetrics: []
    }
  });
  const [metricsString, setMetricsString] = useState('');


  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        category: project.category,
        description: project.description,
        image: project.image,
        url: project.url || '',
        clientId: project.clientId || '',
        showOnHomepage: project.showOnHomepage ?? true,
        caseStudy: project.caseStudy,
      });
      setMetricsString(project.caseStudy.keyMetrics ? project.caseStudy.keyMetrics.map(m => `${m.value};${m.label}`).join('\n') : '');
    } else {
        setFormData({
            title: '',
            slug: '',
            category: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop',
            url: '',
            clientId: '',
            showOnHomepage: true,
            caseStudy: {
                challenge: '',
                solution: '',
                results: '',
                keyMetrics: []
            }
        });
        setMetricsString('');
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: checked });
        return;
    }

    if(name === 'title') {
        // Auto-generate slug from title
        setFormData({ ...formData, title: value, slug: slugify(value) });
    } else if (['challenge', 'solution', 'results'].includes(name)) {
        setFormData({ 
            ...formData, 
            caseStudy: { ...formData.caseStudy, [name]: value }
        });
    }
    else {
        setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleMetricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetricsString(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMetrics = metricsString.split('\n')
        .map(line => line.split(';'))
        .filter(parts => parts.length === 2 && parts[0].trim() && parts[1].trim())
        .map(parts => ({ value: parts[0].trim(), label: parts[1].trim() }));

    const finalData = {
        ...formData,
        caseStudy: {
            ...formData.caseStudy,
            keyMetrics: parsedMetrics
        }
    };
    onSave(finalData, project);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {project ? 'Edit Project' : 'Create New Project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className={labelClass}>Title</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="slug" className={labelClass}>URL Slug (auto-generated)</label>
                    <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className={`${inputClass} bg-slate-800`} required />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className={labelClass}>Category</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="clientId" className={labelClass}>Assign to Client</label>
                    <select name="clientId" id="clientId" value={formData.clientId} onChange={handleChange} className={inputClass}>
                        <option value="">No Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="image" className={labelClass}>Image URL</label>
                    <input type="url" name="image" id="image" value={formData.image} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="url" className={labelClass}>Project URL (Optional)</label>
                    <input type="url" name="url" id="url" value={formData.url} onChange={handleChange} className={inputClass} />
                </div>
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>Short Description (for portfolio card)</label>
                <textarea name="description" id="description" rows={2} value={formData.description} onChange={handleChange} className={inputClass} required />
            </div>

            <div className="pt-2">
                <div className="flex items-center">
                    <input
                        id="showOnHomepage"
                        name="showOnHomepage"
                        type="checkbox"
                        checked={formData.showOnHomepage}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showOnHomepage" className="ml-3 block text-sm font-medium text-slate-300">
                        Show on homepage portfolio
                    </label>
                </div>
            </div>

            <fieldset className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4 space-y-4">
                <legend className="text-lg font-semibold text-white px-2">Case Study Content</legend>
                 <div>
                    <label htmlFor="challenge" className={labelClass}>The Challenge</label>
                    <textarea name="challenge" id="challenge" rows={3} value={formData.caseStudy.challenge} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="solution" className={labelClass}>Our Solution</label>
                    <textarea name="solution" id="solution" rows={4} value={formData.caseStudy.solution} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="results" className={labelClass}>The Results</label>
                    <textarea name="results" id="results" rows={3} value={formData.caseStudy.results} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="metrics" className={labelClass}>Key Metrics (one per line, format: value;label)</label>
                    <textarea name="metrics" id="metrics" rows={4} value={metricsString} onChange={handleMetricsChange} className={inputClass} placeholder="e.g., +200%;Organic Traffic&#10;35%;Conversion Rate Lift" />
                </div>
            </fieldset>
            
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{project ? 'Save Changes' : 'Create Project'}</Button>
            </div>
        </form>
    </div>
  );
};

export default ProjectForm;