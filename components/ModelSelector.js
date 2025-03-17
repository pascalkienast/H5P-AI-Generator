import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ModelSelector({ selectedModel, setSelectedModel }) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Load saved preference from localStorage if available
    const savedModel = localStorage.getItem('aiModelPreference');
    if (savedModel) {
      setSelectedModel(savedModel);
    } else {
      // Set claude as default if no preference exists
      setSelectedModel('claude');
      localStorage.setItem('aiModelPreference', 'claude');
    }
  }, [setSelectedModel]);

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    localStorage.setItem('aiModelPreference', newModel);
  };

  // Only show the real content after client-side hydration is complete
  if (!isMounted) {
    return (
      <div className="flex items-center">
        <label htmlFor="model-selector" className="mr-2 text-sm text-gray-600">
          AI Model:
        </label>
        <select
          id="model-selector"
          className="text-sm border border-gray-300 rounded-md px-2 py-1"
        >
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <label htmlFor="model-selector" className="mr-2 text-sm text-gray-600">
        {t('modelSelector.label')}:
      </label>
      <select
        id="model-selector"
        value={selectedModel}
        onChange={handleModelChange}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
      >
        <option value="deepseek-r1">{t('modelSelector.models.deepseek')}</option>
        <option value="mistral-large-instruct">{t('modelSelector.models.mistral')}</option>
        <option value="llama-3.3-70b-instruct">{t('modelSelector.models.llama')}</option>
        <option value="qwen-2.5-72b-instruct">{t('modelSelector.models.qwen')}</option>
        <option value="claude">{t('modelSelector.models.claude')}</option>
      </select>
    </div>
  );
} 