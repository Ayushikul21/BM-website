import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Chatbot from './Chatbot';


const ChatbotToggle = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
    setIsMinimized(false);
  };

  const handleMinimizeChatbot = () => {
    setIsMinimized(true);
    setIsChatbotOpen(false);
  };

  const handleRestoreChatbot = () => {
    setIsChatbotOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chatbot Toggle Button - Show when chatbot is closed or minimized */}
      {(isMinimized || !isChatbotOpen) && (
        <button
          onClick={isMinimized ? handleRestoreChatbot : handleOpenChatbot}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {isMinimized ? 'Restore chat' : 'Need help? Chat with us'}
            </div>
          </div>
        </button>
      )}

      {/* Chatbot Component - Show when open and not minimized */}
      {isChatbotOpen && (
        <Chatbot
          onClose={handleCloseChatbot} 
          onMinimize={handleMinimizeChatbot} 
        />
      )}
      
    </>
  );
};

export default ChatbotToggle;