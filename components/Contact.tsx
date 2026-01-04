import React, { useState, useContext, useEffect } from 'react';
import { SiteDataContext } from '../data/siteDataContext';
import Button from './ui/Button';
import AnimateOnScroll from './ui/AnimateOnScroll';
import ContactSuccessView from './ContactSuccessView';
import type { NewContactSubmission, ContactSubmission } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import { useFormValidation, Validators } from '../hooks/useFormValidation';

interface ContactFormState extends NewContactSubmission {
  verificationAnswer: string;
}

const Contact: React.FC = () => {
  const { addContactSubmission } = useContext(SiteDataContext);

  const [verification, setVerification] = useState({ num1: 0, num2: 0 });

  const regenerateVerification = () => {
    setVerification({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
    });
  };

  useEffect(() => {
    regenerateVerification();
  }, []);

  const { values, errors, touched, handleChange, handleBlur, validateForm, resetForm } = useFormValidation<ContactFormState>({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: '',
    verificationAnswer: '',
  }, {
    name: Validators.required,
    email: (value) => Validators.required(value) || Validators.email(value),
    message: Validators.required,
    verificationAnswer: (value) => {
        if (!String(value).trim()) return 'Please answer the verification question.';
        if (parseInt(value, 10) !== verification.num1 + verification.num2) {
            return 'Incorrect answer. Please try again.';
        }
        return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [lastSubmission, setLastSubmission] = useState<ContactSubmission | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setApiError('');
    setIsLoading(true);
    try {
      const { verificationAnswer, ...submissionData } = values;
      const submissionResult = await addContactSubmission(submissionData);
      setLastSubmission(submissionResult);
      setIsSuccess(true);
      resetForm();
      regenerateVerification();
    } catch (err) {
      setApiError('Something went wrong. Please try again later.');
      regenerateVerification();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setLastSubmission(null);
    resetForm();
    regenerateVerification();
  };

  if (isSuccess && lastSubmission) {
    return <ContactSuccessView submission={lastSubmission} onReset={handleReset} />;
  }
  
  const getInputClasses = (fieldName: keyof ContactFormState) => {
    const baseClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
    const errorClasses = "border-red-500 focus:ring-red-500";
    return touched[fieldName] && errors[fieldName] ? `${baseClasses} ${errorClasses}` : baseClasses;
  };

  return (
    <section id="contact" className="py-20" aria-labelledby="contact-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="contact-heading" className="text-4xl font-bold mb-4">
            Let's Build <span className="text-blue-400">Together</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-12">
            Have a project in mind? We'd love to hear about it. Fill out the form below, and our team will get back to you shortly.
          </p>
        </div>
      </AnimateOnScroll>
      <AnimateOnScroll delay={200}>
        <div className="max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input type="text" name="name" id="name" value={values.name} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('name')} />
                {touched.name && errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input type="email" name="email" id="email" value={values.email} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('email')} />
                {touched.email && errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
               <div>
                <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">Organization (Optional)</label>
                <input type="text" name="organization" id="organization" value={values.organization} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('organization')} />
              </div>
               <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone Number (Optional)</label>
                <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                    <input type="tel" name="phone" id="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} className={`${getInputClasses('phone')} pl-10`} />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">How can we help?</label>
              <textarea name="message" id="message" rows={5} value={values.message} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('message')} />
              {touched.message && errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>
            
            <div>
              <label htmlFor="verificationAnswer" className="block text-sm font-medium text-slate-300 mb-2">
                Robot Verification: What is {verification.num1} + {verification.num2}?
              </label>
              <input
                type="number"
                name="verificationAnswer"
                id="verificationAnswer"
                value={values.verificationAnswer}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClasses('verificationAnswer')}
                autoComplete="off"
              />
              {touched.verificationAnswer && errors.verificationAnswer && <p className="text-red-400 text-xs mt-1">{errors.verificationAnswer}</p>}
            </div>

            {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}
            <div className="text-center">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default Contact;