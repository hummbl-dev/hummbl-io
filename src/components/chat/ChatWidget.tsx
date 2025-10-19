// Floating chat widget component

import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import { getOpenAIService } from '../../services/openaiService';
import { chatStorage } from '../../services/chatStorageService';
import type { ChatConversation } from '../../types/chat';
import './ChatWidget.css';

interface ChatWidgetProps {
  mentalModels?: any[];
  narratives?: any[];
  apiKey?: string;
}

export function ChatWidget({ mentalModels, narratives, apiKey }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Initialize conversation on mount
  useEffect(() => {
    const conversations = chatStorage.loadConversations();
    const currentId = chatStorage.loadCurrentConversationId();
    
    if (currentId) {
      const existing = conversations.find(c => c.id === currentId);
      if (existing) {
        setConversation(existing);
        return;
      }
    }
    
    // Create new conversation
    const newConv = chatStorage.createConversation();
    setConversation(newConv);
    chatStorage.saveCurrentConversationId(newConv.id);
  }, []);

  // Check for API key
  useEffect(() => {
    if (apiKey) {
      setHasApiKey(true);
      getOpenAIService(apiKey);
    }
  }, [apiKey]);

  const handleSendMessage = async (message: string) => {
    if (!conversation || !hasApiKey) {
      setError('OpenAI API key not configured');
      setTimeout(() => setError(null), 5000); // Clear after 5 seconds
      return;
    }

    setError(null); // Clear any previous errors
    setIsLoading(true);

    try {
      // Add user message
      const updatedConv = chatStorage.addMessage(conversation, 'user', message);
      setConversation(updatedConv);

      // Build system context
      const openAI = getOpenAIService();
      const systemContext = openAI.buildSystemContext(mentalModels, narratives);

      // Prepare messages for API
      const apiMessages = updatedConv.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Get AI response
      const response = await openAI.sendMessage(apiMessages, systemContext);

      // Add AI response
      const finalConv = chatStorage.addMessage(updatedConv, 'assistant', response);
      setConversation(finalConv);

      // Save to localStorage
      const allConversations = chatStorage.loadConversations();
      const existingIndex = allConversations.findIndex(c => c.id === finalConv.id);
      
      if (existingIndex >= 0) {
        allConversations[existingIndex] = finalConv;
      } else {
        allConversations.push(finalConv);
      }
      
      chatStorage.saveConversations(allConversations);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return null; // Don't show widget if no API key
  }

  return (
    <>
      {/* Floating Button */}
      <button
        className="chat-widget-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {conversation && conversation.messages.length > 0 && (
          <span className="chat-badge">{conversation.messages.length}</span>
        )}
      </button>

      {/* Chat Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        conversation={conversation}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
