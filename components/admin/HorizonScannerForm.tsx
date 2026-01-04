import React, { useState, useEffect, useContext } from 'react';
import type { MarketScanner, NewMarketScanner } from '../../types';
import { SiteDataContext } from '../../data/siteDataContext';
import Button from '../ui/Button';
import { inputClass, labelClass } from './ui/formStyles';

interface HorizonScannerFormProps {
  scanner: MarketScanner | null;
  onSave: (scannerData: NewMarketScanner, originalItem: MarketScanner | null) => void;
  onCancel: () => void;
}

const HorizonScannerForm: React.FC<HorizonScannerFormProps> = ({ scanner, onSave, onCancel }) => {
  const { clients } = useContext(SiteDataContext);
  const [formData, setFormData] = useState<NewMarketScanner>({
    name: '',
    targetClientId: '',
    industry: '',
    competitors: [],
  });
  const [competitorsString, setCompetitorsString] = useState('');

  useEffect(() => {
    if (scanner) {
      setFormData({
        name: scanner.name,
        targetClientId: scanner.targetClientId,
        industry: scanner.industry,
        competitors: scanner.competitors,
      });
      setCompetitorsString(scanner.competitors.join('\n'));
    }
  }, [scanner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'competitors') {
        setCompetitorsString(value);
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        competitors: competitorsString.split('\n').map(s => s.trim()).filter(Boolean),
    };
    onSave(finalData, scanner);
  };
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">
            {scanner ? 'Edit Market Scanner' : 'Create New Market Scanner'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className={labelClass}>Scanner Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required placeholder="e.g., SaaS Market Watch" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="targetClientId" className={labelClass}>Client Focus</label>
                    <select name="targetClientId" id="targetClientId" value={formData.targetClientId} onChange={handleChange} className={inputClass} required>
                        <option value="">Select a Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="industry" className={labelClass}>Industry / Market</label>
                    <input type="text" name="industry" id="industry" value={formData.industry} onChange={handleChange} className={inputClass} required placeholder="e.g., B2B Data Analytics"/>
                </div>
            </div>
            <div>
                <label htmlFor="competitors" className={labelClass}>Competitors (one URL per line)</label>
                <textarea name="competitors" id="competitors" rows={4} value={competitorsString} onChange={handleChange} className={inputClass} required placeholder="https://www.competitor1.com&#10;https://www.competitor2.com"/>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{scanner ? 'Save Changes' : 'Create Scanner'}</Button>
            </div>
        </form>
    </div>
  );
};

export default HorizonScannerForm;