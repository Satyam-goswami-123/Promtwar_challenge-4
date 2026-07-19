// ============================================================
// NexusAI Stadium — Gemini API Service Layer
// ============================================================

import { GoogleGenAI } from '@google/genai';
import { STADIUM_VENUES, MOCK_INCIDENTS } from '../mockData';

// Validate environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.warn("WARNING: VITE_GEMINI_API_KEY is not configured. Running in Mock/Simulation fallback mode.");
}

let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  aiClient = new GoogleGenAI({ apiKey });
}

// ---- Gemini Tools Definition (Function Calling) ----
const getLiveMatchScore = {
  name: 'getLiveMatchScore',
  description: 'Returns the current live score, minute, and statistics of the match playing in the stadium.',
  parameters: {
    type: 'OBJECT' as const,
    properties: {} as Record<string, any>,
  }
};

const getRestroomQueue = {
  name: 'getRestroomQueue',
  description: 'Checks the queue wait time and occupancy of the nearest restroom.',
  parameters: {
    type: 'OBJECT' as const,
    properties: {
      location: { type: 'STRING' as const, description: 'Current location of the user (e.g. Section 112)' }
    },
    required: ['location']
  }
};

// Function execution mappings
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
  if (aiClient) {
    try {
      const systemInstruction = getStadiumContext();
      const contents: any[] = [];

      // 1. Process History
      history.forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });

      // 2. Prepare current message parts (Text + Image if multimodal)
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
      currentParts.push({ text: message });

      contents.push({
        role: 'user',
        parts: currentParts
      });

      // 3. Request Stream from Gemini with Function Declarations
      const responseStream = await aiClient.models.generateContentStream({
        model: 'gemini-1.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ functionDeclarations: [getLiveMatchScore as any, getRestroomQueue as any] }]
        }
      });

      let fullResponseText = '';
      let functionCalls: any[] = [];

      for await (const chunk of responseStream) {
        // Collect text chunk
        if (chunk.text) {
          fullResponseText += chunk.text;
          onChunk(chunk.text);
        }
        // Collect function call metadata if Gemini requests it
        if (chunk.functionCalls) {
          functionCalls.push(...chunk.functionCalls);
        }
      }

      // 4. Handle Function Calling if requested
      if (functionCalls.length > 0) {
        const functionCall = functionCalls[0]; // execute first call
        try {
          const result = await executeFunction(functionCall.name, functionCall.args);
          
          // Send tool output back to Gemini to get the final streaming response
          const finalStream = await aiClient.models.generateContentStream({
            model: 'gemini-1.5-flash',
            contents: [
              ...contents,
              { role: 'model', parts: [{ functionCall }] },
              { role: 'tool', parts: [{ functionResponse: { name: functionCall.name, response: result } }] }
            ],
            config: { systemInstruction }
          });

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

      return fullResponseText;
    } catch (error) {
      console.error("Gemini stream call failed, using mock fallback:", error);
    }
  }

  // ---- Mock Fallback Simulator ----
  const lower = message.toLowerCase();
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
  let currentText = '';
  for (let i = 0; i < words.length; i++) {
    await new Promise(r => setTimeout(r, 40));
    currentText += (i === 0 ? '' : ' ') + words[i];
    onChunk(words[i] + (i === words.length - 1 ? '' : ' '));
  }

  return selectedResponse;
}
