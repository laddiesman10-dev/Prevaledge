import { useState, useCallback, useContext } from 'react';
import { SiteDataContext } from '../data/siteDataContext';
import { trackEvent } from '../services/analyticsService';
import { AIToolName } from '../types';

// T is the result type, U is the arguments type for the API function
export function useAITool<T, U extends object>(
  toolName: AIToolName,
  apiFn: (args: U) => Promise<T> | AsyncGenerator<string, void, unknown>,
  isStreaming: boolean = false
) {
  const { logAiToolUsage } = useContext(SiteDataContext);
  const [result, setResult] = useState<T | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (args: U, analyticsLabel: string) => {
    setIsLoading(true);
    setError('');
    setResult(isStreaming ? '' : null);

    try {
      logAiToolUsage(toolName);
      trackEvent(`generate_${toolName}`, { category: 'engagement', label: analyticsLabel });
      
      const response = apiFn(args);

      if (isStreaming && Symbol.asyncIterator in response) {
        let fullResponse = '';
        for await (const chunk of response as AsyncGenerator<string, void, unknown>) {
          fullResponse += chunk;
          setResult(fullResponse);
        }
      } else {
        const finalResult = await (response as Promise<T>);
        setResult(finalResult);
      }
      
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again or contact support if the problem persists.');
      trackEvent(`generate_${toolName}_failure`, {
        category: 'error',
        label: err.message || 'Unknown API error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiFn, logAiToolUsage, toolName, isStreaming]);

  const reset = useCallback(() => {
    setResult(null);
    setError('');
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, execute, reset };
}
