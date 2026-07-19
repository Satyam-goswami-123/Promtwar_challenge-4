import { test, expect, describe, vi, beforeEach } from 'vitest';
import {
  streamChatResponse,
  getStadiumContext,
  isValidApiKey,
  checkRateLimit,
  sanitizeAndValidateInput,
  getCachedResponse,
  setCachedResponse,
  withTimeout,
  resetRateLimiter
} from '../src/services/geminiService';

describe('Gemini Service Layer - Core Features', () => {
  beforeEach(() => {
    resetRateLimiter();
  });
  
  test('getStadiumContext returns official instruction prompt containing FIFA 2026 details', () => {
    const context = getStadiumContext();
    expect(context).toContain('NEXUS');
    expect(context).toContain('FIFA World Cup 2026');
    expect(context).toContain('AT&T Stadium');
  });

  // ---- 1. API Key Validation Tests ----
  test('isValidApiKey checks key length and prefix', () => {
    expect(isValidApiKey('AIzaSyDyWEHbxgu8FPcdMp2ZygU2xiVwbLntcbk')).toBe(true);
    expect(isValidApiKey('invalidKey')).toBe(false);
    expect(isValidApiKey(undefined)).toBe(false);
    expect(isValidApiKey('')).toBe(false);
  });

  // ---- 2. Rate Limiting Tests ----
  test('checkRateLimit allows up to 5 requests in a window and then blocks', () => {
    // Clear initial state by calling rate limiter
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit()).toBe(true);
    }
    // 6th call must fail
    expect(checkRateLimit()).toBe(false);
  });

  // ---- 3. Input Validation & XSS Sanitization Tests ----
  test('sanitizeAndValidateInput throws on overly long input', () => {
    const longInput = 'a'.repeat(1001);
    expect(() => sanitizeAndValidateInput(longInput)).toThrow("Input exceeds the maximum allowed length");
  });

  test('sanitizeAndValidateInput strips HTML tags to prevent XSS', () => {
    const input = 'Hello <script>alert("XSS")</script> World';
    const output = sanitizeAndValidateInput(input);
    expect(output).toBe('Hello alert("XSS") World');
  });

  test('sanitizeAndValidateInput throws on empty queries', () => {
    expect(() => sanitizeAndValidateInput('    ')).toThrow("cannot be empty");
  });

  // ---- 4. Caching Tests ----
  test('getCachedResponse and setCachedResponse cache message answers', () => {
    const message = "Where is Section 14C?";
    const response = "It is on Level 3, turn right at Gate 3.";
    
    setCachedResponse(message, response);
    expect(getCachedResponse(message)).toBe(response);
  });

  // ---- 5. Timeout Helper Tests ----
  test('withTimeout resolves if promise completes before timeout', async () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve('success'), 50));
    const result = await withTimeout(promise, 100);
    expect(result).toBe('success');
  });

  test('withTimeout rejects if promise takes too long', async () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve('success'), 200));
    await expect(withTimeout(promise, 50)).rejects.toThrow("Request timed out");
  });

  // ---- 6. Fallback Simulator Integration Tests ----
  test('streamChatResponse falls back to simulated stream for food queries', async () => {
    let outputText = '';
    const onChunk = (chunk: string) => {
      outputText += chunk;
    };

    const finalResponse = await streamChatResponse('Where is the best food concessions?', [], null, onChunk);
    
    expect(finalResponse).toContain('Champions Grill');
    expect(outputText).toBe(finalResponse);
  });
});
