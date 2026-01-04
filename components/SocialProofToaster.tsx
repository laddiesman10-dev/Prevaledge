import React, { useContext, useState, useEffect } from 'react';
import { SiteDataContext } from '../data/siteDataContext';
import { RecentActivity } from '../types';
import GlobeIcon from './icons/GlobeIcon';
import ZapIcon from './icons/ZapIcon';

const SocialProofToaster: React.FC = () => {
    const { recentActivity } = useContext(SiteDataContext);
    const [currentToast, setCurrentToast] = useState<RecentActivity | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (recentActivity.length === 0) return;

        let intervalId: ReturnType<typeof setInterval>;

        const showNextToast = () => {
            // If a toast is already showing, wait for it to hide
            if (currentToast) return;

            // Get the latest activity that hasn't been shown
            const lastActivity = recentActivity[recentActivity.length-1];

            setCurrentToast(lastActivity);
            setIsVisible(true);

            // Hide the toast after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
                // After fade out animation, clear the current toast
                setTimeout(() => {
                    setCurrentToast(null);
                }, 500);
            }, 5000);
        };
        
        // Start the cycle
        intervalId = setInterval(showNextToast, 7000); // Try to show a new toast every 7 seconds

        return () => clearInterval(intervalId);
    }, [recentActivity, currentToast]);

    if (!currentToast) {
        return null;
    }
    
    const Icon = currentToast.type === 'WEBINAR_SIGNUP' ? GlobeIcon : ZapIcon;

    return (
        <div 
            className={`fixed bottom-6 left-6 z-50 w-full max-w-xs p-4 rounded-lg shadow-2xl bg-slate-800/80 backdrop-blur-lg border border-slate-700
                ${isVisible ? 'animate-toast-in' : 'animate-toast-out'}`
            }
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-slate-100">
                        {currentToast.text}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        a few seconds ago
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SocialProofToaster;