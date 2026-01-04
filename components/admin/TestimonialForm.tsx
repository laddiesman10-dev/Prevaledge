import React, { useState, useEffect } from 'react';
import type { Testimonial, NewTestimonial } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';

interface TestimonialFormProps {
  testimonial: Testimonial | null;
  onSave: (testimonialData: NewTestimonial, originalItem: Testimonial | null) => void;
  onCancel: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewTestimonial>({
    quote: '',
    name: '',
    title: '',
    company: '',
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        quote: testimonial.quote,
        name: testimonial.name,
        title: testimonial.title,
        company: testimonial.company,
      });
    } else {
      setFormData({
        quote: '',
        name: '',
        title: '',
        company: '',
      });
    }
  }, [testimonial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, testimonial);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {testimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="quote" className={labelClass}>Quote</label>
                <textarea name="quote" id="quote" rows={4} value={formData.quote} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Author's Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="title" className={labelClass}>Author's Title</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="company" className={labelClass}>Company</label>
                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{testimonial ? 'Save Changes' : 'Create Testimonial'}</Button>
            </div>
        </form>
    </div>
  );
};

export default TestimonialForm;