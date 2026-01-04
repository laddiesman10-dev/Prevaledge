import React from 'react';
import BrainCircuitIcon from '../../icons/BrainCircuitIcon';
import { renderMarkdownContent } from '../../../utils/formatContent';

interface MorningBriefingWidgetProps {
    briefing: string | null;
    isLoading: boolean;
}

const MorningBriefingWidget: React.FC<MorningBriefingWidgetProps> = ({ briefing, isLoading }) => {
    return (
        <div className="bg-blue-900/50 border border-blue-500/50 text-blue-200 px-6 py-4 rounded-lg relative mb-6 animate-fade-in" role="alert">
            <div className="flex items-start gap-4">
                <BrainCircuitIcon className="w-8 h-8 flex-shrink-0 mt-1 text-blue-300" />
                <div>
                    <h3 className="font-bold text-lg text-white">Your Morning Briefing</h3>
                    {isLoading && <p className="text-sm">Analyzing agency data for critical insights...</p>}
                    {briefing && (
                        <div className="prose prose-sm prose-invert max-w-none text-blue-200 mt-2">
                            {renderMarkdownContent(briefing)}
                        </div>
                    )}
                    {!isLoading && !briefing && <p className="text-sm">Could not generate briefing at this time.</p>}
                </div>
            </div>
        </div>
    );
};

export default MorningBriefingWidget;
