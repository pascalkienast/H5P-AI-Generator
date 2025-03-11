import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export default function ConversationUI({ 
  messages, 
  onSendMessage, 
  isLoading, 
  onRestart,
  isCompleted
}) {
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
  
  // Helper to format JSON for display
  const formatJsonForDisplay = (content) => {
    try {
      // Check if the content contains JSON
      const jsonMatch = content.match(/```json([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonContent = jsonMatch[1].trim();
        const formattedJson = JSON.stringify(JSON.parse(jsonContent), null, 2);
        return content.replace(
          /```json([\s\S]*?)```/, 
          `<pre class="bg-gray-100 p-4 rounded-md overflow-auto text-xs my-2"><code>${formattedJson}</code></pre>`
        );
      }
      return content;
    } catch (error) {
      console.error("Error parsing JSON:", error);
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
                    __html: formatJsonForDisplay(msg.content) 
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
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          {isCompleted ? (
            <button 
              type="button" 
              onClick={onRestart}
              className="btn-primary w-full"
            >
              Start New Generation
            </button>
          ) : (
            <>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isCompleted}
                placeholder="Type your message..."
                className="input flex-grow"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim() || isCompleted}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
} 