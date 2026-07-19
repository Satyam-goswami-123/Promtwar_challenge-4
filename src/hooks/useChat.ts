import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';

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
    
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsTyping(true);

    const aiMsgId = `a-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      metadata: {
        agent: 'FanAssistantAgent',
        model: 'gemini-1.5-flash',
        ragSources: ['stadium-kb', 'real-time-data']
      }
    };

    setMessages(prev => [...prev, aiMsg]);

    try {
      await streamChatResponse(text, messages, imagePreview, (chunk) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === aiMsgId) {
            return { ...msg, content: msg.content + chunk };
          }
          return msg;
        }));
      });
    } catch {
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return {
            ...msg,
            content: "I apologize — I'm experiencing a connection issue. Please try again in a moment."
          };
        }
        return msg;
      }));
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  return { messages, setMessages, isTyping, sendMessage };
}
