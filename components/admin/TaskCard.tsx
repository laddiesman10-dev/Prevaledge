import React from 'react';
import type { Task, User } from '../../types';
import PaperclipIcon from '../icons/PaperclipIcon';
import CheckSquareIcon from '../icons/CheckSquareIcon';
import LinkIcon from '../icons/LinkIcon';
import LockIcon from '../icons/LockIcon';

interface TaskCardProps {
    task: Task;
    users: User[];
    currentUser: User | null;
    onClick: () => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    isDragging: boolean;
    isBlocked: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, users, currentUser, onClick, onDragStart, isDragging, isBlocked }) => {
    
    const assignedMember = users.find(m => m.id === task.assignedTo);
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
    const isAssignedToMe = currentUser ? task.assignedTo === currentUser.id : false;
    
    const priorityClasses: Record<Task['priority'], string> = {
        High: 'bg-red-500/20 text-red-300 border-red-500/50',
        Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        Low: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    const completedSubTasks = task.subTasks?.filter(st => st.completed).length || 0;
    const totalSubTasks = task.subTasks?.length || 0;
    const attachmentCount = task.attachments?.length || 0;
    const dependencyCount = task.dependencies?.length || 0;

    return (
        <div
            draggable={!isBlocked}
            onDragStart={onDragStart}
            onClick={onClick}
            className={`
                bg-slate-800 p-4 rounded-lg border border-slate-700 relative
                transition-all duration-200
                ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''}
                ${isBlocked 
                    ? 'opacity-60 cursor-not-allowed bg-slate-800/50' 
                    : 'cursor-pointer hover:border-blue-500 hover:-translate-y-1'
                }
                ${isAssignedToMe && !isBlocked ? 'ring-2 ring-blue-400/70' : ''}
            `}
        >
            {isBlocked && (
                <div className="absolute top-3 right-3" title="This task is blocked by other tasks">
                    <LockIcon className="w-5 h-5 text-yellow-400" />
                </div>
            )}
            <h3 className="font-semibold text-white mb-2 pr-8">{task.title}</h3>
            
            <div className="flex justify-between items-center text-xs">
                <span className={`px-2 py-0.5 rounded-full font-medium border ${priorityClasses[task.priority]}`}>
                    {task.priority}
                </span>
                <span className={`font-semibold ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    {dependencyCount > 0 && (
                        <span className="flex items-center gap-1.5" title={`${dependencyCount} dependencies`}>
                            <LinkIcon className="w-4 h-4 text-slate-500" />
                            <span>{dependencyCount}</span>
                        </span>
                    )}
                    {totalSubTasks > 0 && (
                        <span className="flex items-center gap-1.5" title={`${completedSubTasks} of ${totalSubTasks} sub-tasks completed`}>
                            <CheckSquareIcon className={`w-4 h-4 ${completedSubTasks === totalSubTasks && totalSubTasks > 0 ? 'text-green-400' : 'text-slate-500'}`} />
                            <span>{completedSubTasks}/{totalSubTasks}</span>
                        </span>
                    )}
                    {attachmentCount > 0 && (
                        <span className="flex items-center gap-1.5" title={`${attachmentCount} attachments`}>
                            <PaperclipIcon className="w-4 h-4 text-slate-500" />
                            <span>{attachmentCount}</span>
                        </span>
                    )}
                </div>
                {assignedMember && (
                    <div title={assignedMember.name} className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {getInitials(assignedMember.name)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;