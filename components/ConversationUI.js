import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export default function ConversationUI({ 
  messages, 
  onSendMessage, 
  isLoading, 
  onRestart,
  isCompleted,
  onGenerateH5P,
  stepTwoReady = false,
  contentTypeSelected = false
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  // Helper to format content for display
  const formatContentForDisplay = (content) => {
    try {
      // Check if the content contains JSON
      const jsonMatch = content.match(/```json([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        // Replace the entire JSON block with a nicer message
        const cleanedContent = content.replace(
          /```json([\s\S]*?)```/, 
          `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-2 rounded">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="font-medium text-blue-700">${t('h5pGenerated')}</p>
            </div>
            <p class="text-sm text-blue-600 mt-1">${t('h5pGeneratedDesc')}</p>
          </div>`
        );
        return cleanedContent;
      }
      return content;
    } catch (error) {
      console.error("Error processing content:", error);
      return content;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={clsx(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={clsx(
                "max-w-[80%] rounded-lg p-4",
                msg.role === "user" 
                  ? "bg-primary-600 text-white rounded-tr-none" 
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              )}
            >
              {msg.role === "user" ? (
                <p>{msg.content}</p>
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: formatContentForDisplay(msg.content) 
                  }} 
                />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="mt-4">
        {contentTypeSelected && !stepTwoReady ? (
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={onGenerateH5P}
              className="btn-primary flex-grow"
              disabled={isLoading}
            >
              {t('generateH5P')}
            </button>
            <button 
              type="button" 
              onClick={onRestart}
              className="btn-secondary"
            >
              {t('backToStart')}
            </button>
          </div>
        ) : (
          isCompleted && !messages.some(msg => 
            msg.role === 'assistant' && msg.content.includes('```json')
          ) ? (
            <button 
              type="button" 
              onClick={onRestart}
              className="btn-primary w-full"
            >
              {t('startNew')}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || stepTwoReady}
                placeholder={t('typeMessage')}
                className="input flex-grow"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim() || stepTwoReady}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('send')}
              </button>
              {messages.some(msg => msg.role === 'assistant' && msg.content.includes('```json')) && (
                <button 
                  type="button" 
                  onClick={onRestart}
                  className="btn-secondary"
                >
                  {t('startNew')}
                </button>
              )}
            </form>
          )
        )}
      </div>
    </div>
  );
} 