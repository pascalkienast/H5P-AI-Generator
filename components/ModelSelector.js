import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ModelSelector({ selectedModel, setSelectedModel }) {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Load saved preference from localStorage if available
    const savedModel = localStorage.getItem('aiModelPreference');
    if (savedModel) {
      setSelectedModel(savedModel);
    } else {
      // Set llama-3.3-70b-instruct as default if no preference exists
      setSelectedModel('llama-3.3-70b-instruct');
      localStorage.setItem('aiModelPreference', 'llama-3.3-70b-instruct');
    }
  }, [setSelectedModel]);

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    localStorage.setItem('aiModelPreference', newModel);
  };

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
        <option value="mistral-large-instruct">{t('modelSelector.models.mistral')}</option>
        <option value="llama-3.3-70b-instruct">{t('modelSelector.models.llama')}</option>
        <option value="qwen-2.5-72b-instruct">{t('modelSelector.models.qwen')}</option>
        <option value="claude">{t('modelSelector.models.claude')}</option>
      </select>
    </div>
  );
} 