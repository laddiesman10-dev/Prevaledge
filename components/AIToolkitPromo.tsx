import React from 'react';
import AnimateOnScroll from './ui/AnimateOnScroll';
import Button from './ui/Button';
import SparklesIcon from './icons/SparklesIcon';

const AIToolkitPromo: React.FC = () => {
    return (
        <section id="ai-promo" className="py-20">
            <AnimateOnScroll>
                <div className="relative max-w-5xl mx-auto text-center bg-slate-900/50 border border-slate-800 rounded-xl p-8 md:p-12 overflow-hidden">
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl" aria-hidden="true"></div>
                    <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-slate-800 border border-slate-700 rounded-full">
                                <SparklesIcon className="w-10 h-10 text-blue-300" />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Experience Our Power, For Free
                        </h2>
                        <p className="max-w-2xl mx-auto text-slate-300 mb-8">
                            Curious about what our strategic AI can do for you? Explore our suite of free AI-powered marketing tools. Analyze your website, generate ad copy, find blog ideas, and more—no sign-up required.
                        </p>
                        <Button href="/ai-toolkit">
                            Explore the Free AI Toolkit
                        </Button>
                    </div>
                </div>
            </AnimateOnScroll>
        </section>
    );
};

export default AIToolkitPromo;