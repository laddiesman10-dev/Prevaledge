import React, { useState } from 'react';
import { useExitIntent } from '../hooks/useExitIntent';
import WebinarSignupModal from './WebinarSignupModal';

const ExitIntentPopup: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExitIntent = () => {
    setIsModalOpen(true);
  };

  useExitIntent(handleExitIntent);

  return <WebinarSignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />;
};

export default ExitIntentPopup;