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
    
    // Check for explicit recommendation phrases
    const recommendationPhrases = [
      "I recommend using",
      "I suggest using",
      "best choice would be",
      "most appropriate content type",
      "recommend the"
    ];
    
    let contentType = null;
    
    // First check for clear recommendations
    for (const phrase of recommendationPhrases) {
      if (assistantMessage.includes(phrase)) {
        // If we found a recommendation phrase, check for content types nearby
        for (const type of contentTypeKeys) {
          if (assistantMessage.includes(type.key)) {
            console.log(`Found recommendation for ${type.key} with phrase "${phrase}"`);
            return type.key;
          }
        }
      }
    }
    
    // If no recommendation phrases found, check for any mention of content types
    for (const type of contentTypeKeys) {
      if (assistantMessage.includes(type.key) || 
          assistantMessage.toLowerCase().includes(type.name.toLowerCase())) {
        contentType = type.key;
      }
    }
    
    return contentType;
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
      
      // Enable refinement mode but keep the chat active
      setStepTwoReady(false);
      
      // Add a system message to inform the user they can refine the content
      const systemMessage = { 
        role: 'assistant', 
        content: t('contentRefinementReady')
      };
      setMessages(prev => [...prev, systemMessage]);
      
    } catch (err) {
      setError(`Failed to create H5P content: ${err.message}`);
      console.error('Error creating H5P content:', err);
      setNeedsMoreInfo(true); // If error occurs, we need more info from user
      setStepTwoReady(false); // Re-enable the chat input to allow corrections
      
      // Return the error so the caller can handle retries
      return { error: err };
    }
    
    // Return success
    return { success: true };
  };
  
  // Send message to Claude during step 1 or for refinement
  const sendMessage = async (content) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newMessage = { role: 'user', content };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Determine the current step
      let currentStep = 'step1';
      if (step === 'preview' && contentId) {
        currentStep = 'refine'; // Use refine mode if we already have content
      } else if (contentTypeSelected && !stepTwoReady) {
        currentStep = 'step1'; // Still in step 1 but content type is selected
      }
      
      // Include selected model in the payload
      const messagePayload = {
        messages: updatedMessages,
        currentH5PParams: currentH5PParams, // Pass the current H5P parameters for refinement
        modelProvider: selectedModel,
        step: currentStep,
        contentType: selectedContentType
      };
      
      console.log(`Sending message in step: ${currentStep}`, 
        currentStep === 'refine' ? 'with current H5P parameters' : '');
      
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
      
      // Get the assistant's response text
      const assistantResponseText = data.response[0].text;
      const assistantMessage = { role: 'assistant', content: assistantResponseText };
      setMessages([...updatedMessages, assistantMessage]);
      
      // Check if this is step 1 and we need to detect content type
      if (!contentTypeSelected && currentStep === 'step1') {
        const contentType = extractContentType(assistantResponseText);
        if (contentType) {
          console.log('Content type detected:', contentType);
          setSelectedContentType(contentType);
          setContentTypeSelected(true);
        }
      }
      
      // Check if response contains JSON during refinement
      if (currentStep === 'refine') {
        const jsonContent = extractJsonFromResponse(data.response);
        if (jsonContent) {
          console.log('Updated JSON content found, recreating H5P content...');
          setCurrentH5PParams(jsonContent);
          await createH5PContent(jsonContent);
        }
      }
      
      // Always set needsMoreInfo to false to allow continuation of the conversation
      setNeedsMoreInfo(false);
      
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate H5P content in step 2
  const generateH5P = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!selectedContentType) {
        throw new Error('No content type selected');
      }
      
      // Set a maximum number of retry attempts
      const MAX_RETRIES = 2;
      const isRetry = retryCount > 0;
      
      // Create a message for the generation request
      let generationRequest;
      
      if (isRetry) {
        // For retry, include specific instructions about the error
        generationRequest = `The previous attempt to generate the H5P content had validation errors. Please fix the JSON structure for the ${selectedContentType} content and ensure it follows the correct format. Make sure all required fields are included and properly formatted.`;
        
        // Add a user message to show we're retrying
        const retryMessage = { 
          role: 'user', 
          content: t('retryGeneration') 
        };
        setMessages(prev => [...prev, retryMessage]);
      } else {
        // First attempt - standard message
        generationRequest = `Please generate the H5P JSON structure for the ${selectedContentType} content we've discussed.`;
      }
      
      const newMessage = { role: 'user', content: generationRequest };
      const updatedMessages = [...messages, newMessage];
      
      if (!isRetry) {
        // Only add the message to the chat history on first attempt
        setMessages(updatedMessages);
      }
      
      console.log(`${isRetry ? 'Retrying' : 'Initiating'} step 2 (H5P generation) for content type: ${selectedContentType} (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      console.log(`Using AI model: ${selectedModel}`);
      
      // Prepare payload for step 2
      const messagePayload = {
        messages: updatedMessages,
        currentH5PParams: currentH5PParams,
        modelProvider: selectedModel,
        step: 'step2',
        contentType: selectedContentType
      };
      
      // Tell the user we're in generation mode
      setStepTwoReady(true);
      
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
      
      // Update the UI with the assistant's response
      if (data.response && data.response.length > 0) {
        const assistantMessage = { 
          role: 'assistant', 
          content: data.response[0].text 
        };
        
        // Only add the response to the chat history if it's not a retry or if it's the final retry
        if (!isRetry || retryCount >= MAX_RETRIES) {
          setMessages(prev => [...prev, assistantMessage]);
        }
        
        // Extract JSON content (it should be there in step 2)
        const jsonContent = extractJsonFromResponse(data.response);
        
        if (jsonContent) {
          console.log('JSON content found, creating H5P content...');
          setCurrentH5PParams(jsonContent);
          const result = await createH5PContent(jsonContent);
          
          // If content creation failed and we haven't exceeded max retries, try again
          if (result.error && retryCount < MAX_RETRIES) {
            console.log(`H5P content creation failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
            
            // Add a system message indicating the retry
            if (retryCount === 0) { // Only show this message on first retry
              const retryingMessage = { 
                role: 'assistant', 
                content: t('retryingGeneration')
              };
              setMessages(prev => [...prev, retryingMessage]);
            }
            
            // Wait a moment before retrying to allow UI to update
            setTimeout(() => {
              generateH5P(retryCount + 1);
            }, 1000);
          }
        } else {
          // No JSON found in the response
          if (retryCount < MAX_RETRIES) {
            console.log(`No valid JSON found in response, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
            
            // Add a system message indicating the retry
            if (retryCount === 0) { // Only show this message on first retry
              const retryingMessage = { 
                role: 'assistant', 
                content: t('retryingGeneration')
              };
              setMessages(prev => [...prev, retryingMessage]);
            }
            
            // Wait a moment before retrying
            setTimeout(() => {
              generateH5P(retryCount + 1);
            }, 1000);
          } else {
            setError('No valid H5P structure found after multiple attempts. Please try refining your request or selecting a different content type.');
            setStepTwoReady(false); // Re-enable the chat input
          }
        }
      } else {
        throw new Error('Empty response from AI');
      }
      
    } catch (err) {
      setError(`Failed to generate H5P: ${err.message}`);
      console.error('Error generating H5P:', err);
      setStepTwoReady(false); // Re-enable the chat input to allow corrections
    } finally {
      if (retryCount === 0 || retryCount >= 2) {
        // Only set loading to false on initial attempt or final retry
        setIsLoading(false);
      }
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