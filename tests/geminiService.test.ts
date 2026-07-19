import { test, expect, describe, vi } from 'vitest';
import { streamChatResponse, getStadiumContext } from '../src/services/geminiService';

describe('Gemini Service Layer', () => {
  test('getStadiumContext returns official instruction prompt containing FIFA 2026 details', () => {
    const context = getStadiumContext();
    expect(context).toContain('NEXUS');
    expect(context).toContain('FIFA World Cup 2026');
    expect(context).toContain('AT&T Stadium');
  });

  test('streamChatResponse falls back to simulated stream for food queries', async () => {
    let outputText = '';
    const onChunk = (chunk: string) => {
      outputText += chunk;
    };

    const finalResponse = await streamChatResponse('Where is the best food concessions?', [], null, onChunk);
    
    expect(finalResponse).toContain('Champions Grill');
    expect(outputText).toBe(finalResponse);
  });

  test('streamChatResponse falls back to simulated stream for restroom queries', async () => {
    let outputText = '';
    const onChunk = (chunk: string) => {
      outputText += chunk;
    };

    const finalResponse = await streamChatResponse('Where is the restroom?', [], null, onChunk);
    
    expect(finalResponse).toContain('Section 111 Corridor');
    expect(outputText).toBe(finalResponse);
  });

  test('streamChatResponse falls back to default simulator response for unrecognized queries', async () => {
    let outputText = '';
    const onChunk = (chunk: string) => {
      outputText += chunk;
    };

    const finalResponse = await streamChatResponse('random question query text', [], null, onChunk);
    
    expect(finalResponse).toContain('Let me verify that stadium info for you');
    expect(outputText).toBe(finalResponse);
  });
});
