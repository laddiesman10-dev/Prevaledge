
import React, { useState, useContext, useMemo } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import { useCrudManager } from '../../../hooks/useCrudManager';
import { runHorizonScan } from '../../../services/geminiService';
import type { MarketScanner, NewMarketScanner, ScannerInsight, ScannerInsightType } from '../../../types';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import CrudView from '../ui/CrudView';
import HorizonScannerForm from '../HorizonScannerForm';
import RadarIcon from '../../icons/RadarIcon';
import TrendingUpIcon from '../../icons/TrendingUpIcon';
import UsersIcon from '../../icons/UsersIcon';
import FileTextIcon from '../../icons/FileTextIcon';
import ZapIcon from '../../icons/ZapIcon';
import BrainCircuitIcon from '../../icons/BrainCircuitIcon';

const insightIcons: Record<ScannerInsightType, React.FC<any>> = {
    EMERGING_TREND: TrendingUpIcon,
    COMPETITOR_MOVE: UsersIcon,
    CONTENT_GAP: FileTextIcon,
    OPPORTUNITY: ZapIcon,
};

const InsightCard: React.FC<{ insight: ScannerInsight }> = ({ insight }) => {
    const Icon = insightIcons[insight.type] || RadarIcon;
    return (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 animate-fade-in">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Icon className="w-5 h-5 text-blue-400" />
                {insight.title}
            </h4>
            <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
            <div className="mt-3 pt-3 border-t border-slate-700">
                <h5 className="text-xs font-bold uppercase text-slate-400 mb-1">Suggestion</h5>
                <p className="text-sm text-blue-300">{insight.suggestion}</p>
            </div>
        </div>
    );
};

const HorizonScannerView: React.FC = () => {
    const { marketScanners, clients, addMarketScanner, updateMarketScanner, deleteMarketScanner } = useContext(SiteDataContext);
    const [selectedScannerId, setSelectedScannerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<ScannerInsight[] | null>(null);
    const [error, setError] = useState('');

    const crudHooks = useCrudManager<MarketScanner, NewMarketScanner>(addMarketScanner, updateMarketScanner, deleteMarketScanner);

    const selectedScanner = useMemo(() => marketScanners.find(s => s.id === selectedScannerId), [marketScanners, selectedScannerId]);
    const selectedClient = useMemo(() => clients.find(c => c.id === selectedScanner?.targetClientId), [clients, selectedScanner]);

    const handleRunScan = async () => {
        if (!selectedScanner) return;
        setIsLoading(true);
        setError('');
        setInsights(null);
        try {
            const result = await runHorizonScan(selectedScanner.industry, selectedScanner.competitors);
            setInsights(result);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during the scan.");
        } finally {
            setIsLoading(false);
        }
    };

    if (crudHooks.isFormVisible) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <CrudView<MarketScanner, NewMarketScanner>
                    title="Manage Market Scanners"
                    itemName="scanner"
                    data={marketScanners}
                    columns={[]} 
                    crudHooks={crudHooks}
                    FormComponent={HorizonScannerForm}
                    formItemPropName="scanner"
                    itemTitleAccessor={(item) => item.name}
                />
            </div>
        );
    }

    const columns = [
        { header: 'Scanner Name', accessor: (scanner: MarketScanner) => scanner.name },
        { header: 'Industry', accessor: (scanner: MarketScanner) => scanner.industry },
        { header: 'Client', accessor: (scanner: MarketScanner) => clients.find(c => c.id === scanner.targetClientId)?.company || 'N/A' },
        { header: 'Competitors', accessor: (scanner: MarketScanner) => scanner.competitors.length },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Horizon Scanner</h1>
            
            <div className="bg-blue-900/50 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-4" role="alert">
                <BrainCircuitIcon className="w-8 h-8 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Superpower Unlocked!</h3>
                    <p className="text-sm">You can now run market scans conversationally in <span className="font-semibold">The Strategist</span>. Try asking: "Run a market scan for [Client Name]".</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Scanner Selection & Control */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Select Scanner</h2>
                        <select
                            value={selectedScannerId || ''}
                            onChange={e => setSelectedScannerId(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose a scanner --</option>
                            {marketScanners.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <Button onClick={crudHooks.handleCreateNew} variant="secondary" className="w-full mt-4">Manage Scanners</Button>
                    </div>

                    {selectedScanner && (
                        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-6 animate-fade-in">
                            <h3 className="text-lg font-bold text-white mb-1">{selectedScanner.name}</h3>
                            {selectedClient && <p className="text-sm text-blue-400 mb-3">For: {selectedClient.company}</p>}
                            <p className="text-sm text-slate-400 mb-4"><strong>Industry:</strong> {selectedScanner.industry}</p>
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Competitors Monitored:</h4>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                                {selectedScanner.competitors.map(c => <li key={c} className="truncate">{c}</li>)}
                            </ul>
                            <Button onClick={handleRunScan} disabled={isLoading} className="w-full mt-6">
                                <RadarIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'Scanning...' : 'Run Manual Scan'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Panel: Insights */}
                <div className="lg:col-span-2">
                    <div className="relative bg-slate-900/70 border border-slate-800 rounded-lg p-6 min-h-[60vh]">
                        <h2 className="text-xl font-bold text-white mb-4">Market Insights</h2>
                        {isLoading && <LoadingSpinner />}
                        {error && <div role="alert" className="text-red-400 text-center">{error}</div>}
                        
                        {insights ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {insights.map((insight, index) => <InsightCard key={index} insight={insight} />)}
                            </div>
                        ) : (
                            !isLoading && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 pt-16">
                                    <RadarIcon className="w-16 h-16 mb-4"/>
                                    <p className="text-lg">{selectedScanner ? "Ready to scan for insights." : "Select a scanner to begin."}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HorizonScannerView;
