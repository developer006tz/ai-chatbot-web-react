import { useState, useEffect } from 'react';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { validateApiKey } from '../utils/helpers';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.apiKey) || '';
    setApiKey(savedApiKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaved(false);

    if (!apiKey) {
      setError('API key is required');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setError('Invalid API key format');
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.apiKey, apiKey);
    setIsSaved(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API Configuration</h2>
          
          <Input
            label="OpenAI API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            error={error || undefined}
            placeholder="sk-..."
            className="mb-4 dark:bg-gray-600 py-3 px-2"
          />
          
          <Button type="submit" className="w-full">
            Save Settings
          </Button>
          
          {isSaved && (
            <p className="mt-2 text-sm text-green-600">
              Settings saved successfully
            </p>
          )}
        </div>
      </form>
    </div>
  );
}