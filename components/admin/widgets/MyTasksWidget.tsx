import React, { useContext, useMemo, useState } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import { AuthContext } from '../../../context/AuthContext';
import type { AdminView, Task } from '../../../types';
import LoadingSpinner from '../../ui/LoadingSpinner';
import CheckCircleIcon from '../../icons/CheckCircleIcon';

interface MyTasksWidgetProps {
  setActiveView: (view: AdminView) => void;
}

const MyTasksWidget: React.FC<MyTasksWidgetProps> = ({ setActiveView }) => {
    const { tasks, projects, updateTask, addNotification } = useContext(SiteDataContext);
    const { currentUser } = useContext(AuthContext);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    const myOpenTasks = useMemo(() => {
        if (!currentUser) return [];
        const priorityMap: Record<Task['priority'], number> = { High: 3, Medium: 2, Low: 1 };
        
        return tasks
            .filter(task => task.assignedTo === currentUser.id && task.status !== 'Done')
            .sort((a, b) => {
                // Sort by priority first (desc), then due date (asc)
                const priorityComparison = priorityMap[b.priority] - priorityMap[a.priority];
                if (priorityComparison !== 0) return priorityComparison;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
    }, [tasks, currentUser]);

    const handleToggleStatus = async (task: Task) => {
        if (updatingTaskId) return;
        setUpdatingTaskId(task.id);
        try {
            await updateTask(task.id, { status: 'Done' });
            addNotification(`Task "${task.title}" marked as complete!`, 'success');
        } catch (error) {
            addNotification('Failed to update task status.', 'error');
        } finally {
            setUpdatingTaskId(null);
        }
    };
    
    const priorityClasses: Record<Task['priority'], string> = {
        High: 'bg-red-500',
        Medium: 'bg-yellow-500',
        Low: 'bg-blue-500',
    };

    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg">
            <div className="p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">My Tasks</h2>
                <button 
                    onClick={() => setActiveView('tasks')} 
                    className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                    View All &rarr;
                </button>
            </div>
            <div className="px-6 pb-6">
                {myOpenTasks.length > 0 ? (
                    <ul className="space-y-3">
                        {myOpenTasks.slice(0, 5).map(task => {
                            const isTaskOverdue = new Date(task.dueDate) < new Date();
                            const project = projects.find(p => p.slug === task.relatedProject);
                            const isUpdating = updatingTaskId === task.id;
                            
                            return (
                                <li key={task.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-md transition-colors hover:bg-slate-800">
                                    <div className="flex-shrink-0">
                                        {isUpdating ? (
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <input 
                                                type="checkbox"
                                                checked={false}
                                                onChange={() => handleToggleStatus(task)}
                                                className="w-5 h-5 bg-slate-700 border-slate-600 rounded text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-800"
                                                aria-label={`Mark task ${task.title} as complete`}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-grow overflow-hidden" onClick={() => setActiveView('tasks')}>
                                        <p className="font-semibold text-white truncate cursor-pointer">{task.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            {project && <span className="truncate">{project.title}</span>}
                                            {project && <span>&bull;</span>}
                                            <span className={`font-medium ${isTaskOverdue ? 'text-red-400' : ''}`}>
                                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div 
                                        className={`w-3 h-3 rounded-full flex-shrink-0 ${priorityClasses[task.priority]}`}
                                        title={`Priority: ${task.priority}`}
                                    ></div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-10">
                        <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-slate-400">You have no open tasks. Great job!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasksWidget;