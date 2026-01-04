import React, { useState, useEffect } from 'react';
import type { JobOpening, NewJobOpening } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';

interface JobOpeningFormProps {
  job: JobOpening | null;
  onSave: (jobData: NewJobOpening, originalItem: JobOpening | null) => void;
  onCancel: () => void;
}

const jobTypes: JobOpening['type'][] = ['Full-time', 'Part-time', 'Internship'];

const JobOpeningForm: React.FC<JobOpeningFormProps> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<NewJobOpening, 'responsibilities' | 'qualifications'>>({
    title: '',
    location: '',
    type: 'Full-time',
    description: '',
  });
  const [responsibilitiesString, setResponsibilitiesString] = useState('');
  const [qualificationsString, setQualificationsString] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        location: job.location,
        type: job.type,
        description: job.description,
      });
      setResponsibilitiesString(job.responsibilities.join('\n'));
      setQualificationsString(job.qualifications.join('\n'));
    } else {
      setFormData({
        title: '',
        location: 'Remote',
        type: 'Full-time',
        description: '',
      });
      setResponsibilitiesString('');
      setQualificationsString('');
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobData: NewJobOpening = {
        ...formData,
        type: formData.type as JobOpening['type'],
        responsibilities: responsibilitiesString.split('\n').map(s => s.trim()).filter(Boolean),
        qualifications: qualificationsString.split('\n').map(s => s.trim()).filter(Boolean),
    };
    onSave(jobData, job);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {job ? 'Edit Job Opening' : 'Create New Job Opening'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="title" className={labelClass}>Job Title</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="type" className={labelClass}>Employment Type</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputClass} required>
                        {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>Short Description (for listing view)</label>
                <textarea name="description" id="description" rows={2} value={formData.description} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="responsibilities" className={labelClass}>Responsibilities (one per line)</label>
                    <textarea name="responsibilities" id="responsibilities" rows={6} value={responsibilitiesString} onChange={e => setResponsibilitiesString(e.target.value)} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="qualifications" className={labelClass}>Qualifications (one per line)</label>
                    <textarea name="qualifications" id="qualifications" rows={6} value={qualificationsString} onChange={e => setQualificationsString(e.target.value)} className={inputClass} required />
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{job ? 'Save Changes' : 'Create Job'}</Button>
            </div>
        </form>
    </div>
  );
};

export default JobOpeningForm;