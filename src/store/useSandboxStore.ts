/**
 * Zustand store for AI Sandbox state management
 */

import { create } from 'zustand';
import { GeminiResponse } from '../lib/gemini';

export interface SandboxState {
  // Input & Controls
  prompt: string;
  temperature: number;
  topK: number;
  
  // Processing State
  isProcessing: boolean;
  currentStep: number;
  totalSteps: number;
  
  // Results
  response: GeminiResponse | null;
  error: string | null;
  
  // UI State
  showExplanations: boolean;
  activeVisualization: 'tokenization' | 'embeddings' | 'attention' | 'processing' | 'probabilities' | 'output';
  
  // Actions
  setPrompt: (prompt: string) => void;
  setTemperature: (temperature: number) => void;
  setTopK: (topK: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setResponse: (response: GeminiResponse | null) => void;
  setError: (error: string | null) => void;
  setShowExplanations: (show: boolean) => void;
  setActiveVisualization: (viz: SandboxState['activeVisualization']) => void;
  reset: () => void;
}

export const useSandboxStore = create<SandboxState>((set) => ({
  // Initial state
  prompt: '',
  temperature: 0.7,
  topK: 40,
  isProcessing: false,
  currentStep: 0,
  totalSteps: 6,
  response: null,
  error: null,
  showExplanations: false,
  activeVisualization: 'tokenization',
  
  // Actions
  setPrompt: (prompt) => set({ prompt }),
  setTemperature: (temperature) => set({ temperature }),
  setTopK: (topK) => set({ topK }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setResponse: (response) => set({ response }),
  setError: (error) => set({ error }),
  setShowExplanations: (show) => set({ showExplanations: show }),
  setActiveVisualization: (viz) => set({ activeVisualization: viz }),
  
  reset: () => set({
    isProcessing: false,
    currentStep: 0,
    response: null,
    error: null,
    activeVisualization: 'tokenization'
  }),
}));