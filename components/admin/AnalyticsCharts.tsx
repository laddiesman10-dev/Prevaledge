

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { AIToolName, AIToolUsage, ContactSubmission } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsChartsProps {
  aiToolUsage: AIToolUsage[];
  contactSubmissions: ContactSubmission[];
}

const toolFriendlyNames: Record<AIToolName, string> = {
  strategyGenerator: 'Strategy Generator',
  websiteAnalyzer: 'Website Analyzer',
  adCopyGenerator: 'Ad Copy Generator',
  blogIdeaGenerator: 'Blog Idea Generator',
  keywordClusterGenerator: 'Keyword Cluster Gen.',
  socialPostGenerator: 'Social Post Generator',
  roiCalculator: 'ROI Calculator',
  competitorSnapshot: 'Competitor Snapshot',
  seoContentGrader: 'SEO Content Grader',
  nicheNavigator: 'Niche Navigator',
  articleDrafter: 'Article Drafter',
  clientProspectAnalyzer: 'Prospect Analyzer',
  contentBriefGenerator: 'Content Brief Gen.',
  leadGenNurture: 'Lead Gen & Nurture',
};

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ aiToolUsage, contactSubmissions }) => {

  const submissionsByType = contactSubmissions.reduce((acc, submission) => {
    const type = submission.inquiryType || 'General Inquiry';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const submissionData = (Object.entries(submissionsByType) as [string, number][])
    .sort(([, countA], [, countB]) => Number(countB) - Number(countA))
    .slice(0, 5);
  
  const maxSubmissionCount = submissionData.length > 0 ? submissionData[0][1] : 1; // Use 1 to prevent division by zero

  const usageCounts = aiToolUsage.reduce((acc, usage) => {
    acc[usage.toolName] = (acc[usage.toolName] || 0) + 1;
    return acc;
  }, {} as Record<AIToolName, number>);
  
  const sortedTools = Object.entries(usageCounts)
    .sort(([, countA], [, countB]) => Number(countB) - Number(countA))
    .slice(0, 7);
    
  const toolChartData = {
    labels: sortedTools.map(([toolName]) => toolFriendlyNames[toolName as AIToolName]),
    datasets: [
      {
        label: 'Tool Usage',
        data: sortedTools.map(([, count]) => count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { ticks: { color: '#94a3b8' } },
      x: { ticks: { color: '#94a3b8' } },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* AI Tool Usage Chart */}
      <div className="lg:col-span-3 bg-slate-900/70 border border-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Most Used AI Tools</h2>
        <div className="h-96">
          <Bar options={chartOptions} data={toolChartData} />
        </div>
      </div>

      {/* Inquiry Type Breakdown */}
      <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Inquiry Types Breakdown</h2>
        <div className="space-y-4">
          {submissionData.length > 0 ? (
            submissionData.map(([type, count]) => (
              <div key={type} className="flex items-center">
                <div className="w-40 text-sm text-slate-300 truncate">{type}</div>
                <div className="flex-1 bg-slate-800 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full" 
                    style={{ width: `${(count / maxSubmissionCount) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm font-semibold">{count}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-10">No submission data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;