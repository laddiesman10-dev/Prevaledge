import React, { useState } from 'react';
import AnimateOnScroll from './ui/AnimateOnScroll';
import Button from './ui/Button';
import GraduationCapIcon from './icons/GraduationCapIcon';
import WebinarSignupModal from './WebinarSignupModal';

const LeadMagnet: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section id="lead-magnet" className="py-20">
                <AnimateOnScroll>
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 md:p-12">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-slate-800 border border-slate-700 rounded-full">
                                <GraduationCapIcon className="w-10 h-10 text-blue-300" />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Unlock Your Growth Potential
                        </h2>
                        <p className="max-w-2xl mx-auto text-slate-300 mb-8">
                            Join our free AI Marketing Masterclass and learn the strategies top agencies use to drive exponential growth. Get exclusive insights, actionable playbooks, and a live Q&A session.
                        </p>
                        <Button onClick={() => setIsModalOpen(true)}>
                            Register for Free
                        </Button>
                    </div>
                </AnimateOnScroll>
            </section>
            <WebinarSignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default LeadMagnet;