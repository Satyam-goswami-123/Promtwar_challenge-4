// ============================================================
// NexusAI Stadium — Gemini API Service Layer (Security, Caching, & Validation)
// ============================================================

import { GoogleGenAI } from '@google/genai';
import { STADIUM_VENUES, MOCK_INCIDENTS } from '../mockData';

// ---- 1. API Key Format Validation ----
export function isValidApiKey(key: string | undefined): boolean {
  if (!key) return false;
  // Standard Google Gemini API Key format check (39 characters, starts with AIzaSy)
  const pattern = /^AIzaSy[A-Za-z0-9_-]{33}$/;
  return pattern.test(key);
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

// Validate key format before initializing
if (isValidApiKey(apiKey)) {
  aiClient = new GoogleGenAI({ apiKey });
} else {
  console.warn("WARNING: VITE_GEMINI_API_KEY is missing or invalid. Running in Mock/Simulation fallback mode.");
}

// ---- 2. Client-Side Rate Limiting (5 requests per 10 seconds) ----
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW_MS = 10000;
const MAX_REQUESTS_PER_WINDOW = 5;

export function checkRateLimit(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

export function resetRateLimiter(): void {
  requestTimestamps.length = 0;
}

// ---- 3. Input Validation and XSS Sanitization ----
export function sanitizeAndValidateInput(text: string): string {
  if (text.length > 1000) {
    throw new Error("Input exceeds the maximum allowed length of 1000 characters.");
  }
  // Strip HTML tags to mitigate XSS
  const sanitized = text.replace(/<[^>]*>/g, '');
  if (!sanitized.trim()) {
    throw new Error("Input message cannot be empty.");
  }
  return sanitized;
}

// ---- 4. Gemini Response Caching (Session Storage with memory fallback) ----
const localCache: Record<string, string> = {};

export function getCachedResponse(message: string): string | null {
  const key = `nexus_cache_${message.toLowerCase().trim()}`;
  try {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(key);
    }
  } catch (e) {
    // SessionStorage unavailable or restricted
  }
  return localCache[key] || null;
}

export function setCachedResponse(message: string, response: string): void {
  const key = `nexus_cache_${message.toLowerCase().trim()}`;
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, response);
    }
  } catch (e) {
    // SessionStorage unavailable or restricted
  }
  localCache[key] = response;
}

// ---- 5. Request Timeout Wrapper (10 seconds limit) ----
export function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out after 10 seconds."));
    }, timeoutMs);

    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// ---- Gemini Tools Definition (Function Calling) ----
const getLiveMatchScore = {
  name: 'getLiveMatchScore',
  description: 'Returns the current live score, minute, and statistics of the match playing in the stadium.',
  parametersJsonSchema: {
    type: 'object',
    properties: {}
  }
};

const getRestroomQueue = {
  name: 'getRestroomQueue',
  description: 'Checks the queue wait time and occupancy of the nearest restroom.',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'Current location of the user (e.g. Section 112)' }
    },
    required: ['location']
  }
};

const executeFunction = async (name: string, args: any): Promise<any> => {
  switch (name) {
    case 'getLiveMatchScore':
      return {
        match: "Brazil vs Argentina",
        score: "2 - 1",
        minute: "67' live",
        stats: "Possession: BRA 54% | ARG 46%. Shots on target: BRA 8 | ARG 6. Last Goal: Vinicius Jr. (61')"
      };
    case 'getRestroomQueue':
      return {
        location: args.location || "Section 112 Corridor",
        waitTimeMinutes: 3,
        status: "normal",
        accessibilityFriendly: true
      };
    default:
      throw new Error(`Unknown function: ${name}`);
  }
};

// ---- RAG Context Provider ----
export function getStadiumContext(): string {
  return `
    You are NEXUS, the official multilingual AI assistant for the FIFA World Cup 2026.
    You are deployed at AT&T Stadium (Dallas).
    
    Current Stadium Metadata:
    ${JSON.stringify(STADIUM_VENUES[0], null, 2)}
    
    Active Operational Incidents (use this to warning or updating users if relevant):
    ${JSON.stringify(MOCK_INCIDENTS, null, 2)}
    
    Guidelines:
    1. Base your directions and concessions info strictly on the Stadium Metadata.
    2. Maintain a friendly, supportive, and professional tone.
    3. Use markdown elements (lists, bold words) to make answers clear.
    4. If the user reports an emergency (injury, fire, violence), direct them to click the red EMERGENCY button.
  `;
}

