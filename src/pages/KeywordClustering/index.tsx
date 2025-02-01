import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { KeywordInput } from '../../components/clustering/KeywordInput';
import { ClusteringTypeSelect } from '../../components/clustering/ClusteringTypeSelect';
import { ApiKeyDialog } from '../../components/domain/copilot/ApiKeyDialog';
import { getUserSettings, updateOpenAIKey } from '../../services/settings';
import type { ClusteringType } from '../../services/keywordClustering';

export function KeywordClustering() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState('');
  const [type, setType] = useState<ClusteringType>('semantic');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const settings = await getUserSettings();
      setHasApiKey(!!settings?.openai_api_key);
    } catch (error) {
      console.error('Error checking API key:', error);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.startsWith('sk-')) {
      toast.error('Invalid API key format. It should start with "sk-"');
      return;
    }

    setIsLoading(true);
    try {
      await updateOpenAIKey(apiKey);
      setHasApiKey(true);
      setShowApiKeyDialog(false);
      toast.success('API key saved successfully');
    } catch (error) {
      toast.error('Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const keywordList = keywords
      .split('\n')
      .map(k => k.trim())
      .filter(Boolean);

    if (keywordList.length === 0) return;

    if (!hasApiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    const searchParams = new URLSearchParams({
      keywords: JSON.stringify(keywordList),
      type
    });

    navigate(`/keyword-clustering/results?${searchParams.toString()}`);
  };

  const handleImportCSV = (importedKeywords: string[]) => {
    setKeywords(importedKeywords.join('\n'));
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Keyword Clustering Tool
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Group your keywords into meaningful clusters based on different criteria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ClusteringTypeSelect
            value={type}
            onChange={setType}
          />

          <KeywordInput
            keywords={keywords}
            onChange={setKeywords}
            onImportCSV={handleImportCSV}
          />

          <button
            type="submit"
            disabled={!keywords.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cluster Keywords
          </button>
        </form>
      </div>

      {showApiKeyDialog && (
        <ApiKeyDialog
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowApiKeyDialog(false)}
        />
      )}
    </div>
  );
}
