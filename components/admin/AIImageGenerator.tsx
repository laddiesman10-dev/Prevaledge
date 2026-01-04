

import React, { useState, useEffect } from 'react';
import { generateImageFromPrompt } from '../../services/geminiService';
import SparklesIcon from '../icons/SparklesIcon';
import Button from '../ui/Button';

interface AIImageGeneratorProps {
  onImageGenerated: (base64Image: string) => void;
  promptSuggestion?: string;
}

const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({ onImageGenerated, promptSuggestion = '' }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (promptSuggestion) {
      setPrompt(`A hero image for an article titled: ${promptSuggestion}`);
    }
  }, [promptSuggestion]);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
        setError('Please enter a prompt to generate an image.');
        return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);
    try {
        const image = await generateImageFromPrompt(prompt);
        setGeneratedImage(image);
    } catch(e: any) {
        setError(e.message || 'An unexpected error occurred during image generation.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedImage) {
        onImageGenerated(generatedImage);
        setGeneratedImage(null);
        setPrompt('');
    }
  };
  
  const handleRetry = () => {
      setGeneratedImage(null);
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mt-4">
      <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-purple-400" />
        AI Image Generation
      </h3>
      {generatedImage ? (
        <div className="space-y-4 animate-fade-in text-center">
            <img src={generatedImage} alt="AI generated preview" className="rounded-md max-w-full h-auto mx-auto shadow-lg" />
            <div className="flex justify-center gap-4">
                <Button type="button" onClick={handleAccept}>Use This Image</Button>
                <Button type="button" variant="secondary" onClick={handleRetry}>Try Again</Button>
            </div>
        </div>
      ) : (
        <div className="space-y-3">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-sm"
                rows={2}
                disabled={isLoading}
            />
            <Button type="button" onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? 'Generating...' : 'Generate Image'}
            </Button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AIImageGenerator;
