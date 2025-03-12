import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import ConversationUI from '../components/ConversationUI';
import PreviewModule from '../components/PreviewModule';

export default function Home() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState('start'); // 'start', 'conversation', 'preview'
  const [needsMoreInfo, setNeedsMoreInfo] = useState(true);
  
  // Extract JSON from Claude's response
  const extractJsonFromResponse = (responseContent) => {
    console.log('Extracting JSON from response:', responseContent);
    for (const content of responseContent) {
      if (content.type === 'text') {
        console.log('Processing text content:', content.text);
        const jsonMatch = content.text.match(/```json([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedJson = JSON.parse(jsonMatch[1].trim());
            console.log('Successfully parsed JSON:', parsedJson);
            return parsedJson;
          } catch (err) {
            console.error('Failed to parse JSON:', err);
            return null;
          }
        }
      }
    }
    console.log('No JSON found in response');
    return null;
  };
  
  // Send message to Claude
  const sendMessage = async (content) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newMessage = { role: 'user', content };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chat API response:', data);
      
      const assistantMessage = { role: 'assistant', content: data.response[0].text };
      setMessages([...updatedMessages, assistantMessage]);
      
      // Extract JSON content if present
      const jsonContent = extractJsonFromResponse(data.response);
      console.log('Extracted JSON content:', jsonContent);
      
      if (jsonContent) {
        console.log('JSON content found, creating H5P content...');
        setNeedsMoreInfo(false);
        await createH5PContent(jsonContent);
        setIsCompleted(true);
      } else {
        console.log('No JSON content found, continuing conversation...');
        setNeedsMoreInfo(true);
      }
      
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create H5P content
  const createH5PContent = async (jsonContent) => {
    try {
      console.log('Creating H5P content with:', jsonContent);
      setError(null);
      
      const response = await fetch('/api/createH5P', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonContent })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`H5P API returned ${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('H5P content created successfully:', data);
      
      setContentId(data.contentId);
      setApiEndpoint(data.apiEndpoint);
      setStep('preview');
    } catch (err) {
      setError(`Failed to create H5P content: ${err.message}`);
      console.error('Error creating H5P content:', err);
    }
  };
  
  // Handle initial message
  const handleStartConversation = (initialPrompt) => {
    setStep('conversation');
    sendMessage(initialPrompt);
  };
  
  // Reset conversation
  const handleRestart = () => {
    setMessages([]);
    setContentId(null);
    setApiEndpoint('');
    setIsCompleted(false);
    setError(null);
    setStep('start');
  };
  
  return (
    <Layout title={t('title')}>
      <div className="max-w-4xl mx-auto">
        {step === 'start' ? (
          <div className="card">
            <h1 className="text-2xl font-bold text-center mb-6">{t('createContent')}</h1>
            <p className="text-gray-600 mb-6 text-center">
              {t('description')}
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.prompt.value;
                if (input.trim()) {
                  handleStartConversation(input);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('whatCreate')}
                </label>
                <input
                  type="text"
                  id="prompt"
                  name="prompt"
                  placeholder={t('placeholder')}
                  className="input"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                {t('startCreating')}
              </button>
            </form>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">{t('supportedTypes')}</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>{t('contentTypes.multipleChoice')}</li>
                <li>{t('contentTypes.trueFalse')}</li>
                <li>{t('contentTypes.fillBlanks')}</li>
                <li>{t('contentTypes.dragDrop')}</li>
                <li>{t('contentTypes.imageHotspots')}</li>
                <li>{t('contentTypes.coursePresentation')}</li>
                <li>{t('contentTypes.questionSet')}</li>
                <li>{t('contentTypes.dialogCards')}</li>
                <li>{t('contentTypes.markWords')}</li>
                <li>{t('contentTypes.flashcards')}</li>
                <li>
                  {t('contentTypes.interactiveVideo')} 
                  <span className="text-amber-600 text-sm">{t('warnings.corruptFiles')}</span>
                </li>
                <li>{t('contentTypes.branchingScenario')}</li>
                <li>{t('contentTypes.arithmeticQuiz')}</li>
                <li>{t('contentTypes.dragText')}</li>
                <li>{t('contentTypes.essay')}</li>
                <li>{t('contentTypes.findHotspot')}</li>
                <li>{t('contentTypes.audio')}</li>
                <li>{t('contentTypes.accordion')}</li>
                <li>{t('contentTypes.summary')}</li>
                <li>
                  {t('contentTypes.interactiveBook')} 
                  <span className="text-amber-600 text-sm">{t('warnings.complex')}</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{t('tips')}</span> {t('tipsContent')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {(needsMoreInfo || isLoading) ? (
              <div className="card h-[500px]">
                <h2 className="text-xl font-semibold mb-4">{t('conversation')}</h2>
                <div className="h-[calc(100%-2rem)]">
                  <ConversationUI
                    messages={messages}
                    onSendMessage={sendMessage}
                    isLoading={isLoading}
                    onRestart={handleRestart}
                    isCompleted={isCompleted}
                  />
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center justify-center py-8">
                  <div className="w-full max-w-md">
                    <div className="mb-4 text-center">
                      <h3 className="text-lg font-medium text-gray-900">{t('generating')}</h3>
                      <p className="mt-1 text-sm text-gray-500">{t('generatingDesc')}</p>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                        <div className="w-full animate-pulse bg-primary-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">{t('error')}</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {step === 'preview' && contentId && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">{t('generatedModule')}</h2>
                <PreviewModule contentId={contentId} apiEndpoint={apiEndpoint} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 