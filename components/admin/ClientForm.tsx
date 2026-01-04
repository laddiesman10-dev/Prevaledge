import React, { useState, useEffect } from 'react';
import type { Client, NewClient } from '../../types';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';

interface ClientFormProps {
  client: Client | null;
  onSave: (clientData: NewClient, originalItem: Client | null) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewClient>({
    name: '',
    company: '',
    email: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        company: client.company,
        email: client.email,
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, client);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {client ? 'Edit Client' : 'Create New Client'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Contact Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="company" className={labelClass}>Company Name</label>
                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="email" className={labelClass}>Contact Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{client ? 'Save Changes' : 'Create Client'}</Button>
            </div>
        </form>
    </div>
  );
};

export default ClientForm;