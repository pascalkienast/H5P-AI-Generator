import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ModelSelector({ selectedModel, setSelectedModel }) {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Load saved preference from localStorage if available
    const savedModel = localStorage.getItem('aiModelPreference');
    if (savedModel) {
      setSelectedModel(savedModel);
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
        <option value="anthropic">Claude</option>
        <option value="academiccloud">AcademicCloud</option>
      </select>
    </div>
  );
} 