import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConversationUI from '../components/ConversationUI';
import PreviewModule from '../components/PreviewModule';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState('start'); // 'start', 'conversation', 'preview'
  
  // Extract JSON from Claude's response
  const extractJsonFromResponse = (responseContent) => {
    for (const content of responseContent) {
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/```json([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            return JSON.parse(jsonMatch[1].trim());
          } catch (err) {
            console.error('Failed to parse JSON:', err);
            return null;
          }
        }
      }
    }
    return null;
  };
  
  // Send message to Claude
  const sendMessage = async (content) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to conversation
      const updatedMessages = [
        ...messages,
        { role: 'user', content }
      ];
      setMessages(updatedMessages);
      
      // Call API to get Claude's response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract text from Claude's response
      let assistantContent = '';
      for (const content of data.response) {
        if (content.type === 'text') {
          assistantContent = content.text;
        }
      }
      
      // Add assistant message to conversation
      const newMessages = [
        ...updatedMessages,
        { role: 'assistant', content: assistantContent }
      ];
      setMessages(newMessages);
      
      // Check if response contains JSON
      if (data.hasJson) {
        const jsonContent = extractJsonFromResponse(data.response);
        if (jsonContent) {
          await createH5PContent(jsonContent);
          setIsCompleted(true);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create H5P content
  const createH5PContent = async (jsonContent) => {
    try {
      setError(null);
      
      const response = await fetch('/api/createH5P', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonContent })
      });
      
      if (!response.ok) {
        throw new Error(`H5P API returned ${response.status}`);
      }
      
      const data = await response.json();
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
    <Layout title="H5P AI Generator">
      <div className="max-w-4xl mx-auto">
        {step === 'start' ? (
          <div className="card">
            <h1 className="text-2xl font-bold text-center mb-6">Create H5P Content with AI</h1>
            <p className="text-gray-600 mb-6 text-center">
              Describe the interactive content you want to create, and our AI will generate it for you.
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
                  What would you like to create?
                </label>
                <input
                  type="text"
                  id="prompt"
                  name="prompt"
                  placeholder="e.g., Create a quiz about European capitals"
                  className="input"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Start Creating
              </button>
            </form>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Supported Content Types:</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Multiple Choice Questions</li>
                <li>True/False Questions</li>
                <li>Fill in the Blanks</li>
                <li>Drag and Drop</li>
                <li>Image Hotspots</li>
                <li>Course Presentation</li>
                <li>Question Set</li>
                <li>Dialog Cards</li>
                <li>Mark the Words</li>
                <li>Flashcards</li>
                <li>Interactive Video <span className="text-amber-600 text-sm">(warning: may create corrupt files)</span></li>
                <li>Branching Scenario (complex interactive content)</li>
                <li>Arithmetic Quiz</li>
                <li>Drag Text</li>
                <li>Essay</li>
                <li>Find the Hotspot</li>
                <li>Audio</li>
                <li>Accordion</li>
                <li>Summary</li>
                <li>Interactive Book <span className="text-amber-600 text-sm">(complex)</span></li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Tips:</span> For most educational content, start with Multiple Choice or Question Set. 
                  Complex types like Branching Scenario or Interactive Video may require additional editing after generation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="card h-[500px]">
              <h2 className="text-xl font-semibold mb-4">Conversation</h2>
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
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {step === 'preview' && contentId && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Generated H5P Module</h2>
                <PreviewModule contentId={contentId} apiEndpoint={apiEndpoint} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 