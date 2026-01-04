import React, { useState, useMemo, useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { JobApplication } from '../../../types';
import { inputClass } from '../ui/formStyles';
import EyeIcon from '../../icons/EyeIcon';
import ApplicationDetailsModal from '../ApplicationDetailsModal';

const JobApplicationsView: React.FC = () => {
    const { jobApplications } = useContext(SiteDataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

    const filteredApplications = useMemo(() => {
        return jobApplications
            .filter(app => {
                if (searchTerm.trim() === '') return true;
                const lowerSearch = searchTerm.toLowerCase();
                return (
                    app.name.toLowerCase().includes(lowerSearch) ||
                    app.email.toLowerCase().includes(lowerSearch) ||
                    app.jobTitle.toLowerCase().includes(lowerSearch)
                );
            })
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }, [jobApplications, searchTerm]);


    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Job Applications</h1>

            <div className="mb-6 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or job title..."
                    className={inputClass}
                />
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Applicant Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Applied For</th>
                                <th scope="col" className="px-6 py-3">Date Submitted</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map(app => (
                                    <tr key={app.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{app.name}</th>
                                        <td className="px-6 py-4">{app.email}</td>
                                        <td className="px-6 py-4">{app.jobTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(app.submittedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedApplication(app)} className="text-blue-400 hover:text-blue-300" aria-label={`View application from ${app.name}`}>
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-slate-500">
                                        No applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ApplicationDetailsModal 
                application={selectedApplication} 
                onClose={() => setSelectedApplication(null)} 
            />
        </div>
    );
};

export default JobApplicationsView;