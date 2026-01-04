import React, { useContext, useMemo } from 'react';
import Button from './ui/Button';
import AnimateOnScroll from './ui/AnimateOnScroll';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { ContactSubmission } from '../types';
import { SiteDataContext } from '../data/siteDataContext';

interface ContactSuccessViewProps {
  submission: ContactSubmission;
  onReset: () => void;
}

const ContactSuccessView: React.FC<ContactSuccessViewProps> = ({ submission, onReset }) => {
  const { projects, blogPosts } = useContext(SiteDataContext);
  
  const recommendedContent = useMemo(() => {
    const inquiryType = submission.inquiryType?.toLowerCase() || '';
    if (!inquiryType) return [];
    
    // Find relevant case studies
    const relevantProjects = projects.filter(p => p.category.toLowerCase().includes(inquiryType));
    
    // Find relevant blog posts
    const relevantPosts = blogPosts.filter(p => 
      p.title.toLowerCase().includes(inquiryType) || 
      p.focusKeyword?.toLowerCase().includes(inquiryType)
    );
    
    // Combine and return the top 3
    const recommendations = [
      ...relevantProjects.map(p => ({ type: 'Case Study', title: p.title, url: `/project/${p.slug}` })),
      ...relevantPosts.map(p => ({ type: 'Blog Post', title: p.title, url: `/blog/${p.slug}` })),
    ];
    
    return recommendations.slice(0, 3);
  }, [submission, projects, blogPosts]);

  return (
    <section id="contact" className="py-20" aria-labelledby="contact-heading">
      <AnimateOnScroll>
        <div className="max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 id="contact-heading" className="text-4xl font-bold mb-4">
                Thank You, <span className="text-blue-400">{submission.name.split(' ')[0]}!</span>
            </h2>
            <p className="max-w-xl mx-auto text-slate-400 mb-8">
                Your message has been received. Our team will get back to you shortly. In the meantime, here are some resources you might find helpful based on your inquiry.
            </p>

            {recommendedContent.length > 0 && (
              <div className="text-left bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Recommended For You</h3>
                <div className="space-y-3">
                  {recommendedContent.map(item => (
                    <Button key={item.url} href={item.url} variant="link" className="block text-left !p-0">
                      <div className="hover:bg-slate-700/50 p-3 rounded-md transition-colors">
                        <span className={`text-xs font-bold uppercase ${item.type === 'Case Study' ? 'text-blue-400' : 'text-purple-400'}`}>{item.type}</span>
                        <p className="text-slate-200">{item.title} &rarr;</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={onReset} variant="secondary">
                    Send Another Message
                </Button>
            </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default ContactSuccessView;