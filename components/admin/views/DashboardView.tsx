import React, { useContext, useMemo, useState, useEffect } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import { AuthContext } from '../../../context/AuthContext';
import FileTextIcon from '../../icons/FileTextIcon';
import AgentIcon from '../../icons/AgentIcon';
import ProjectIcon from '../../icons/ProjectIcon';
import TestimonialIcon from '../../icons/MessageSquareIcon';
import InboxIcon from '../../icons/InboxIcon';
import type { AdminView, Task, ContactSubmission } from '../../../types';
import ClipboardListIcon from '../../icons/ClipboardListIcon';
import AlertTriangleIcon from '../../icons/AlertTriangleIcon';
import Button from '../../ui/Button';
import MyTasksWidget from '../widgets/MyTasksWidget';
import GraduationCapIcon from '../../icons/GraduationCapIcon';
import UsersIcon from '../../icons/UsersIcon';
import EyeIcon from '../../icons/EyeIcon';
import SubmissionDetailsModal from '../ui/SubmissionDetailsModal';
import { generateMorningBriefing } from '../../../services/geminiService';
import MorningBriefingWidget from '../widgets/MorningBriefingWidget';


const StatCard: React.FC<{ title: string; value: number; icon: React.FC<any> }> = ({ title, value, icon: Icon }) => (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-6 flex flex-col text-center sm:flex-row sm:text-left items-center gap-6">
        <div className="bg-slate-800 p-4 rounded-full flex-shrink-0">
            <Icon className="w-8 h-8 text-blue-400" />
        </div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

interface DashboardViewProps {
  setActiveView: (view: AdminView) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
  const { blogPosts, services, projects, testimonials, contactSubmissions, tasks, webinarSignups, jobOpenings, jobApplications } = useContext(SiteDataContext);
  const { currentUser } = useContext(AuthContext);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(true);
    
  useEffect(() => {
    const fetchBriefing = async () => {
        setIsBriefingLoading(true);
        try {
            const briefingText = await generateMorningBriefing(tasks, projects, contactSubmissions);
            setBriefing(briefingText);
        } catch (error) {
            console.error("Failed to generate morning briefing:", error);
            setBriefing(null);
        } finally {
            setIsBriefingLoading(false);
        }
    };
    fetchBriefing();
  }, [tasks, projects, contactSubmissions]);

  const overdueTasks = useMemo(() => tasks.filter(
    task => new Date(task.dueDate) < new Date() && task.status !== 'Done'
  ), [tasks]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      <MorningBriefingWidget briefing={briefing} isLoading={isBriefingLoading} />

      {overdueTasks.length > 0 && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative mb-6 flex items-center justify-between gap-4 animate-fade-in" role="alert">
            <div className="flex items-center">
                <AlertTriangleIcon className="w-6 h-6 mr-3"/>
                <span className="block sm:inline font-semibold">
                    Warning: You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}.
                </span>
            </div>
            <Button onClick={() => setActiveView('tasks')} className="!px-4 !py-1 !text-sm bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30">
                View Tasks
            </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Blog Posts" value={blogPosts.length} icon={FileTextIcon} />
        <StatCard title="Portfolio Projects" value={projects.length} icon={ProjectIcon} />
        <StatCard title="Active Tasks" value={tasks.filter(t => t.status !== 'Done').length} icon={ClipboardListIcon} />
        <StatCard title="Job Openings" value={jobOpenings.length} icon={GraduationCapIcon} />
        <StatCard title="Job Applications" value={jobApplications.length} icon={UsersIcon} />
        <StatCard title="Total Services" value={services.length} icon={AgentIcon} />
        <StatCard title="Contact Submissions" value={contactSubmissions.length} icon={InboxIcon} />
        <StatCard title="Testimonials" value={testimonials.length} icon={TestimonialIcon} />
      </div>

       <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Recent Contact Submissions</h2>
                {contactSubmissions.length > 0 && (
                    <button 
                        onClick={() => setActiveView('analytics')} 
                        className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        View All &rarr;
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">AI Insight</th>
                            <th scope="col" className="px-6 py-3">Message</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactSubmissions.length > 0 ? (
                            contactSubmissions.slice(0, 5).map(submission => (
                                <tr key={submission.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{submission.name}</th>
                                    <td className="px-6 py-4 whitespace-nowrap">{submission.submittedAt.toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        {submission.isAnalyzing ? (
                                            <span className="text-xs text-slate-400 italic">Analyzing...</span>
                                        ) : (
                                            <span className="text-xs font-semibold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full">
                                                {submission.inquiryType || 'N/A'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-sm">
                                        <p className="line-clamp-2">{submission.message}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedSubmission(submission)} className="text-blue-400 hover:text-blue-300" aria-label={`View submission from ${submission.name}`}>
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-slate-500">
                                    No recent submissions.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <MyTasksWidget setActiveView={setActiveView} />

      </div>
      <SubmissionDetailsModal 
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
};

export default DashboardView;