// ---- Chat Engine with Streaming, Vision (Multimodal), and Function Calling ----
export async function streamChatResponse(
  message: string,
  history: any[],
  imageBase64: string | null = null,
  onChunk: (text: string) => void
): Promise<string> {
  // A. Input validation & Sanitization
  const cleanMessage = sanitizeAndValidateInput(message);

  // B. Rate limit check
  if (!checkRateLimit()) {
    const limitError = "Rate limit exceeded. Please wait a moment before sending another query.";
    onChunk(limitError);
    return limitError;
  }

  // C. Query caching check (skip cache if there is an image attachment)
  if (!imageBase64) {
    const cached = getCachedResponse(cleanMessage);
    if (cached) {
      // Simulate streaming from cache
      const words = cached.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(r => setTimeout(r, 10));
        onChunk(words[i] + (i === words.length - 1 ? '' : ' '));
      }
      return cached;
    }
  }

  // D. Call real Gemini client with timeout if initialized
  if (aiClient) {
    try {
      const systemInstruction = getStadiumContext();
      const contents: any[] = [];

      history.forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });

      const currentParts: any[] = [];
      if (imageBase64) {
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        currentParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        });
      }
      currentParts.push({ text: cleanMessage });

      contents.push({
        role: 'user',
        parts: currentParts
      });

      // Invoke streaming call with a 10s connection timeout wrapper
      const responseStream = await withTimeout(
        aiClient.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            tools: [{ functionDeclarations: [getLiveMatchScore, getRestroomQueue] }]
          }
        }),
        10000
      );

      let fullResponseText = '';
      let functionCalls: any[] = [];

      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullResponseText += chunk.text;
          onChunk(chunk.text);
        }
        if (chunk.functionCalls) {
          functionCalls.push(...chunk.functionCalls);
        }
      }

      if (functionCalls.length > 0) {
        const functionCall = functionCalls[0];
        try {
          const result = await executeFunction(functionCall.name, functionCall.args);
          
          const finalStream = await withTimeout(
            aiClient.models.generateContentStream({
              model: 'gemini-2.5-flash',
              contents: [
                ...contents,
                { role: 'model', parts: [{ functionCall }] },
                { role: 'tool', parts: [{ functionResponse: { name: functionCall.name, response: result } }] }
              ],
              config: { systemInstruction }
            }),
            10000
          );

          fullResponseText = '';
          for await (const chunk of finalStream) {
            if (chunk.text) {
              fullResponseText += chunk.text;
              onChunk(chunk.text);
            }
          }
        } catch (err) {
          console.error("Function execution failed:", err);
        }
      }

      // Cache the response
      if (!imageBase64) {
        setCachedResponse(cleanMessage, fullResponseText);
      }
      return fullResponseText;
    } catch (error) {
      console.error("Gemini call failed or timed out, falling back to simulator:", error);
    }
  }

  // ---- Mock Fallback Simulator ----
  const lower = cleanMessage.toLowerCase();
  let selectedResponse = "I understand you need help. Let me verify that stadium info for you...";
  
  const responses = {
    restroom: "The nearest accessible restroom is **30 meters away** at Section 111 Corridor (wait: ~3 min).",
    food: "Here are top concessions near you:\n\n🌮 **El Estadio Tacos** (Gate B) - 8 min wait\n🍔 **Champions Grill** (Section 112) - 12 min wait",
    parking: "Lot P3 exit is currently delayed by **25 minutes**. We advise waiting 15 minutes to allow exit traffic to subside.",
    seat: "Your seat in **Section 14C** is located up 2 flights of stairs from Gate 3.",
    score: "⚽ **Brazil 2 — 1 Argentina** (67' Live). Live stats: Possession BRA 54% | ARG 46%.",
    emergency: "🚨 **EMERGENCY ASSISTANCE INITIATED.** EMS has been dispatched to your section. Please stay where you are."
  };

  if (lower.includes('restroom') || lower.includes('toilet') || lower.includes('bathroom') || lower.includes('wc')) {
    selectedResponse = responses.restroom;
  } else if (lower.includes('food') || lower.includes('eat') || lower.includes('hungry') || lower.includes('concession')) {
    selectedResponse = responses.food;
  } else if (lower.includes('park') || lower.includes('car') || lower.includes('lot')) {
    selectedResponse = responses.parking;
  } else if (lower.includes('seat') || lower.includes('section') || lower.includes('my seat')) {
    selectedResponse = responses.seat;
  } else if (lower.includes('score') || lower.includes('goal') || lower.includes('match') || lower.includes('game')) {
    selectedResponse = responses.score;
  } else if (lower.includes('emergency') || lower.includes('medical') || lower.includes('hurt')) {
    selectedResponse = responses.emergency;
  }

  // Simulate streaming output locally
  const words = selectedResponse.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise(r => setTimeout(r, 40));
    onChunk(words[i] + (i === words.length - 1 ? '' : ' '));
  }

  // Cache mock response
  if (!imageBase64) {
    setCachedResponse(cleanMessage, selectedResponse);
  }
  return selectedResponse;
}
