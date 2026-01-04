import React, { useState, useContext } from 'react';
import Button from '../components/ui/Button';
import BrainCircuitIcon from '../components/icons/BrainCircuitIcon';
import { inputClass as formInputClass } from '../components/admin/ui/formStyles';
import MailIcon from '../components/icons/MailIcon';
import AlertTriangleIcon from '../components/icons/AlertTriangleIcon';
import { useClientAuth } from '../context/ClientAuthContext';

const ClientLoginPage: React.FC = () => {
  const { login } = useClientAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
        await login(email);
        // On success, the context will handle navigation.
        // We don't need to set isLoading to false as the page will change.
    } catch(err: any) {
        setError(err.message || 'An unknown error occurred.');
        setIsLoading(false);
    }
  };
  
  const getInputClasses = () => {
    const baseClasses = `${formInputClass.replace('text-sm','')} pl-10 form-input-futuristic`;
    const errorClasses = "border-red-500 focus:ring-red-500";
    return error ? `${baseClasses} ${errorClasses}` : baseClasses;
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
            <p className="text-slate-400 mt-2 text-center">Your Project Dashboard Awaits.</p>
          </div>
        </div>

        {/* Right Login Form Column */}
        <div className="p-8 md:p-12">
          <div className="text-center mb-8 lg:hidden">
              <BrainCircuitIcon className="w-12 h-12 mx-auto text-blue-400 mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-1">Client Portal Access</h2>
          <p className="text-slate-400 text-center mb-8">Enter your email to access your project dashboard.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getInputClasses()}
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            {error && (
                <div role="alert" className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm rounded-lg p-3 flex items-center gap-3">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Accessing...' : 'Access Portal'}
              </Button>
            </div>
          </form>
        </div>
       </div>
    </div>
  );
};

export default ClientLoginPage;