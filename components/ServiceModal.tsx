import React, { useRef } from 'react';
import type { Service } from '../types';
import { useModal } from '../hooks/useModal';
import Button from './ui/Button';
import XIcon from './icons/XIcon';
import CheckIcon from './icons/CheckIcon';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, !!service, onClose);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div
        ref={modalRef}
        className="relative max-w-2xl w-11/12 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up-word"
        style={{ animationDuration: '0.5s' }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close service details"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="flex-shrink-0 p-4 bg-slate-800 rounded-full border border-slate-700">
                    <service.icon className="w-12 h-12 text-blue-400" />
                </div>
                <div>
                    <h2 id="service-modal-title" className="text-3xl font-bold text-white text-center sm:text-left">{service.title}</h2>
                    <p className="text-slate-300 mt-2 text-center sm:text-left">{service.detailedDescription}</p>
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Key Offerings</h3>
                <ul className="space-y-3">
                {service.keyOfferings.map((offering, index) => (
                    <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-slate-300">{offering}</span>
                    </li>
                ))}
                </ul>
            </div>

            <div className="mt-8 text-center">
                <Button href="#contact" onClick={onClose}>
                    Request a Consultation
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;