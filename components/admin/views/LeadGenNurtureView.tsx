import React, { useState } from 'react';
import Button from '../../ui/Button';
import { useAITool } from '../../../hooks/useAITool';
import { useFormValidation, Validators } from '../../../hooks/useFormValidation';
import Card from '../../ui/Card';
import type { ClientProspectAnalysisResult, SolutionStep, TechnicalSeoAudit, RoiAnalysis, SocialPlatformAnalysis } from '../../../types';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import XCircleIcon from '../../icons/XCircleIcon';
import TrendingUpIcon from '../../icons/TrendingUpIcon';
import AlertTriangleIcon from '../../icons/AlertTriangleIcon';
import UserIcon from '../../icons/UserIcon';
import ClipboardListIcon from '../../icons/ClipboardListIcon';
import MailIcon from '../../icons/MailIcon';
import CopyIcon from '../../icons/CopyIcon';
import CheckIcon from '../../icons/CheckIcon';
import SparklesIcon from '../../icons/SparklesIcon';
import { analyzeClientProspect, findProspects } from '../../../services/geminiService';
import type { FoundProspect, IdealCustomerProfile } from '../../../services/geminiService';
import { inputClass, labelClass } from '../ui/formStyles';
import LinkedInIcon from '../../icons/LinkedInIcon';
import TwitterIcon from '../../icons/TwitterIcon';
import InstagramIcon from '../../icons/InstagramIcon';
import FacebookIcon from '../../icons/FacebookIcon';
import PrintIcon from '../../icons/PrintIcon';
import ScoreGauge from '../../ScoreGauge';
import LinkIcon from '../../icons/LinkIcon';
import TargetIcon from '../../icons/TargetIcon';
import ClipboardSearchIcon from '../../icons/ClipboardSearchIcon';
import AnalyzeIcon from '../../icons/AnalyzeIcon';
import LightbulbIcon from '../../icons/LightbulbIcon';
import ThumbsUpIcon from '../../icons/ThumbsUpIcon';
import ThumbsDownIcon from '../../icons/ThumbsDownIcon';
import CodeIcon from '../../icons/CodeIcon';
import SearchIcon from '../../icons/SearchIcon';
import SmartphoneIcon from '../../icons/SmartphoneIcon';
import HeartPulseIcon from '../../icons/HeartPulseIcon';
import ShieldCheckIcon from '../../icons/ShieldCheckIcon';
import ZapIcon from '../../icons/ZapIcon';
import UsersIcon from '../../icons/UsersIcon';
import CalendarIcon from '../../icons/CalendarIcon';
import MessageSquareIcon from '../../icons/MessageSquareIcon';
import LeadGenVisualizer from '../LeadGenVisualizer';

const MiniScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getStrokeColor = (s: number) => {
        if (s >= 80) return 'stroke-green-500';
        if (s >= 50) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };

    return (
        <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 40 40">
                <circle className="stroke-slate-700" strokeWidth="4" cx="20" cy="20" r={radius} fill="transparent" />
                <circle
                    className={`transform-gpu -rotate-90 origin-center transition-all duration-1000 ease-out ${getStrokeColor(score)}`}
                    strokeWidth="4" strokeLinecap="round" cx="20" cy="20" r={radius} fill="transparent"
                    strokeDasharray={circumference} style={{ strokeDashoffset }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {score}
            </div>
        </div>
    );
};

