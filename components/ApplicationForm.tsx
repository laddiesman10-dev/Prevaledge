
import React, { useState, useContext, useRef } from 'react';
import { SiteDataContext } from '../data/siteDataContext';
import type { JobOpening, NewJobApplication } from '../types';
import Button from './ui/Button';
import CheckCircleIcon from './icons/CheckCircleIcon';
import UploadIcon from './icons/UploadIcon';
import { inputClass, labelClass } from './admin/ui/formStyles';

interface ApplicationFormProps {
  job: JobOpening;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job }) => {
  const { addJobApplication } = useContext(SiteDataContext);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !resumeFile) {
        setError('Please fill out all required fields and attach your resume.');
        return;
    }
    setError('');
    setStatus('loading');

    const reader = new FileReader();
    reader.readAsDataURL(resumeFile);
    reader.onload = async () => {
        try {
            const applicationData: NewJobApplication = {
                jobId: job.id,
                jobTitle: job.title,
                ...formData,
                resume: {
                    filename: resumeFile.name,
                    dataUrl: reader.result as string,
                },
            };
            await addJobApplication(applicationData);
            setStatus('success');
        } catch (err) {
            setError('There was an error submitting your application. Please try again.');
            setStatus('error');
        }
    };
    reader.onerror = () => {
        setError('There was an error reading your resume file. Please try a different file.');
        setStatus('error');
    };
  };

  if (status === 'success') {
    return (
        <div className="bg-slate-900/50 border border-green-500/50 rounded-lg p-8 text-center animate-fade-in">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">Application Sent!</h2>
            <p className="text-slate-300 mt-2 max-w-lg mx-auto">
                Thank you, {formData.name.split(' ')[0]}. We've received your application for the {job.title} position and will be in touch if your qualifications are a good fit.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 md:p-10">
      <h2 className="text-3xl font-bold text-white text-center mb-6">Apply for this Position</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label htmlFor="name" className={labelClass}>Full Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required disabled={status === 'loading'} /></div>
              <div><label htmlFor="email" className={labelClass}>Email Address</label><input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} required disabled={status === 'loading'} /></div>
          </div>
          <div><label htmlFor="phone" className={labelClass}>Phone (Optional)</label><input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} disabled={status === 'loading'} /></div>
          <div>
              <label className={labelClass}>Resume</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className={`${inputClass} !py-3 flex items-center justify-center text-center cursor-pointer hover:bg-slate-800`} disabled={status === 'loading'}>
                  <UploadIcon className="w-5 h-5 mr-2 text-slate-400" />
                  {resumeFile ? resumeFile.name : 'Click to upload your resume'}
              </button>
          </div>
          <div><label htmlFor="coverLetter" className={labelClass}>Cover Letter</label><textarea name="coverLetter" id="coverLetter" rows={6} value={formData.coverLetter} onChange={handleChange} className={inputClass} required disabled={status === 'loading'} placeholder="Tell us why you're a great fit for this role..."/></div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="text-center pt-2">
            <Button type="submit" disabled={status === 'loading' || !resumeFile}>
                {status === 'loading' ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
      </form>
    </div>
  );
};
export default ApplicationForm;
