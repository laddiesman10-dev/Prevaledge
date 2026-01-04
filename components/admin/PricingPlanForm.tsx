import React, { useState, useEffect } from 'react';
import type { PricingPlan, NewPricingPlan } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';

interface PricingPlanFormProps {
  plan: PricingPlan | null;
  onSave: (planData: NewPricingPlan) => void;
  onCancel: () => void;
}

const PricingPlanForm: React.FC<PricingPlanFormProps> = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    priceDetail: '',
    description: '',
    features: '',
    isPopular: false,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        priceDetail: plan.priceDetail || '',
        description: plan.description,
        features: plan.features.join('\n'),
        isPopular: plan.isPopular || false,
      });
    } else {
      setFormData({
        name: '',
        price: '',
        priceDetail: '',
        description: '',
        features: '',
        isPopular: false,
      });
    }
  }, [plan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: checked });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planData: NewPricingPlan = {
      ...formData,
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
    };
    onSave(planData);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 mt-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {plan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Plan Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="price" className={labelClass}>Price</label>
                    <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} className={inputClass} required placeholder="e.g., $499 or Custom" />
                </div>
                <div>
                    <label htmlFor="priceDetail" className={labelClass}>Price Detail (Optional)</label>
                    <input type="text" name="priceDetail" id="priceDetail" value={formData.priceDetail} onChange={handleChange} className={inputClass} placeholder="e.g., /mo or one-time" />
                </div>
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea name="description" id="description" rows={2} value={formData.description} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
                <label htmlFor="features" className={labelClass}>Features (one per line)</label>
                <textarea name="features" id="features" rows={5} value={formData.features} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="flex items-center">
                <input
                    id="isPopular"
                    name="isPopular"
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPopular" className="ml-3 block text-sm font-medium text-slate-300">
                    Mark as "Most Popular"
                </label>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{plan ? 'Save Changes' : 'Create Plan'}</Button>
            </div>
        </form>
    </div>
  );
};

export default PricingPlanForm;