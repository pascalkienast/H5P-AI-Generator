import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PreviewModule({ contentId, apiEndpoint }) {
  const { t } = useTranslation();
  const [iframeLoading, setIframeLoading] = useState(true);
  
  const previewUrl = `${apiEndpoint}/h5p/play/${contentId}`;
  const downloadUrl = `${apiEndpoint}/h5p/download/${contentId}`;
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t('generatedModule')}</h2>
        <a 
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          {t('downloadH5P')}
        </a>
      </div>
      
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
          </div>
        )}
        
        <iframe
          src={previewUrl}
          className="w-full"
          style={{ height: '500px', border: 'none' }}
          onLoad={() => setIframeLoading(false)}
          title="H5P Module Preview"
        ></iframe>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Content ID: {contentId}</p>
      </div>
    </div>
  );
} 