const SwotCard: React.FC<{ swot?: ClientProspectAnalysisResult['swotAnalysis'] }> = ({ swot }) => {
    if (!swot) {
        return (
            <Card className="print-grid-item">
                <h3 className="text-xl font-bold mb-4 text-center">Holistic SWOT Analysis</h3>
                <p className="text-sm text-center text-slate-400">SWOT analysis data is not available for this prospect.</p>
            </Card>
        );
    }
    const sections = [
        { title: 'Strengths', items: swot.strengths, icon: ThumbsUpIcon, color: 'text-green-400' },
        { title: 'Weaknesses', items: swot.weaknesses, icon: ThumbsDownIcon, color: 'text-yellow-400' },
        { title: 'Opportunities', items: swot.opportunities, icon: TrendingUpIcon, color: 'text-blue-400' },
        { title: 'Threats', items: swot.threats, icon: AlertTriangleIcon, color: 'text-red-400' }
    ];
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Holistic SWOT Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print-swot-grid">
                {sections.map(({ title, items, icon: Icon, color }) => (
                    <div key={title}>
                        <h4 className={`font-semibold mb-2 flex items-center gap-2 ${color}`}><Icon className="w-5 h-5"/> {title}</h4>
                        <ul className="space-y-1 list-disc list-inside text-sm text-slate-300">
                            {(items || []).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const SocialPresenceCard: React.FC<{ social?: ClientProspectAnalysisResult['socialPresenceAnalysis']}> = ({ social }) => {
    const platforms = [
        { key: 'linkedIn', name: 'LinkedIn', icon: LinkedInIcon, data: social?.linkedIn },
        { key: 'twitter', name: 'X / Twitter', icon: TwitterIcon, data: social?.twitter },
        { key: 'instagram', name: 'Instagram', icon: InstagramIcon, data: social?.instagram },
        { key: 'facebook', name: 'Facebook', icon: FacebookIcon, data: social?.facebook },
    ].filter(p => p.data);

    if (platforms.length === 0) {
        return (
            <Card>
                <h3 className="text-xl font-bold mb-4 text-center">In-Depth Social Presence Analysis</h3>
                <p className="text-sm text-center text-slate-400">No significant social media presence was detected.</p>
            </Card>
        );
    }

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">In-Depth Social Presence Analysis</h3>
            <div className="space-y-6">
                {platforms.map(({name, icon: Icon, data}) => (
                    <div key={name} className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-lg text-white flex items-center gap-2">
                                <Icon className="w-6 h-6"/> {name}
                            </h4>
                            {data!.platformScore != null && <MiniScoreGauge score={data!.platformScore} />}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                            <div className="bg-slate-900/50 p-2 rounded-md">
                                <p className="text-2xl font-bold text-blue-300">{data!.followerCount}</p>
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1"><UsersIcon className="w-3 h-3"/> Followers</p>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded-md">
                                <p className="text-2xl font-bold text-blue-300">{data!.postingFrequency}</p>
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1"><CalendarIcon className="w-3 h-3"/> Frequency</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-1"><LightbulbIcon className="w-4 h-4 text-slate-400"/> Content Strategy:</h5>
                                <p className="text-slate-400 pl-6">{data!.contentStrategyAnalysis}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-1"><MessageSquareIcon className="w-4 h-4 text-slate-400"/> Engagement Analysis:</h5>
                                <p className="text-slate-400 pl-6">{data!.engagementAnalysis}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-1"><ThumbsUpIcon className="w-4 h-4 text-green-400"/> Strengths:</h5>
                                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-6">
                                    {(data!.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-1"><ThumbsDownIcon className="w-4 h-4 text-yellow-400"/> Weaknesses:</h5>
                                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-6">
                                    {(data!.weaknesses || []).map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-1"><CheckIcon className="w-4 h-4 text-slate-400"/> Recommendations:</h5>
                                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-6">
                                    {(data!.recommendations || []).map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

const SolutionRoadmapCard: React.FC<{ roadmap?: SolutionStep[], impact?: string }> = ({ roadmap, impact }) => {
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Proposed Solution Roadmap</h3>
            <div className="mb-6 bg-slate-800/50 p-3 rounded-md border-l-4 border-green-500">
                <h4 className="font-semibold text-white flex items-center gap-2"><TrendingUpIcon className="w-5 h-5 text-green-400"/>Estimated Business Impact</h4>
                <p className="text-sm text-slate-300 mt-1">{impact || 'Not available.'}</p>
            </div>
            <div className="space-y-4">
                {(roadmap ?? []).map((step, index) => (
                    <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">{index + 1}</div>
                           <div className="flex-grow">
                                <div className="flex flex-wrap gap-2 justify-between items-center">
                                    <h4 className="font-bold text-lg text-white">{step.phaseName}</h4>
                                    {step.timeline && (
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-700 px-2 py-1 rounded-full flex items-center gap-1.5">
                                            <CalendarIcon className="w-3 h-3"/>
                                            {step.timeline}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 my-2">
                                  {(step.services ?? []).map(service => (
                                      <span key={service} className="px-2 py-1 text-xs text-cyan-300 bg-cyan-900/50 rounded-full">{service}</span>
                                  ))}
                                </div>
                           </div>
                        </div>
                        <div className="pl-12">
                            <p className="text-sm text-slate-300 mt-2">{step.description}</p>
                            
                            <div className="mt-4 space-y-3">
                                {step.keyActivities && step.keyActivities.length > 0 && (
                                    <div>
                                        <h5 className="font-semibold text-sm text-slate-300 flex items-center gap-2 mb-1"><ClipboardListIcon className="w-4 h-4 text-slate-400"/> Key Activities</h5>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 pl-4">
                                            {step.keyActivities.map((activity, i) => <li key={i}>{activity}</li>)}
                                        </ul>
                                    </div>
                                )}
                                 {step.kpisToTrack && step.kpisToTrack.length > 0 && (
                                    <div>
                                        <h5 className="font-semibold text-sm text-slate-300 flex items-center gap-2 mb-1"><TargetIcon className="w-4 h-4 text-slate-400"/> KPIs to Track</h5>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 pl-4">
                                            {step.kpisToTrack.map((kpi, i) => <li key={i}>{kpi}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-sm text-green-300 font-medium mt-4"><strong>Expected Outcome:</strong> {step.expectedOutcome}</p>
                        </div>
                    </div>
                ))}
                {(roadmap ?? []).length === 0 && <p className="text-center text-slate-400">No roadmap steps available.</p>}
            </div>
        </Card>
    );
};

const OutreachCard: React.FC<{ personas?: ClientProspectAnalysisResult['decisionMakerPersonas'], draft?: string, talkingPoints?: string[] }> = ({ personas, draft, talkingPoints }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        if (draft) {
            navigator.clipboard.writeText(draft.replace(/\\n/g, '\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4 text-center">Outreach & Action Plan</h3>
            <div className="space-y-6 flex-grow flex flex-col">
                 <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-400"><UserIcon className="w-5 h-5"/> Decision Maker Personas</h4>
                    {(personas ?? []).map((persona, index) => (
                        <div key={index} className="bg-slate-800/50 p-3 rounded-md mb-2">
                            <p className="font-bold text-white">{persona.title}</p>
                            <ul className="text-sm text-slate-300 list-disc list-inside pl-4 mt-1">
                                {(persona.likelyGoals ?? []).map((goal, i) => <li key={i}>{goal}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                 <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-400"><ClipboardListIcon className="w-5 h-5"/> Discovery Call Talking Points</h4>
                    <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside pl-4">
                        {(talkingPoints ?? []).map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
                <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-2 no-print">
                        <h4 className="font-semibold flex items-center gap-2 text-blue-400"><MailIcon className="w-5 h-5"/> Outreach Draft</h4>
                        <button onClick={handleCopy} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
                            {copied ? <CheckIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <h4 className="font-semibold flex items-center gap-2 text-blue-400 mb-2 hidden print:flex"><MailIcon className="w-5 h-5"/> Outreach Draft</h4>
                    <pre className="text-sm text-slate-200 bg-slate-800/50 p-4 rounded-md whitespace-pre-wrap font-sans flex-grow">{draft?.replace(/\\n/g, '\n') || 'No draft available.'}</pre>
                </div>
            </div>
        </Card>
    );
};

const CompetitiveLandscapeCard: React.FC<{ landscape?: ClientProspectAnalysisResult['competitiveLandscape'] }> = ({ landscape }) => {
    if (!landscape) {
        return (
            <Card>
                <h3 className="text-xl font-bold mb-4 text-center">Competitive Landscape</h3>
                <p className="text-sm text-center text-slate-400">Competitive landscape data is not available.</p>
            </Card>
        );
    }
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Competitive Landscape</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-white mb-2">Identified Competitors</h4>
                    <ul className="space-y-2">
                        {(landscape.identifiedCompetitors ?? []).map((comp, i) => (
                            <li key={i} className="text-sm bg-slate-800/50 p-2 rounded-md">
                                <a href={comp.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:underline flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> {comp.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-2">Keyword & Content Gaps</h4>
                    <div className="flex flex-wrap gap-2">
                        {(landscape.keywordGaps ?? []).map((gap, i) => (
                            <span key={i} className="px-2 py-1 text-xs text-purple-300 bg-purple-900/50 rounded-full">{gap}</span>
                        ))}
                    </div>
                </div>
                 <div className="mt-4 pt-3 border-t border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Strategic Opportunity</h4>
                    <p className="text-sm text-slate-300">{landscape.opportunitySummary}</p>
                </div>
            </div>
        </Card>
    );
};

const PainPointsCard: React.FC<{ painPoints?: string[] }> = ({ painPoints }) => (
    <Card>
        <h3 className="text-xl font-bold mb-4 text-center">Identified Pain Points</h3>
        <ul className="space-y-2 list-disc list-inside text-sm text-slate-300">
            {(painPoints ?? []).length > 0 ? (
                (painPoints ?? []).map((point, i) => <li key={i}>{point}</li>)
            ) : (
                <p className="text-center text-slate-400">No specific pain points were identified.</p>
            )}
        </ul>
    </Card>
);

const EmailSequenceCard: React.FC<{ sequence?: ClientProspectAnalysisResult['emailSequence'] }> = ({ sequence }) => {
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const handleCopy = (email: ClientProspectAnalysisResult['emailSequence'][0]) => {
        const textToCopy = `Subject: ${email.subject}\n\n${email.body.replace(/\\n/g, '\n')}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedEmail(email.subject);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">AI-Generated Email Sequence</h3>
            <div className="space-y-4">
                {(sequence ?? []).map((email, index) => (
                    <div key={index} className="bg-slate-800/50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-white">Email {index + 1}: {email.subject}</h4>
                            <button onClick={() => handleCopy(email)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 no-print">
                                {copiedEmail === email.subject ? <CheckIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                                {copiedEmail === email.subject ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">Send Delay: {email.sendDelayDays} days</p>
                        <pre className="text-sm text-slate-300 bg-slate-900/50 p-2 rounded-md whitespace-pre-wrap font-sans">{email.body.replace(/\\n/g, '\n')}</pre>
                    </div>
                ))}
                 {(sequence ?? []).length === 0 && <p className="text-center text-slate-400">No email sequence available.</p>}
            </div>
        </Card>
    );
};

const TechnologyStackCard: React.FC<{ stack?: ClientProspectAnalysisResult['technologyStack'] }> = ({ stack }) => {
    if (!stack || stack.length === 0) {
        return <Card><h3 className="text-xl font-bold text-center">Technology Stack</h3><p className="text-sm text-center text-slate-400 mt-2">Could not determine technology stack.</p></Card>;
    }
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Technology Stack</h3>
            <div className="space-y-2">
                {stack.map((tech, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md text-sm">
                        <span className="font-semibold text-slate-200">{tech.name}</span>
                        <span className="text-xs font-semibold text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full">{tech.category}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const QuickWinsCard: React.FC<{ wins?: string[] }> = ({ wins }) => (
    <Card>
        <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2"><LightbulbIcon className="w-6 h-6 text-yellow-300"/> Actionable Quick Wins</h3>
        <ul className="space-y-2 list-disc list-inside text-sm text-slate-300">
            {(wins ?? []).length > 0 ? (
                (wins ?? []).map((win, i) => <li key={i}>{win}</li>)
            ) : (
                 <p className="text-center text-slate-400">No specific quick wins were identified.</p>
            )}
        </ul>
    </Card>
);

const ValuePropositionCard: React.FC<{ analysis?: ClientProspectAnalysisResult['valuePropositionAnalysis'] }> = ({ analysis }) => {
    if (!analysis) {
        return (
            <Card>
                <h3 className="text-xl font-bold mb-4 text-center">Value Proposition Analysis</h3>
                <p className="text-sm text-center text-slate-400">Analysis not available.</p>
            </Card>
        );
    }
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Value Proposition Analysis</h3>
            <div>
                <h4 className="text-sm font-bold uppercase text-slate-400 mb-1">Stated USP</h4>
                <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-200">{analysis.statedUSP}</blockquote>
            </div>
            <div className="mt-4">
                <h4 className="text-sm font-bold uppercase text-slate-400 mb-1">Effectiveness</h4>
                <p className="flex items-center gap-2 text-sm text-slate-300"><ThumbsUpIcon className="w-4 h-4 text-green-400" /> {analysis.effectiveness}</p>
            </div>
            <div className="mt-4">
                <h4 className="text-sm font-bold uppercase text-slate-400 mb-1">Recommendations</h4>
                <p className="text-sm text-slate-300">{analysis.recommendations}</p>
            </div>
        </Card>
    );
};

const TechnicalSeoAuditCard: React.FC<{ audit?: TechnicalSeoAudit }> = ({ audit }) => {
    if (!audit) {
        return (
            <Card>
                <h3 className="text-xl font-bold mb-4 text-center">Technical SEO Audit</h3>
                <p className="text-sm text-center text-slate-400">Technical SEO audit data is not available.</p>
            </Card>
        );
    }
    const statusClasses = {
        Good: 'bg-green-500/20 text-green-300 border-green-500/50',
        Fast: 'bg-green-500/20 text-green-300 border-green-500/50',
        Present: 'bg-green-500/20 text-green-300 border-green-500/50',
        'Needs Improvement': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        Average: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        Incomplete: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        'Has Issues': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        Poor: 'bg-red-500/20 text-red-300 border-red-500/50',
        Slow: 'bg-red-500/20 text-red-300 border-red-500/50',
        Missing: 'bg-red-500/20 text-red-300 border-red-500/50',
    };

    const auditItems = [
        { title: 'Core Web Vitals', icon: HeartPulseIcon, data: audit.coreWebVitals },
        { title: 'Mobile Friendliness', icon: SmartphoneIcon, data: audit.mobileFriendliness },
        { title: 'Site Speed', icon: ZapIcon, data: audit.siteSpeed },
        { title: 'Security (HTTPS)', icon: ShieldCheckIcon, data: { status: audit.security?.https ? 'Good' : 'Poor', details: audit.security?.details } },
        { title: 'Schema Markup', icon: CodeIcon, data: audit.schemaMarkup },
        { title: 'Crawlability', icon: SearchIcon, data: audit.crawlability },
    ];
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Technical SEO Audit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditItems.map(({ title, icon: Icon, data }) => (
                    <div key={title} className="bg-slate-800/50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-white flex items-center gap-2"><Icon className="w-5 h-5"/> {title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusClasses[data.status as keyof typeof statusClasses] || statusClasses['Needs Improvement']}`}>{data.status}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{data.details}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const RoiAnalysisCard: React.FC<{ analysis?: RoiAnalysis }> = ({ analysis }) => {
    if (!analysis) {
        return (
            <Card>
                <h3 className="text-xl font-bold mb-4 text-center">Projected ROI Analysis</h3>
                <p className="text-sm text-center text-slate-400">ROI analysis is not available for this prospect.</p>
            </Card>
        );
    }
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-center">Projected ROI Analysis</h3>
            <div className="text-center mb-6">
                <p className="text-6xl font-bold text-green-400">{analysis.estimatedRoiPercentage || 0}%</p>
                <p className="text-sm text-slate-400">Estimated ROI within {analysis.timeline || 'N/A'}</p>
            </div>
            <div className="space-y-4">
                <div className="bg-slate-800/50 p-3 rounded-md">
                    <h4 className="font-semibold text-white mb-1">Projected Impact</h4>
                    <p className="text-sm text-slate-300">{analysis.projectedImpact || 'Not available.'}</p>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-md">
                    <h4 className="font-semibold text-white mb-1">Key Assumptions</h4>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {(analysis.assumptions ?? []).map((assumption, i) => <li key={i}>{assumption}</li>)}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

const LeadGenNurtureView: React.FC = () => {
    const [auditingProspectUrl, setAuditingProspectUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Prospecting State
    const { values: icpValues, handleChange: handleIcpChange, validateForm: validateIcpForm } = useFormValidation<IdealCustomerProfile>({ industry: '', location: '', keywords: '' }, { industry: Validators.required });
    const [foundProspects, setFoundProspects] = useState<FoundProspect[]>([]);
    const [isFinding, setIsFinding] = useState(false);
    const [prospectingError, setProspectingError] = useState('');

    // Main Audit State
    const { values, setValues, errors, touched, handleChange, handleBlur, validateForm, resetForm: resetAuditForm } = useFormValidation({
        url: '', description: '', linkedIn: '', twitter: '', instagram: '', facebook: '',
    }, {
        url: (value: string) => Validators.required(value) || Validators.url(value),
        linkedIn: Validators.url, twitter: Validators.url, instagram: Validators.url, facebook: Validators.url,
    });

    const { result, isLoading, error, execute, reset: resetAITool } = useAITool<ClientProspectAnalysisResult, { url: string; description: string | null; socialUrls: any }>(
        'leadGenNurture',
        (args) => analyzeClientProspect(args.url, args.description, args.socialUrls)
    );

    const handleFindProspects = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateIcpForm()) return;
        setIsFinding(true);
        setProspectingError('');
        try {
            const prospects = await findProspects(icpValues);
            setFoundProspects(prospects);
        } catch (err: any) {
            setProspectingError(err.message || 'Failed to find prospects.');
        } finally {
            setIsFinding(false);
        }
    };

    const handleAuditProspect = (prospect: FoundProspect) => {
        setAuditingProspectUrl(prospect.websiteUrl);
        execute({ url: prospect.websiteUrl, description: null, socialUrls: {} }, prospect.websiteUrl);
    };

    const handleSubmitAudit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setAuditingProspectUrl(null);
        const { url, description, linkedIn, twitter, instagram, facebook } = values;
        execute({ url, description: description || null, socialUrls: { linkedIn, twitter, instagram, facebook } }, url);
    };

    const handleReset = () => {
        resetAuditForm();
        resetAITool();
        setFoundProspects([]);
    };

    const handlePrint = () => { window.print(); };
    
    const getInputClasses = (fieldName: keyof typeof values) => {
        const baseClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
        const errorClasses = "border-red-500 focus:ring-red-500";
        return touched[fieldName] && errors[fieldName] ? `${baseClasses} ${errorClasses}` : baseClasses;
    };
    
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'presence', label: 'Digital Presence' },
        { id: 'strategy', label: 'Strategy' },
        { id: 'outreach', label: 'Outreach' },
    ];
    
    const auditingTarget = auditingProspectUrl || values.url;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="no-print">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><ClipboardSearchIcon className="w-8 h-8 text-blue-400"/>Lead Gen & Nurture</h1>
                <p className="text-slate-400 mb-6">Generate AI-powered qualification reports, competitive analysis, and strategic roadmaps for any prospect.</p>
            </div>
            
            {isLoading ? (
                <div className="max-w-4xl mx-auto">
                    <LeadGenVisualizer mode="auditing" target={auditingTarget} />
                </div>
            ) : result && typeof result !== 'string' ? (
                <div className="animate-fade-in">
                    <div className="text-center mb-8 no-print">
                        <div className="flex justify-center gap-4">
                            <Button type="button" onClick={handleReset} variant="secondary">Start New Audit</Button>
                            <Button type="button" onClick={handlePrint}><PrintIcon className="w-5 h-5 mr-2"/> Print Report</Button>
                        </div>
                    </div>

                    <div className="printable-area">
                         {/* Header for both screen and print */}
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold text-gray-800 print:block hidden">Digital Audit & Strategy Report</h1>
                            <h2 className="text-3xl font-bold text-white print:text-2xl print:text-black">{result.companyName}</h2>
                        </div>
                         {/* Executive Dashboard */}
                        <div className="mb-8 no-print">
                            <h2 className="text-2xl font-bold text-white text-center mb-4">Executive Dashboard</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Card className="text-center !p-4"><p className="text-sm uppercase text-slate-400 mb-2">Overall Fit</p><ScoreGauge score={result.overallScore} /></Card>
                                <Card className="text-center !p-4"><p className="text-sm uppercase text-slate-400 mb-2">Technical Health</p><ScoreGauge score={result.technicalHealthScore} /></Card>
                                <Card className="text-center !p-4"><p className="text-sm uppercase text-slate-400 mb-2">Content Authority</p><ScoreGauge score={result.contentAuthorityScore} /></Card>
                            </div>
                        </div>

                        {/* Tab Navigation for screen */}
                        <div className="mb-8 border-b border-slate-800 no-print">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`${tab.id === activeTab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        {/* Tab Content for screen */}
                        <div className="no-print">
                           {activeTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"><Card className="text-center"><h3 className="text-2xl font-bold">{result.companyName}</h3><p className="text-slate-300 text-sm mt-2">{result.summary}</p><span className="mt-4 inline-block text-xs font-semibold text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">{result.estimatedValue}</span></Card> <ValuePropositionCard analysis={result.valuePropositionAnalysis} /> <div className="lg:col-span-2"><QuickWinsCard wins={result.quickWins} /></div> <PainPointsCard painPoints={result.painPoints} /></div>}
                           {activeTab === 'presence' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"><TechnicalSeoAuditCard audit={result.technicalSeoAudit} /> <SwotCard swot={result.swotAnalysis} /> <SocialPresenceCard social={result.socialPresenceAnalysis} /> <CompetitiveLandscapeCard landscape={result.competitiveLandscape} /> <TechnologyStackCard stack={result.technologyStack}/></div>}
                           {activeTab === 'strategy' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"><SolutionRoadmapCard roadmap={result.solutionRoadmap} impact={result.estimatedBusinessImpact} /><RoiAnalysisCard analysis={result.roiAnalysis} /></div>}
                           {activeTab === 'outreach' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"><OutreachCard personas={result.decisionMakerPersonas} draft={result.outreachDraft} talkingPoints={result.talkingPoints} /> <EmailSequenceCard sequence={result.emailSequence} /></div>}
                        </div>

                        {/* Full content for print */}
                        <div className="hidden print:block space-y-8 print-grid-container">
                           <Card className="text-center"><h3 className="text-2xl font-bold">{result.companyName}</h3><p className="text-slate-300 text-sm mt-2">{result.summary}</p><span className="mt-4 inline-block text-xs font-semibold text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">{result.estimatedValue}</span></Card>
                           <ValuePropositionCard analysis={result.valuePropositionAnalysis} />
                           <QuickWinsCard wins={result.quickWins} />
                           <PainPointsCard painPoints={result.painPoints} />
                           <SolutionRoadmapCard roadmap={result.solutionRoadmap} impact={result.estimatedBusinessImpact} />
                           <RoiAnalysisCard analysis={result.roiAnalysis} />
                           <TechnicalSeoAuditCard audit={result.technicalSeoAudit} />
                           <SwotCard swot={result.swotAnalysis} />
                           <SocialPresenceCard social={result.socialPresenceAnalysis} />
                           <CompetitiveLandscapeCard landscape={result.competitiveLandscape} />
                           <TechnologyStackCard stack={result.technologyStack}/>
                           <OutreachCard personas={result.decisionMakerPersonas} draft={result.outreachDraft} talkingPoints={result.talkingPoints} />
                           <EmailSequenceCard sequence={result.emailSequence} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 max-w-4xl mx-auto no-print">
                    <Card><form onSubmit={handleFindProspects} className="space-y-4"><h2 className="text-xl font-bold text-center flex items-center justify-center gap-2"><TargetIcon className="w-6 h-6 text-blue-400"/>1. Find New Prospects</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label htmlFor="industry" className={labelClass}>Industry / Niche*</label><input type="text" name="industry" id="industry" value={icpValues.industry} onChange={handleIcpChange} className={inputClass} placeholder="e.g., B2B SaaS for HR"/></div><div><label htmlFor="location" className={labelClass}>Location</label><input type="text" name="location" id="location" value={icpValues.location} onChange={handleIcpChange} className={inputClass} placeholder="e.g., Dubai, UAE"/></div><div><label htmlFor="keywords" className={labelClass}>Keywords / Technologies</label><input type="text" name="keywords" id="keywords" value={icpValues.keywords} onChange={handleIcpChange} className={inputClass} placeholder="e.g., uses HubSpot"/></div></div><div className="text-center pt-2"><Button type="submit" disabled={isFinding}><SparklesIcon className="w-5 h-5 mr-2"/>{isFinding ? 'Searching...' : 'Find Prospects'}</Button></div></form></Card>
                    
                    {isFinding ? (
                       <LeadGenVisualizer mode="finding" />
                    ) : (
                        <>
                            {prospectingError && <p className="text-red-400 text-center">{prospectingError}</p>}
                            {foundProspects.length > 0 && (
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden animate-fade-in"><table className="w-full text-sm text-left">
                                    <thead className="bg-slate-800/50"><tr><th className="p-3">Company Name</th><th className="p-3">Website</th><th className="p-3"></th></tr></thead>
                                    <tbody>{foundProspects.map(p => {
                                        const isAuditingThis = isLoading && auditingProspectUrl === p.websiteUrl;
                                        return (<tr key={p.websiteUrl} className="border-b border-slate-800"><td className="p-3 font-medium text-white">{p.companyName}</td><td className="p-3"><a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{p.websiteUrl}</a></td><td className="p-3 text-right"><Button onClick={() => handleAuditProspect(p)} variant="secondary" className="!py-1 !px-3 !text-xs" disabled={isLoading}>{isAuditingThis ? 'Auditing...' : 'Run Audit'}</Button></td></tr>)
                                    })}</tbody>
                                </table></div>
                            )}
                        </>
                    )}

                    <Card><form onSubmit={handleSubmitAudit} className="space-y-6" id="manual-audit-form"><h2 className="text-xl font-bold text-center flex items-center justify-center gap-2"><AnalyzeIcon className="w-6 h-6 text-blue-400"/>2. Perform a Manual Audit</h2><div><label htmlFor="url" className={labelClass}>Website URL*</label><input type="text" name="url" id="url" value={values.url} onChange={handleChange} onBlur={handleBlur} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://example.com" />{touched.url && errors.url && <p className="text-red-400 text-xs mt-1">{errors.url}</p>}</div><div><label htmlFor="description" className={labelClass}>Business Description (Optional)</label><textarea name="description" id="description" rows={3} value={values.description} onChange={handleChange} onBlur={handleBlur} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Leave blank to let AI generate from the website..." />{touched.description && errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}</div><fieldset><legend className="text-sm font-medium text-slate-300 mb-2">Social Profiles (Optional)</legend><div className="space-y-4"><div className="relative"><LinkedInIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"/><input type="text" name="linkedIn" value={values.linkedIn} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('linkedIn')} placeholder="LinkedIn URL" /></div><div className="relative"><TwitterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"/><input type="text" name="twitter" value={values.twitter} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('twitter')} placeholder="X / Twitter URL" /></div><div className="relative"><InstagramIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"/><input type="text" name="instagram" value={values.instagram} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('instagram')} placeholder="Instagram URL" /></div><div className="relative"><FacebookIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"/><input type="text" name="facebook" value={values.facebook} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('facebook')} placeholder="Facebook URL" /></div></div></fieldset><div className="text-right pt-2"><Button type="submit" disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Run Full Audit'}</Button></div>{error && <div role="alert" className="text-red-400 text-center pt-2">{error}</div>}</form></Card>
                </div>
            )}
        </div>
    );
};

export default LeadGenNurtureView;