

import React, { useContext } from 'react';
import type { User } from '../types';
import Card from './ui/Card';
import AnimateOnScroll from './ui/AnimateOnScroll';
import { SiteDataContext } from '../data/siteDataContext';
import NeuralSignatureIcon from './icons/NeuralSignatureIcon';

const TeamSection: React.FC = () => {
  const { users } = useContext(SiteDataContext);
  return (
    <section id="team" className="py-20" aria-labelledby="team-heading">
      <AnimateOnScroll>
        <h2 id="team-heading" className="text-4xl font-bold text-center mb-12">
          The <span className="text-blue-400">Architects</span> of Your Success
        </h2>
      </AnimateOnScroll>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {users.map((member, index) => (
          <AnimateOnScroll key={member.id} delay={index * 100}>
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <NeuralSignatureIcon />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-blue-400 font-semibold mb-4">{member.title}</p>
              <p className="text-slate-400 min-h-[72px]">{member.bio}</p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;