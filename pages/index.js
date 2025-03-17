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
  const [currentH5PParams, setCurrentH5PParams] = useState(null);
  const [selectedModel, setSelectedModel] = useState('claude'); // Default to Claude
  const [contentTypeSelected, setContentTypeSelected] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [stepTwoReady, setStepTwoReady] = useState(false);
  
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

  // Extract content type from assistant's response
  const extractContentType = (assistantMessage) => {
    // Look for content type mentions in the message
    const contentTypeKeys = [
      { key: 'H5P.MultiChoice', name: 'MultiChoice' },
      { key: 'H5P.TrueFalse', name: 'TrueFalse' },
      { key: 'H5P.Blanks', name: 'Blanks' },
      { key: 'H5P.BranchingScenario', name: 'BranchingScenario' },
      { key: 'H5P.DragQuestion', name: 'DragQuestion' },
      { key: 'H5P.CoursePresentation', name: 'CoursePresentation' },
      { key: 'H5P.QuestionSet', name: 'QuestionSet' },
      { key: 'H5P.Summary', name: 'Summary' },
      { key: 'H5P.InteractiveBook', name: 'InteractiveBook' },
      { key: 'H5P.DragText', name: 'DragText' },
      { key: 'H5P.Accordion', name: 'Accordion' },
      { key: 'H5P.Questionnaire', name: 'Questionnaire' }
    ];
    
    // Check for explicit contentType mentions
    for (const type of contentTypeKeys) {
      if (assistantMessage.includes(type.key) || 
          assistantMessage.toLowerCase().includes(type.name.toLowerCase())) {
        return type.key;
      }
    }
    
    return null;
  };
  
  // Send message to Claude during step 1
  const sendMessage = async (content) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newMessage = { role: 'user', content };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Include selected model in the payload
      const messagePayload = {
        messages: updatedMessages,
        currentH5PParams: currentH5PParams,
        modelProvider: selectedModel,
        step: contentTypeSelected ? 'refine' : 'step1' // Indicate this is step 1
      };
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chat API response:', data);
      
      const assistantMessage = { role: 'assistant', content: data.response[0].text };
      setMessages([...updatedMessages, assistantMessage]);
      
      // If this is the first response and we didn't have a content type before
      if (!contentTypeSelected) {
        const contentType = extractContentType(assistantMessage.content);
        if (contentType) {
          console.log('Content type detected:', contentType);
          setSelectedContentType(contentType);
          setContentTypeSelected(true);
        }
      }
      
      // Don't look for JSON in step 1
      setNeedsMoreInfo(false);
      
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate H5P content in step 2
  const generateH5P = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!selectedContentType) {
        throw new Error('No content type selected');
      }
      
      // Create a new message for the generation request
      const generationRequest = `Please generate the H5P JSON structure for the ${selectedContentType} content we've discussed.`;
      const newMessage = { role: 'user', content: generationRequest };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Prepare payload for step 2
      const messagePayload = {
        messages: updatedMessages,
        currentH5PParams: currentH5PParams,
        modelProvider: selectedModel,
        step: 'step2',
        contentType: selectedContentType
      };
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('H5P generation response:', data);
      
      const assistantMessage = { role: 'assistant', content: data.response[0].text };
      setMessages([...updatedMessages, assistantMessage]);
      
      // Extract JSON content (it should be there in step 2)
      const jsonContent = extractJsonFromResponse(data.response);
      
      if (jsonContent) {
        console.log('JSON content found, creating H5P content...');
        setCurrentH5PParams(jsonContent);
        await createH5PContent(jsonContent);
        setStepTwoReady(true);
      } else {
        setError('No valid H5P structure found in the response');
      }
      
    } catch (err) {
      setError(`Failed to generate H5P: ${err.message}`);
      console.error('Error generating H5P:', err);
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
      setNeedsMoreInfo(false); // New content is created, so we don't need more info
    } catch (err) {
      setError(`Failed to create H5P content: ${err.message}`);
      console.error('Error creating H5P content:', err);
      setNeedsMoreInfo(true); // If error occurs, we need more info from user
    }
  };
  
  // Handle initial message
  const handleStartConversation = (initialPrompt) => {
    setStep('conversation');
    setContentTypeSelected(false); // Reset for new conversation
    setSelectedContentType(null);
    setStepTwoReady(false);
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
    setContentTypeSelected(false);
    setSelectedContentType(null);
    setStepTwoReady(false);
  };
  
  return (
    <Layout 
      title={t('title')} 
      selectedModel={selectedModel} 
      setSelectedModel={setSelectedModel}
    >
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
                <li>{t('contentTypes.coursePresentation')}</li>
                <li>{t('contentTypes.questionSet')}</li>
                <li>{t('contentTypes.summary')}</li>
                <li>{t('contentTypes.dragText')}</li>
                <li>{t('contentTypes.accordion')}</li>
                <li>{t('contentTypes.questionnaire')}</li>
                <li>
                  {t('contentTypes.branchingScenario')}
                  <span className="text-amber-600 text-sm">{t('warnings.complex')}</span>
                </li>
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
            <div className="card h-[500px]">
              <h2 className="text-xl font-semibold mb-4">{t('conversation')}</h2>
              <div className="h-[calc(100%-2rem)]">
                <ConversationUI
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                  onRestart={handleRestart}
                  isCompleted={false}
                  onGenerateH5P={generateH5P}
                  contentTypeSelected={contentTypeSelected}
                  stepTwoReady={stepTwoReady}
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">{t('error')}</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {step === 'preview' && contentId && (
              <div className="card">
                <PreviewModule contentId={contentId} apiEndpoint={apiEndpoint} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 