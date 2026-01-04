import React, { useState, useEffect } from 'react';
import type { SocialLink, NewSocialLink } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';
import { socialIconOptions } from '../../data/siteDataContext';

interface SocialLinkFormProps {
  link: SocialLink | null;
  onSave: (linkData: NewSocialLink, originalItem: SocialLink | null) => void;
  onCancel: () => void;
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({ link, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewSocialLink>({
    name: '',
    url: '',
    iconName: socialIconOptions[0] || '',
  });

  useEffect(() => {
    if (link) {
      setFormData({
        name: link.name,
        url: link.url,
        iconName: link.iconName,
      });
    } else {
      setFormData({
        name: socialIconOptions[0]?.replace('Icon', '') || '',
        url: '',
        iconName: socialIconOptions[0] || '',
      });
    }
  }, [link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'iconName' && !link) {
        // Auto-update name for new links
        setFormData({
            ...formData,
            iconName: value,
            name: value.replace('Icon', '')
        });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, link);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {link ? 'Edit Social Link' : 'Create New Social Link'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="iconName" className={labelClass}>Platform Icon</label>
                    <select id="iconName" name="iconName" value={formData.iconName} onChange={handleChange} className={inputClass} required>
                        {socialIconOptions.map(name => (
                            <option key={name} value={name}>{name.replace('Icon', '')}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="name" className={labelClass}>Platform Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="url" className={labelClass}>URL</label>
                <input type="url" name="url" id="url" value={formData.url} onChange={handleChange} className={inputClass} required placeholder="https://www.example.com/username"/>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{link ? 'Save Changes' : 'Create Link'}</Button>
            </div>
        </form>
    </div>
  );
};

export default SocialLinkForm;