import React, { useState, useContext } from 'react';
import Button from '../ui/Button';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import { inputClass as formInputClass } from './ui/formStyles';
import UserIcon from '../icons/UserIcon';
import LockIcon from '../icons/LockIcon';
import { AuthContext } from '../../context/AuthContext';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useFormValidation, Validators } from '../../hooks/useFormValidation';

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation({
    email: '',
    password: '',
  }, {
    email: (value) => Validators.required(value) || Validators.email(value),
    password: Validators.required,
  });

  const [apiError, setApiError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setApiError('');
    setIsLoggingIn(true);
    try {
      await login(values.email, values.password);
    } catch (err: any) {
      setApiError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const getInputClasses = (fieldName: 'email' | 'password') => {
    const baseClasses = `${formInputClass.replace('text-sm','')} pl-10 form-input-futuristic`;
    const errorClasses = "border-red-500 focus:ring-red-500";
    return touched[fieldName] && errors[fieldName] ? `${baseClasses} ${errorClasses}` : baseClasses;
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4 bg-grid-pattern">
       <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-2 bg-slate-900/50 border border-slate-800 rounded-lg shadow-2xl backdrop-blur-lg overflow-hidden animate-modal-entry">
        
        {/* Left Branding Column */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 aurora-bg aurora-bg-deep border-r border-slate-800">
          <div className="relative z-10 flex flex-col items-center">
            <div className="animate-logo-breathing">
              <BrainCircuitIcon className="w-20 h-20 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mt-4">Prevaledge</h1>
            <p className="text-slate-400 mt-2 text-center">Control Center for Your Digital Presence.</p>
          </div>
        </div>

        {/* Right Login Form Column */}
        <div className="p-8 md:p-12">
          <div className="text-center mb-8 lg:hidden">
              <BrainCircuitIcon className="w-12 h-12 mx-auto text-blue-400 mb-4" />
              <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome Back</h2>
          <p className="text-slate-400 text-center mb-8">Please sign in to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('email')}
                  autoComplete="email"
                />
              </div>
              {touched.email && errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password"className="block text-sm font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('password')}
                  autoComplete="current-password"
                />
              </div>
              {touched.password && errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            {apiError && (
                <div role="alert" className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm rounded-lg p-3 flex items-center gap-3">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{apiError}</span>
                </div>
            )}
            <div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
       </div>
       <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
    </div>
  );
};

export default LoginPage;
