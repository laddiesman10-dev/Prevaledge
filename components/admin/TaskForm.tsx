import React, { useState, useEffect, useContext, useMemo } from 'react';
import type { Task, NewTask, SubTask, Attachment } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';
import { SiteDataContext } from '../../data/siteDataContext';
import { AuthContext } from '../../context/AuthContext';
import TrashIcon from '../icons/TrashIcon';
import LinkIcon from '../icons/LinkIcon';

interface TaskFormProps {
  task: Task | null;
  onSave: (taskData: NewTask, originalTask: Task | null) => void;
  onCancel: () => void;
  onDelete: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, onDelete }) => {
  const { users, projects, tasks, addTask, addNotification } = useContext(SiteDataContext);
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState<NewTask>({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    relatedProject: '',
    subTasks: [],
    attachments: [],
    dependencies: [],
  });
  
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [newAttachment, setNewAttachment] = useState({ name: '', url: '' });
  const [dependencyToAdd, setDependencyToAdd] = useState('');
  const [showNewDepInput, setShowNewDepInput] = useState(false);
  const [newDepTitle, setNewDepTitle] = useState('');
  const [isCreatingDep, setIsCreatingDep] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo || '',
        relatedProject: task.relatedProject || '',
        subTasks: task.subTasks || [],
        attachments: task.attachments || [],
        dependencies: task.dependencies || [],
      });
    } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData({
            title: '',
            description: '',
            status: 'To Do',
            priority: 'Medium',
            dueDate: tomorrow.toISOString().split('T')[0],
            assignedTo: '',
            relatedProject: '',
            subTasks: [],
            attachments: [],
            dependencies: [],
        });
    }
  }, [task]);

  const isUserAdmin = currentUser?.role === 'Admin';

  const canEditAssignee = useMemo(() => {
    if (isUserAdmin) return true; // Admins can always edit
    if (!currentUser) return false; // Not logged in, no edit
    // Editors can edit if the task is unassigned or assigned to them
    return !formData.assignedTo || formData.assignedTo === currentUser.id;
  }, [isUserAdmin, currentUser, formData.assignedTo]);

  const assignableUsers = useMemo(() => {
    if (isUserAdmin) return users;
    if (!currentUser) return [];

    // Start with the current user
    const userList = users.filter(u => u.id === currentUser.id);
    
    // If the task is assigned to someone else, add them to the list so their name is visible in the disabled dropdown
    if (formData.assignedTo && formData.assignedTo !== currentUser.id) {
        const assigned = users.find(u => u.id === formData.assignedTo);
        if (assigned) {
            userList.push(assigned);
        }
    }
    return userList;
  }, [users, currentUser, isUserAdmin, formData.assignedTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // --- Sub-task Handlers ---
  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim() === '') return;
    const newSub: SubTask = {
        id: `sub-${Date.now()}`,
        title: newSubTaskTitle.trim(),
        completed: false,
    };
    setFormData(prev => ({ ...prev, subTasks: [...prev.subTasks, newSub] }));
    setNewSubTaskTitle('');
  };

  const handleToggleSubTask = (index: number) => {
      const updatedSubTasks = [...formData.subTasks];
      updatedSubTasks[index].completed = !updatedSubTasks[index].completed;
      setFormData(prev => ({ ...prev, subTasks: updatedSubTasks }));
  };

  const handleDeleteSubTask = (id: string) => {
      const updatedSubTasks = formData.subTasks.filter(sub => sub.id !== id);
      setFormData(prev => ({ ...prev, subTasks: updatedSubTasks }));
  };

  // --- Attachment Handlers ---
  const handleAddAttachment = () => {
      if (newAttachment.name.trim() === '' || newAttachment.url.trim() === '') return;
      // Basic URL validation
      try {
          new URL(newAttachment.url.trim());
      } catch (_) {
          alert('Please enter a valid URL for the attachment.');
          return;
      }
      
      const newAtt: Attachment = {
          id: `att-${Date.now()}`,
          name: newAttachment.name.trim(),
          url: newAttachment.url.trim(),
      };
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, newAtt] }));
      setNewAttachment({ name: '', url: '' });
  };

  const handleDeleteAttachment = (id: string) => {
      const updatedAttachments = formData.attachments.filter(att => att.id !== id);
      setFormData(prev => ({ ...prev, attachments: updatedAttachments }));
  };

  // --- Dependency Handlers ---
  const handleAddDependency = () => {
      if (dependencyToAdd && !formData.dependencies.includes(dependencyToAdd)) {
          setFormData(prev => ({...prev, dependencies: [...prev.dependencies, dependencyToAdd]}));
      }
      setDependencyToAdd('');
  };

  const handleRemoveDependency = (idToRemove: string) => {
      setFormData(prev => ({...prev, dependencies: prev.dependencies.filter(id => id !== idToRemove)}));
  };

  const handleCreateAndAddDependency = async () => {
    if (newDepTitle.trim() === '') return;
    setIsCreatingDep(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newDependencyTask: NewTask = {
        title: newDepTitle.trim(),
        status: 'To Do',
        priority: 'Medium',
        dueDate: tomorrow.toISOString().split('T')[0],
        subTasks: [],
        attachments: [],
        dependencies: [],
    };
    try {
        const createdTask = await addTask(newDependencyTask);
        if (createdTask) {
            setFormData(prev => ({...prev, dependencies: [...prev.dependencies, createdTask.id]}));
            setNewDepTitle('');
            setShowNewDepInput(false);
        }
    } catch (e) {
        console.error("Failed to create dependency task", e);
        addNotification('Failed to create dependency task. Please try again.', 'error');
    } finally {
        setIsCreatingDep(false);
    }
  };

  const availableTasksForDependency = tasks.filter(t => t.id !== task?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, task);
  };
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 animate-fade-in w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">
                {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            {task && <Button variant="secondary" onClick={() => onDelete(task)} className="!px-4 !py-2 border-red-500/50 text-red-400 hover:bg-red-500/20"><TrashIcon className="w-4 h-4" /></Button>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
            <div>
                <label htmlFor="title" className={labelClass}>Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
            </div>

            {/* Dependencies */}
            <div>
                <label className={labelClass}>Dependencies (tasks that must be completed first)</label>
                <div className="flex gap-2">
                    <select value={dependencyToAdd} onChange={(e) => setDependencyToAdd(e.target.value)} className={`${inputClass} flex-grow`}>
                        <option value="">Select a task to add...</option>
                        {availableTasksForDependency.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    <Button type="button" variant="secondary" onClick={handleAddDependency}>Add</Button>
                    {!showNewDepInput && <Button type="button" variant="secondary" onClick={() => setShowNewDepInput(true)}>Create New</Button>}
                </div>
                 {showNewDepInput && (
                    <div className="mt-2 flex gap-2 p-2 border border-slate-700 rounded-md bg-slate-800/50">
                        <input 
                            type="text" 
                            value={newDepTitle} 
                            onChange={e => setNewDepTitle(e.target.value)}
                            placeholder="New dependency task title..."
                            className={`${inputClass} flex-grow`}
                            autoFocus
                        />
                        <Button type="button" onClick={handleCreateAndAddDependency} disabled={isCreatingDep}>
                            {isCreatingDep ? 'Creating...' : 'Create & Add'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setShowNewDepInput(false)} disabled={isCreatingDep}>Cancel</Button>
                    </div>
                )}
                {formData.dependencies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-md">
                        {formData.dependencies.map(depId => {
                            const depTask = tasks.find(t => t.id === depId);
                            return (
                                <span key={depId} className="flex items-center gap-2 bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">
                                    <LinkIcon className="w-3 h-3"/>
                                    {depTask?.title || 'Unknown Task'}
                                    <button type="button" onClick={() => handleRemoveDependency(depId)} className="text-slate-400 hover:text-white -mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </span>
                            )
                        })}
                    </div>
                )}
            </div>
            
             <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className={inputClass} />
            </div>
            
            {/* Sub-tasks */}
            <div>
                <label className={labelClass}>Sub-tasks</label>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-800/30 p-2 rounded-md">
                    {formData.subTasks.map((sub, index) => (
                        <div key={sub.id} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded">
                            <input type="checkbox" checked={sub.completed} onChange={() => handleToggleSubTask(index)} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"/>
                            <span className={`flex-grow text-sm ${sub.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{sub.title}</span>
                            <button type="button" onClick={() => handleDeleteSubTask(sub.id)} className="text-red-500 hover:text-red-400 flex-shrink-0"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-2">
                    <input type="text" value={newSubTaskTitle} onChange={(e) => setNewSubTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubTask())} placeholder="Add a new sub-task" className={`${inputClass} flex-grow`} />
                    <Button type="button" variant="secondary" onClick={handleAddSubTask}>Add</Button>
                </div>
            </div>

            {/* Attachments */}
            <div>
                <label className={labelClass}>Attachments</label>
                 <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-800/30 p-2 rounded-md">
                    {formData.attachments.map((att) => (
                        <div key={att.id} className="flex items-center justify-between gap-2 bg-slate-800/50 p-2 rounded">
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">{att.name}</a>
                            <button type="button" onClick={() => handleDeleteAttachment(att.id)} className="text-red-500 hover:text-red-400 flex-shrink-0"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 p-2 border border-slate-700 rounded">
                    <input type="text" value={newAttachment.name} onChange={(e) => setNewAttachment({...newAttachment, name: e.target.value})} placeholder="Attachment Name" className={`${inputClass} flex-grow`}/>
                    <input type="url" value={newAttachment.url} onChange={(e) => setNewAttachment({...newAttachment, url: e.target.value})} placeholder="Attachment URL" className={`${inputClass} flex-grow`}/>
                    <Button type="button" variant="secondary" onClick={handleAddAttachment}>Add</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="status" className={labelClass}>Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputClass} required>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className={labelClass}>Priority</label>
                    <select name="priority" id="priority" value={formData.priority} onChange={handleChange} className={inputClass} required>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="assignedTo" className={labelClass}>Assign To</label>
                    <select 
                        name="assignedTo" 
                        id="assignedTo" 
                        value={formData.assignedTo} 
                        onChange={handleChange} 
                        className={`${inputClass} disabled:bg-slate-800 disabled:cursor-not-allowed`}
                        disabled={!canEditAssignee}
                    >
                        <option value="">Unassigned</option>
                        {assignableUsers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                    </select>
                    {!isUserAdmin && (
                        <p className="text-xs text-slate-400 mt-1">
                            {canEditAssignee 
                            ? "You can assign this task to yourself." 
                            : "Only Admins can re-assign tasks from other users."}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="dueDate" className={labelClass}>Due Date</label>
                    <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
             <div>
                <label htmlFor="relatedProject" className={labelClass}>Related Project (Optional)</label>
                <select name="relatedProject" id="relatedProject" value={formData.relatedProject} onChange={handleChange} className={inputClass}>
                    <option value="">None</option>
                    {projects.map(project => <option key={project.slug} value={project.slug}>{project.title}</option>)}
                </select>
            </div>
            
            <div className="flex justify-end gap-4 pt-4 flex-shrink-0">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
            </div>
        </form>
    </div>
  );
};

export default TaskForm;
