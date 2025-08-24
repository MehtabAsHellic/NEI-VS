/**
 * Zustand store for AI Sandbox state management
 */

import { create } from 'zustand';
import { GeminiResponse } from '../lib/gemini';
import { ForwardArtifacts } from '../lib/tiny-transformer';

export interface SandboxState {
  // Input & Controls
  prompt: string;
  temperature: number;
  topK: number;
  
  // Processing State
  isProcessing: boolean;
  currentStep: number;
  totalSteps: number;
  processingPhase: 'idle' | 'tokenization' | 'embeddings' | 'attention' | 'processing' | 'probabilities' | 'output';
  
  // Results
  response: GeminiResponse | null;
  transformerResults: ForwardArtifacts | null;
  error: string | null;
  
  // UI State
  showExplanations: boolean;
  activeVisualization: 'tokenization' | 'embeddings' | 'attention' | 'processing' | 'probabilities' | 'output';
  animationQueue: string[];
  
  // Actions
  setPrompt: (prompt: string) => void;
  setTemperature: (temperature: number) => void;
  setTopK: (topK: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setProcessingPhase: (phase: SandboxState['processingPhase']) => void;
  setResponse: (response: GeminiResponse | null) => void;
  setTransformerResults: (results: ForwardArtifacts | null) => void;
  setError: (error: string | null) => void;
  setShowExplanations: (show: boolean) => void;
  setActiveVisualization: (viz: SandboxState['activeVisualization']) => void;
  setAnimationQueue: (queue: string[]) => void;
  runFromStep: (step: SandboxState['activeVisualization']) => void;
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
  processingPhase: 'idle',
  response: null,
  transformerResults: null,
  error: null,
  showExplanations: false,
  activeVisualization: 'tokenization',
  animationQueue: [],
  
  // Actions
  setPrompt: (prompt) => set({ prompt }),
  setTemperature: (temperature) => set({ temperature }),
  setTopK: (topK) => set({ topK }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setProcessingPhase: (phase) => set({ processingPhase: phase }),
  setResponse: (response) => set({ response }),
  setTransformerResults: (results) => set({ transformerResults: results }),
  setError: (error) => set({ error }),
  setShowExplanations: (show) => set({ showExplanations: show }),
  setActiveVisualization: (viz) => set({ activeVisualization: viz }),
  setAnimationQueue: (queue) => set({ animationQueue: queue }),
  
  runFromStep: (step) => {
    const steps = ['tokenization', 'embeddings', 'attention', 'processing', 'probabilities', 'output'];
    const startIndex = steps.indexOf(step);
    const queue = steps.slice(startIndex);
    set({ 
      animationQueue: queue,
      activeVisualization: step,
      currentStep: startIndex,
      isProcessing: true,
      processingPhase: step as any
    });
  },
  
  reset: () => set({
    isProcessing: false,
    currentStep: 0,
    processingPhase: 'idle',
    response: null,
    transformerResults: null,
    error: null,
    activeVisualization: 'tokenization',
    animationQueue: []
  }),
}));