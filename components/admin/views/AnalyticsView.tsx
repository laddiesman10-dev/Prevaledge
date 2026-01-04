import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import AnalyticsCharts from '../AnalyticsCharts';

const AnalyticsView: React.FC = () => {
  const { aiToolUsage, contactSubmissions } = useContext(SiteDataContext);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Analytics & Insights</h1>

      <AnalyticsCharts 
        aiToolUsage={aiToolUsage} 
        contactSubmissions={contactSubmissions} 
      />
    </div>
  );
};

export default AnalyticsView;
