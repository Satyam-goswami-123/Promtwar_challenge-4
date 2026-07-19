import { test, expect, describe, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatTab } from '../src/components/FanApp/ChatTab';
import type { ChatMessage } from '../src/types';

afterEach(cleanup);

const mockMessages: ChatMessage[] = [
  { id: '1', role: 'assistant', content: 'Welcome to the match!', timestamp: new Date() },
  { id: '2', role: 'user', content: 'Where is Section 14C?', timestamp: new Date() }
];

describe('ChatTab Component', () => {
  test('renders message rows correctly', () => {
    render(<ChatTab messages={mockMessages} isTyping={false} sendMessage={() => {}} />);
    
    expect(screen.getByText('Welcome to the match!')).toBeInTheDocument();
    expect(screen.getByText('Where is Section 14C?')).toBeInTheDocument();
  });

  test('calls sendMessage with input text and clears inputs on send button click', () => {
    const handleSend = vi.fn();
    render(<ChatTab messages={mockMessages} isTyping={false} sendMessage={handleSend} />);
    
    const input = screen.getByPlaceholderText(/Ask NEXUS anything/);
    fireEvent.change(input, { target: { value: 'Is there food nearby?' } });
    
    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);
    
    expect(handleSend).toHaveBeenCalledWith('Is there food nearby?', null);
    // Input should be cleared
    expect(input).toHaveValue('');
  });
});
