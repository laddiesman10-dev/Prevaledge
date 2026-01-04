import React, { useState, useContext, useMemo } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import { AuthContext } from '../../../context/AuthContext';
import type { Task, NewTask } from '../../../types';
import Button from '../../ui/Button';
import PlusIcon from '../../icons/PlusIcon';
import TaskCard from '../TaskCard';
import TaskForm from '../TaskForm';
import LoadingSpinner from '../../ui/LoadingSpinner';
import SortAscendingIcon from '../../icons/SortAscendingIcon';
import SortDescendingIcon from '../../icons/SortDescendingIcon';
import ProjectTimelineChart from '../ProjectTimelineChart';
import LayoutGridIcon from '../../icons/LayoutGridIcon';
import AlignLeftIcon from '../../icons/AlignLeftIcon';


type Status = 'To Do' | 'In Progress' | 'Done';
const statuses: Status[] = ['To Do', 'In Progress', 'Done'];
type ViewMode = 'board' | 'timeline';

interface EnhancedTask extends Task {
    isBlocked: boolean;
}

const TaskManagementView: React.FC = () => {
    const { tasks, users, addTask, updateTask, deleteTask, addNotification } = useContext(SiteDataContext);
    const { currentUser } = useContext(AuthContext);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('board');

    // Sorting state
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Drag and Drop state
    const [draggedTask, setDraggedTask] = useState<EnhancedTask | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<Status | null>(null);

    const enhancedTasks = useMemo(() => {
        const taskStatusMap = new Map(tasks.map(t => [t.id, t.status]));
        return tasks.map(task => ({
            ...task,
            isBlocked: task.dependencies.some(depId => taskStatusMap.get(depId) !== 'Done')
        }));
    }, [tasks]);

    const sortedTasks = useMemo(() => {
        const priorityMap: Record<Task['priority'], number> = { High: 3, Medium: 2, Low: 1 };
        
        return [...enhancedTasks].sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'dueDate') {
                comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else if (sortBy === 'priority') {
                comparison = priorityMap[b.priority] - priorityMap[a.priority]; // High to Low is natural, so reverse for 'asc'
            } else if (sortBy === 'createdAt') {
                comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [enhancedTasks, sortBy, sortDirection]);

    const tasksByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status] = sortedTasks.filter(task => task.status === status);
            return acc;
        }, {} as Record<Status, EnhancedTask[]>);
    }, [sortedTasks]);

    const handleCreateNew = () => {
        setEditingTask(null);
        setIsFormVisible(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormVisible(true);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingTask(null);
    };
    
    const handleDelete = async (task: Task) => {
        if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
            setIsLoading(true);
            await deleteTask(task.id);
            setIsLoading(false);
            handleCancel();
        }
    }

    const handleSave = async (taskData: NewTask, originalTask: Task | null) => {
        setIsLoading(true);
        if (originalTask) {
            await updateTask(originalTask.id, taskData);
        } else {
            await addTask(taskData);
        }
        setIsLoading(false);
        handleCancel();
    };
    
    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: EnhancedTask) => {
        if (task.isBlocked) {
            e.preventDefault();
            return;
        }
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== status) {
            setDragOverStatus(status);
        }
    };

    const handleDragLeave = () => {
        setDragOverStatus(null);
    };

    const handleDrop = async (status: Status) => {
        if (draggedTask && draggedTask.status !== status) {
            if (draggedTask.isBlocked && status !== 'To Do') {
                addNotification('This task is blocked by its dependencies and cannot be started.', 'warning');
            } else {
                setIsLoading(true);
                await updateTask(draggedTask.id, { status });
                setIsLoading(false);
            }
        }
        setDraggedTask(null);
        setDragOverStatus(null);
    };


    return (
        <div className="p-4 sm:p-6 lg:p-8 relative h-full flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Task Management</h1>
                <div className="flex items-center gap-4 flex-wrap">
                     <div className="bg-slate-800 border border-slate-700 rounded-md p-1 flex items-center">
                        <button onClick={() => setViewMode('board')} className={`px-2 py-1 rounded-md text-sm flex items-center gap-2 ${viewMode === 'board' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}><LayoutGridIcon className="w-4 h-4" /> Board</button>
                        <button onClick={() => setViewMode('timeline')} className={`px-2 py-1 rounded-md text-sm flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}><AlignLeftIcon className="w-4 h-4" /> Timeline</button>
                    </div>
                    {viewMode === 'board' && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-by" className="text-sm font-medium text-slate-400">Sort by:</label>
                            <select 
                                id="sort-by" 
                                value={sortBy} 
                                onChange={e => setSortBy(e.target.value as any)} 
                                className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                                <option value="createdAt">Creation Date</option>
                            </select>
                            <button 
                                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')} 
                                className="p-1.5 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700"
                                aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                            >
                                {sortDirection === 'asc' ? <SortAscendingIcon className="w-4 h-4" /> : <SortDescendingIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    )}
                    <Button onClick={handleCreateNew}>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create New Task
                    </Button>
                </div>
            </div>

            {viewMode === 'board' ? (
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statuses.map(status => (
                        <div 
                            key={status}
                            onDragOver={(e) => handleDragOver(e, status)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(status)}
                            className={`bg-slate-900/50 rounded-lg p-4 transition-colors duration-300 flex flex-col ${dragOverStatus === status ? 'bg-blue-900/50' : ''}`}
                        >
                            <h2 className="text-xl font-semibold text-white mb-4 border-b-2 border-slate-700 pb-2 flex justify-between items-center flex-shrink-0">
                                <span>{status}</span>
                                <span className="text-sm bg-slate-700 text-slate-300 rounded-full w-6 h-6 flex items-center justify-center">{tasksByStatus[status].length}</span>
                            </h2>
                            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                                {tasksByStatus[status].map(task => (
                                    <TaskCard 
                                        key={task.id} 
                                        task={task}
                                        isBlocked={task.isBlocked}
                                        users={users} 
                                        currentUser={currentUser}
                                        onClick={() => handleEdit(task)}
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        isDragging={draggedTask?.id === task.id}
                                    />
                                ))}
                                {dragOverStatus === status && (
                                    <div className="h-24 border-2 border-dashed border-blue-500 rounded-lg bg-blue-900/30"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow bg-slate-900/50 rounded-lg p-4">
                    <ProjectTimelineChart tasks={tasks} />
                </div>
            )}


            {isFormVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleCancel}>
                    <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl">
                        <TaskForm 
                            task={editingTask} 
                            onSave={handleSave} 
                            onCancel={handleCancel}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            )}
             {isLoading && <LoadingSpinner size="lg" />}
        </div>
    );
};

export default TaskManagementView;