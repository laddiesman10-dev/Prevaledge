import React, { useState, useEffect } from 'react';
import type { User, NewUser, Permission, AdminView } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';

interface UserFormProps {
  user: User | null;
  currentUser: User | null;
  onSave: (userData: Partial<NewUser>, originalItem: User | null) => void;
  onCancel: () => void;
}

const allPermissions: { group: string; permissions: { id: Permission; label: string }[] }[] = [
    { group: 'Overview', permissions: [{ id: 'analytics', label: 'Analytics' }] },
    { group: 'AI & Strategy', permissions: [{ id: 'strategist', label: 'The Strategist (Text)' }, { id: 'liveStrategist', label: 'Live Strategist (Voice)' }, { id: 'horizonScanner', label: 'Horizon Scanner' }] },
    { group: 'Operations', permissions: [{ id: 'tasks', label: 'Task Management' }, { id: 'clients', label: 'Client Management' }, { id: 'invoicing', label: 'Invoice Generator' }, { id: 'quotations', label: 'Quote Generator' }, { id: 'documentHistory', label: 'Document History' }] },
    { group: 'Content & Site', permissions: [{ id: 'blog', label: 'Manage Blog' }, { id: 'projects', label: 'Manage Projects' }, { id: 'services', label: 'Manage Services' }, { id: 'pricing', label: 'Manage Pricing' }, { id: 'testimonials', label: 'Manage Testimonials' }, { id: 'socials', label: 'Manage Socials' }] },
];

const UserForm: React.FC<UserFormProps> = ({ user, currentUser, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    title: '',
    bio: '',
    email: '',
    role: 'Editor',
    permissions: [],
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        title: user.title,
        bio: user.bio,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      });
      setPassword('');
      setConfirmPassword('');
    } else {
      setFormData({
        name: '',
        title: '',
        bio: '',
        email: '',
        role: 'Editor',
        permissions: [],
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
      setFormData(prev => {
          const currentPermissions = prev.permissions || [];
          if (isChecked) {
              return { ...prev, permissions: [...currentPermissions, permission] };
          } else {
              return { ...prev, permissions: currentPermissions.filter(p => p !== permission) };
          }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!user && !password) {
        setError('Password is required for new users.');
        return;
    }

    const dataToSave: Partial<NewUser> = { ...formData };
    if (password) {
      dataToSave.password = password;
    }

    onSave(dataToSave, user);
  };
  
  const canManagePermissions = currentUser?.role === 'Admin' && formData.role === 'Editor';

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {user ? 'Edit User' : 'Create New User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Full Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="title" className={labelClass}>Job Title</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="bio" className={labelClass}>Biography</label>
                <textarea name="bio" id="bio" rows={3} value={formData.bio} onChange={handleChange} className={inputClass} required />
            </div>
            
            <fieldset className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4 space-y-4">
                <legend className="text-lg font-semibold text-white px-2">Account Credentials & Role</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className={labelClass}>Email Address (for login)</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                        <label htmlFor="role" className={labelClass}>Role</label>
                        <select name="role" id="role" value={formData.role} onChange={handleChange} className={inputClass} required disabled={currentUser?.id === user?.id}>
                            <option value="Editor">Editor</option>
                            <option value="Admin">Admin</option>
                        </select>
                         {currentUser?.id === user?.id && <p className="text-xs text-slate-400 mt-1">You cannot change your own role.</p>}
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder={user ? "Leave blank to keep unchanged" : "Required"} autoComplete="new-password"/>
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Confirm new password" />
                    </div>
                </div>
            </fieldset>

            {canManagePermissions && (
                 <fieldset className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4 space-y-4">
                    <legend className="text-lg font-semibold text-white px-2">Permissions</legend>
                    <p className="text-sm text-slate-400 -mt-2 px-2">Select which sections this editor can access.</p>
                    {allPermissions.map(group => (
                        <div key={group.group}>
                            <h4 className="font-semibold text-slate-300 mb-2">{group.group}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pl-2">
                                {group.permissions.map(perm => (
                                    <div key={perm.id} className="flex items-center">
                                        <input
                                            id={`perm-${perm.id}`}
                                            type="checkbox"
                                            checked={formData.permissions?.includes(perm.id)}
                                            onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor={`perm-${perm.id}`} className="ml-3 block text-sm font-medium text-slate-300">
                                            {perm.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                 </fieldset>
            )}

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{user ? 'Save Changes' : 'Create User'}</Button>
            </div>
        </form>
    </div>
  );
};

export default UserForm;