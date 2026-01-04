import React, { useState, useEffect } from 'react';
import type { Service, NewService } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';
import { serviceIconOptions } from '../../data/siteDataContext';

interface ServiceFormProps {
  service: Service | null;
  onSave: (serviceData: NewService, originalItem: Service | null) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<NewService, 'keyOfferings'>>({
    title: '',
    description: '',
    detailedDescription: '',
    iconName: serviceIconOptions[0] || '',
  });
  const [keyOfferingsString, setKeyOfferingsString] = useState('');


  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        detailedDescription: service.detailedDescription,
        iconName: service.iconName,
      });
      setKeyOfferingsString(service.keyOfferings.join('\n'));
    } else {
        setFormData({
            title: '',
            description: '',
            detailedDescription: '',
            iconName: serviceIconOptions[0] || '',
        });
        setKeyOfferingsString('');
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyOfferingsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeyOfferingsString(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData: NewService = {
        ...formData,
        keyOfferings: keyOfferingsString.split('\n').map(s => s.trim()).filter(Boolean),
    };
    onSave(serviceData, service);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {service ? `Edit Service: ${service.title}` : 'Create New Service'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className={labelClass}>Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
            </div>
             <div>
                <label htmlFor="iconName" className={labelClass}>Icon</label>
                <select id="iconName" name="iconName" value={formData.iconName} onChange={handleChange} className={inputClass} required>
                    {serviceIconOptions.map(name => (
                        <option key={name} value={name}>{name.replace('Icon', '')}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>Short Description (for service card)</label>
                <textarea name="description" id="description" rows={2} value={formData.description} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
                <label htmlFor="detailedDescription" className={labelClass}>Detailed Description (for modal)</label>
                <textarea name="detailedDescription" id="detailedDescription" rows={4} value={formData.detailedDescription} onChange={handleChange} className={inputClass} required />
            </div>
             <div>
                <label htmlFor="keyOfferings" className={labelClass}>Key Offerings (one per line)</label>
                <textarea name="keyOfferings" id="keyOfferings" rows={5} value={keyOfferingsString} onChange={handleKeyOfferingsChange} className={inputClass} required />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{service ? 'Save Changes' : 'Create Service'}</Button>
            </div>
        </form>
    </div>
  );
};

export default ServiceForm;