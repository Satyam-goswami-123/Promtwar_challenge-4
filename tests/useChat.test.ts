import { test, expect, describe, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../src/hooks/useChat';

// Mock the Gemini service
vi.mock('../src/services/geminiService', () => {
  return {
    streamChatResponse: vi.fn().mockImplementation((message, history, image, onChunk) => {
      onChunk("Hello ");
      onChunk("from ");
      onChunk("Gemini");
      return Promise.resolve("Hello from Gemini");
    })
  };
});

describe('useChat Hook', () => {
  test('initializes with empty messages list', () => {
    const { result } = renderHook(() => useChat([]));
    expect(result.current.messages).toEqual([]);
    expect(result.current.isTyping).toBe(false);
  });

  test('sends message and updates state with user and assistant messages', async () => {
    const { result } = renderHook(() => useChat([]));
    
    await act(async () => {
      await result.current.sendMessage("Hi");
    });

    // Check user message is recorded
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('Hi');

    // Check assistant message is loaded with streamed contents
    expect(result.current.messages[1].role).toBe('assistant');
    expect(result.current.messages[1].content).toBe('Hello from Gemini');
  });
});
