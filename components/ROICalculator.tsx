
import React, { useState, useEffect, useContext } from 'react';
import { trackEvent } from '../services/analyticsService';
import { SiteDataContext } from '../data/siteDataContext';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import AnimatedMetric from './ui/AnimatedMetric';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

const currencies = [
  { code: 'USD', name: 'United States Dollar' }, { code: 'EUR', name: 'Euro' }, { code: 'JPY', name: 'Japanese Yen' }, { code: 'GBP', name: 'British Pound' }, { code: 'AUD', name: 'Australian Dollar' }, { code: 'CAD', name: 'Canadian Dollar' }, { code: 'CHF', name: 'Swiss Franc' }, { code: 'CNY', name: 'Chinese Yuan' }, { code: 'INR', name: 'Indian Rupee' }, { code: 'BRL', name: 'Brazilian Real' }, { code: 'RUB', name: 'Russian Ruble' }, { code: 'KRW', name: 'South Korean Won' }, { code: 'SGD', name: 'Singapore Dollar' }, { code: 'NOK', name: 'Norwegian Krone' }, { code: 'MXN', name: 'Mexican Peso' }, { code: 'HKD', name: 'Hong Kong Dollar' }, { code: 'NZD', name: 'New Zealand Dollar' }, { code: 'SEK', name: 'Swedish Krona' }, { code: 'ZAR', name: 'South African Rand' }, { code: 'TRY', name: 'Turkish Lira' }, { code: 'PLN', name: 'Polish Złoty' }, { code: 'THB', name: 'Thai Baht' }, { code: 'IDR', name: 'Indonesian Rupiah' }, { code: 'HUF', name: 'Hungarian Forint' }, { code: 'CZK', name: 'Czech Koruna' }, { code: 'ILS', name: 'Israeli New Shekel' }, { code: 'CLP', name: 'Chilean Peso' }, { code: 'PHP', name: 'Philippine Peso' }, { code: 'AED', name: 'UAE Dirham' }, { code: 'COP', name: 'Colombian Peso' }, { code: 'SAR', name: 'Saudi Riyal' }, { code: 'MYR', name: 'Malaysian Ringgit' },
];

interface CalculationResult {
  totalRevenue: number;
  netProfit: number;
  roi: number;
}

const ROICalculator: React.FC = () => {
  const { logAiToolUsage } = useContext(SiteDataContext);
  const [inputs, setInputs] = useState({
    marketingSpend: '5000',
    leadsGenerated: '1000',
    conversionRate: '2.5',
    avgSaleValue: '250',
  });
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [error, setError] = useState('');
  
  const calculateRoi = () => {
    const spend = parseFloat(inputs.marketingSpend);
    const leads = parseFloat(inputs.leadsGenerated);
    const rate = parseFloat(inputs.conversionRate);
    const value = parseFloat(inputs.avgSaleValue);

    if ([spend, leads, rate, value].some(isNaN)) {
      setError('All fields must be valid numbers.');
      setResults(null);
      return;
    }
    if (spend <= 0) {
      setError('Marketing spend must be a positive number.');
      setResults(null);
      return;
    }
    setError('');

    const totalRevenue = leads * (rate / 100) * value;
    const netProfit = totalRevenue - spend;
    const roi = (netProfit / spend) * 100;

    setResults({ totalRevenue, netProfit, roi });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRoi();
    if (!isCalculated) {
      setIsCalculated(true);
      logAiToolUsage('roiCalculator');
      trackEvent('calculate_roi', { category: 'engagement', label: 'ROI calculation performed' });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };
  
  // Live update after first calculation
  useEffect(() => {
    if (isCalculated) {
      const timer = setTimeout(calculateRoi, 300); // Debounce
      return () => clearTimeout(timer);
    }
  }, [inputs, isCalculated, currency]);


  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency,
        maximumFractionDigits: 0, 
      }).format(amount);
    } catch (e) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    }
  };

  const ResultCard: React.FC<{value: number, label: string, isCurrency?: boolean}> = ({ value, label, isCurrency = false }) => {
      const animatedValue = useAnimatedNumber(value);
      const displayValue = isCurrency ? formatCurrency(animatedValue) : `${animatedValue.toFixed(0)}%`;
      return (
          <div className="bg-slate-800/50 p-6 rounded-lg text-center">
              <p className="text-3xl sm:text-4xl font-bold text-blue-400">{displayValue}</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{label}</p>
          </div>
      );
  };


  return (
    <section id="roi-calculator" className="relative" aria-labelledby="roi-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="A powerful tool to forecast the potential Return On Investment from your marketing activities based on key business metrics.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="roi-heading" className="text-4xl font-bold mb-4">
          Marketing <span className="text-blue-400">ROI Calculator</span>
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Forecast the profitability of your marketing campaigns. Adjust the sliders and inputs to see how key metrics impact your bottom line.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/70 border border-slate-800 rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 items-end">
             {/* Inputs */}
            <div><label htmlFor="marketingSpend" className="block text-sm font-medium text-slate-300 mb-2">Marketing Spend</label><input type="number" name="marketingSpend" id="marketingSpend" value={inputs.marketingSpend} onChange={handleInputChange} className={inputClasses} placeholder="e.g., 5000" /></div>
            <div><label htmlFor="leadsGenerated" className="block text-sm font-medium text-slate-300 mb-2">Leads Generated</label><input type="number" name="leadsGenerated" id="leadsGenerated" value={inputs.leadsGenerated} onChange={handleInputChange} className={inputClasses} placeholder="e.g., 1000" /></div>
            <div><label htmlFor="avgSaleValue" className="block text-sm font-medium text-slate-300 mb-2">Avg. Sale Value</label><input type="number" name="avgSaleValue" id="avgSaleValue" value={inputs.avgSaleValue} onChange={handleInputChange} className={inputClasses} placeholder="e.g., 250" /></div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
              <select id="currency" name="currency" value={currency} onChange={e => setCurrency(e.target.value)} className={`${inputClasses} h-[50px]`}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
              </select>
            </div>
          </div>
           {/* Slider */}
          <div className="mb-8">
            <label htmlFor="conversionRate" className="block text-sm font-medium text-slate-300 mb-2">Lead to Customer Conversion Rate: <span className="font-bold text-blue-400">{inputs.conversionRate}%</span></label>
            <input type="range" id="conversionRate" name="conversionRate" min="0.1" max="100" step="0.1" value={inputs.conversionRate} onChange={handleInputChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          </div>

          {!isCalculated && <div className="text-center"><Button type="submit">Calculate ROI</Button></div>}
          {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        </form>

        {isCalculated && results && (
          <div className="mt-8 pt-8 border-t border-slate-700 animate-fade-in">
             <h3 className="text-2xl font-bold text-center text-white mb-6">Your Estimated Results</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResultCard value={results.totalRevenue} label="Total Revenue" isCurrency />
                <ResultCard value={results.netProfit} label="Net Profit" isCurrency />
                <ResultCard value={results.roi} label="Return on Investment" />
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ROICalculator;