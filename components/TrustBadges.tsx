import React from 'react';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import SparklesIcon from './icons/SparklesIcon';
import HeadphonesIcon from './icons/HeadphonesIcon';

const badges = [
  { icon: ShieldCheckIcon, text: 'SSL Secured' },
  { icon: ShieldCheckIcon, text: 'GDPR Compliant' },
  { icon: SparklesIcon, text: 'AI-Powered' },
  { icon: HeadphonesIcon, text: '24/7 Support' },
];

const TrustBadges: React.FC = () => {
  return (
    <div className="bg-slate-950 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-slate-500">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <badge.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
