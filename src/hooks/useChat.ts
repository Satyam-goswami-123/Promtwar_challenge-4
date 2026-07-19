import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { getAIResponse } from '../services/ai';

export function useChat(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string, imagePreview: string | null = null) => {
    if (!text.trim() && !imagePreview) return;
    
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`, 
      role: 'user', 
      content: text, 
      timestamp: new Date(),
      attachments: imagePreview ? [{ type: 'image', url: imagePreview, name: 'upload.jpg' }] : undefined,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await getAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`, 
        role: 'assistant', 
        content: response, 
        timestamp: new Date(),
        metadata: {
          agent: 'FanAssistantAgent',
          model: 'gemini-1.5-pro',
          tokens: Math.floor(Math.random() * 200) + 80,
          ragSources: ['stadium-kb', 'real-time-data']
        }
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize — I\'m experiencing a brief connection issue. Please try again in a moment.',
        timestamp: new Date(),
        metadata: { agent: 'FanAssistantAgent', model: 'gemini-1.5-pro' }
      }]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return { messages, setMessages, isTyping, sendMessage };
}
