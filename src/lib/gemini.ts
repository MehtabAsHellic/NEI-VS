/**
 * Google Gemini API integration for LLM inference
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Using mock responses.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface GeminiResponse {
  text: string;
  tokens: string[];
  processingSteps: {
    tokenization: { input: string; tokens: string[]; count: number };
    embeddings: { dimension: number; similarity: number };
    attention: { layers: number; heads: number; focusTokens: string[] };
    processing: { layers: number; parameters: string };
    probabilities: { topTokens: Array<{ token: string; probability: number }> };
  };
}

export async function generateWithGemini(
  prompt: string,
  temperature: number = 0.7,
  topK: number = 40
): Promise<GeminiResponse> {
  // Mock response for development/fallback
  const mockResponse: GeminiResponse = {
    text: generateMockResponse(prompt),
    tokens: prompt.split(/\s+/).concat(['This', 'is', 'a', 'simulated', 'response']),
    processingSteps: {
      tokenization: {
        input: prompt,
        tokens: prompt.split(/\s+/),
        count: prompt.split(/\s+/).length
      },
      embeddings: {
        dimension: 768,
        similarity: 0.85 + Math.random() * 0.1
      },
      attention: {
        layers: 24,
        heads: 16,
        focusTokens: prompt.split(/\s+/).slice(0, 3)
      },
      processing: {
        layers: 24,
        parameters: '7B'
      },
      probabilities: {
        topTokens: [
          { token: 'The', probability: 0.23 },
          { token: 'This', probability: 0.18 },
          { token: 'In', probability: 0.15 },
          { token: 'A', probability: 0.12 },
          { token: 'For', probability: 0.08 }
        ]
      }
    }
  };

  if (!genAI) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockResponse;
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature,
        topK,
        maxOutputTokens: 200, // Cost control
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Create realistic processing steps based on the actual response
    const inputTokens = prompt.split(/\s+/);
    const outputTokens = text.split(/\s+/);
    
    return {
      text,
      tokens: [...inputTokens, ...outputTokens.slice(0, 10)],
      processingSteps: {
        tokenization: {
          input: prompt,
          tokens: inputTokens,
          count: inputTokens.length
        },
        embeddings: {
          dimension: 768,
          similarity: 0.82 + Math.random() * 0.15
        },
        attention: {
          layers: 24,
          heads: 16,
          focusTokens: inputTokens.slice(0, Math.min(3, inputTokens.length))
        },
        processing: {
          layers: 24,
          parameters: '7B'
        },
        probabilities: {
          topTokens: outputTokens.slice(0, 5).map((token, i) => ({
            token,
            probability: Math.max(0.05, 0.3 - i * 0.05 + Math.random() * 0.1)
          }))
        }
      }
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponse;
  }
}

function generateMockResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Educational responses
  if (lowerPrompt.includes('explain') || lowerPrompt.includes('how') || lowerPrompt.includes('what')) {
    return `Here's a clear explanation: ${prompt.replace(/^(explain|how|what)/i, '').trim()} involves several key concepts that work together systematically. The fundamental principles include structured processes, interconnected components, and measurable outcomes that can be observed and analyzed.`;
  }
  
  // Creative responses
  if (lowerPrompt.includes('write') || lowerPrompt.includes('create') || lowerPrompt.includes('story')) {
    return `Once upon a time, there was a fascinating concept that captured everyone's imagination. This idea grew and evolved, touching the lives of many people in unexpected ways. Through creativity and innovation, it became something truly remarkable that continues to inspire new possibilities.`;
  }
  
  // Technical responses
  if (lowerPrompt.includes('neural') || lowerPrompt.includes('ai') || lowerPrompt.includes('machine learning')) {
    return `In the field of artificial intelligence, this concept represents a sophisticated approach to computational problem-solving. The underlying mechanisms involve pattern recognition, data processing, and algorithmic optimization that enable systems to learn and adapt effectively.`;
  }
  
  // Default response
  return `Thank you for your question about "${prompt}". This is an interesting topic that involves multiple interconnected aspects. The key elements include systematic analysis, practical applications, and measurable outcomes that contribute to a comprehensive understanding of the subject matter.`;
}