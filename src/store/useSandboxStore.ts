/**
 * Zustand store for AI Sandbox state management
 * Implements efficient state updates and mathematical parameter validation
 */

import { create } from 'zustand';
import { GeminiResponse } from '../lib/gemini';
import { ForwardArtifacts } from '../lib/tiny-transformer';

export interface SandboxState {
  // Input & Controls
  prompt: string;
  temperature: number;
  topK: number;
  maxTokens: number;
  seed: number;
  
  // Processing State
  isProcessing: boolean;
  currentStep: number;
  totalSteps: number;
  processingPhase: 'idle' | 'tokenization' | 'embeddings' | 'attention' | 'processing' | 'probabilities' | 'output';
  processingStartTime: number;
  estimatedFlops: number;
  
  // Results
  response: GeminiResponse | null;
  transformerResults: ForwardArtifacts | null;
  error: string | null;
  processingMetrics: {
    totalTime: number;
    tokensPerSecond: number;
    flopsPerSecond: number;
  } | null;
  
  // UI State
  showExplanations: boolean;
  activeVisualization: 'tokenization' | 'embeddings' | 'attention' | 'processing' | 'probabilities' | 'output';
  animationQueue: string[];
  debugMode: boolean;
  
  // Actions
  setPrompt: (prompt: string) => void;
  setTemperature: (temperature: number) => void;
  setTopK: (topK: number) => void;
  setMaxTokens: (maxTokens: number) => void;
  setSeed: (seed: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setProcessingPhase: (phase: SandboxState['processingPhase']) => void;
  setResponse: (response: GeminiResponse | null) => void;
  setTransformerResults: (results: ForwardArtifacts | null) => void;
  setError: (error: string | null) => void;
  setShowExplanations: (show: boolean) => void;
  setActiveVisualization: (viz: SandboxState['activeVisualization']) => void;
  setAnimationQueue: (queue: string[]) => void;
  setDebugMode: (debug: boolean) => void;
  setProcessingMetrics: (metrics: SandboxState['processingMetrics']) => void;
  runFromStep: (step: SandboxState['activeVisualization']) => void;
  reset: () => void;
  validateParameters: () => { isValid: boolean; errors: string[] };
}

export const useSandboxStore = create<SandboxState>((set, get) => ({
  // Initial state
  prompt: '',
  temperature: 0.7, // Balanced creativity/determinism
  topK: 40,
  maxTokens: 200, // Cost control
  seed: 42, // Reproducible results
  isProcessing: false,
  currentStep: 0,
  totalSteps: 6,
  processingPhase: 'idle',
  processingStartTime: 0,
  estimatedFlops: 0,
  response: null,
  transformerResults: null,
  error: null,
  processingMetrics: null,
  showExplanations: false,
  activeVisualization: 'tokenization',
  animationQueue: [],
  debugMode: false,
  
  // Actions
  setPrompt: (prompt) => {
    // Validate prompt length and content
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length <= 500) {
      set({ prompt, error: null });
    } else {
      set({ error: 'Prompt too long (max 500 characters)' });
    }
  },
  
  setTemperature: (temperature) => {
    // Clamp temperature to valid range
    const clampedTemp = Math.max(0.1, Math.min(2.0, temperature));
    set({ temperature: clampedTemp });
  },
  
  setTopK: (topK) => {
    // Clamp top-K to valid range
    const clampedTopK = Math.max(1, Math.min(100, Math.floor(topK)));
    set({ topK: clampedTopK });
  },
  
  setMaxTokens: (maxTokens) => {
    const clampedMaxTokens = Math.max(10, Math.min(500, Math.floor(maxTokens)));
    set({ maxTokens: clampedMaxTokens });
  },
  
  setSeed: (seed) => {
    const clampedSeed = Math.max(0, Math.floor(seed));
    set({ seed: clampedSeed });
  },
  
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setProcessingPhase: (phase) => {
    const state = get();
    if (phase !== 'idle' && state.processingStartTime === 0) {
      // Start timing
      set({ processingPhase: phase, processingStartTime: Date.now() });
    } else if (phase === 'idle' && state.processingStartTime > 0) {
      // Calculate metrics
      const totalTime = Date.now() - state.processingStartTime;
      const tokenCount = state.prompt.split(/\s+/).length;
      const tokensPerSecond = tokenCount / (totalTime / 1000);
      const flopsPerSecond = state.estimatedFlops / (totalTime / 1000);
      
      set({ 
        processingPhase: phase,
        processingMetrics: { totalTime, tokensPerSecond, flopsPerSecond },
        processingStartTime: 0
      });
    } else {
      set({ processingPhase: phase });
    }
  },
  
  setResponse: (response) => {
    set({ response });
    // Update user stats and metrics when response is received
    if (response && typeof window !== 'undefined') {
      const userEmail = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.email;
      if (userEmail) {
        const statsKey = `neivs-stats-${userEmail}`;
        const currentStats = JSON.parse(localStorage.getItem(statsKey) || '{}');
        const updatedStats = {
          ...currentStats,
          sandboxSessions: (currentStats.sandboxSessions || 0) + 1,
          totalPrompts: (currentStats.totalPrompts || 0) + 1,
          totalTokensProcessed: (currentStats.totalTokensProcessed || 0) + response.processingSteps.tokenization.count,
          lastActivity: new Date().toISOString()
        };
        localStorage.setItem(statsKey, JSON.stringify(updatedStats));
      }
    }
  },
  
  setTransformerResults: (results) => set({ transformerResults: results }),
  setError: (error) => set({ error }),
  setShowExplanations: (show) => set({ showExplanations: show }),
  setActiveVisualization: (viz) => set({ activeVisualization: viz }),
  setAnimationQueue: (queue) => set({ animationQueue: queue }),
  setDebugMode: (debug) => set({ debugMode: debug }),
  setProcessingMetrics: (metrics) => set({ processingMetrics: metrics }),
  
  runFromStep: (step) => {
    const steps = ['tokenization', 'embeddings', 'attention', 'processing', 'probabilities', 'output'];
    const startIndex = steps.indexOf(step);
    const queue = steps.slice(startIndex);
    
    // Estimate computational complexity
    const state = get();
    const tokenCount = state.prompt.split(/\s+/).length;
    const estimatedFlops = tokenCount * 768 * 24 * 4; // Rough transformer FLOP estimate
    
    set({ 
      animationQueue: queue,
      activeVisualization: step,
      currentStep: startIndex,
      isProcessing: true,
      processingPhase: step as any,
      estimatedFlops,
      error: null
    });
  },
  
  reset: () => set({
    isProcessing: false,
    currentStep: 0,
    processingPhase: 'idle',
    processingStartTime: 0,
    estimatedFlops: 0,
    response: null,
    transformerResults: null,
    error: null,
    processingMetrics: null,
    activeVisualization: 'tokenization',
    animationQueue: []
  }),
  
  validateParameters: () => {
    const state = get();
    const errors: string[] = [];
    
    if (!state.prompt.trim()) {
      errors.push('Prompt cannot be empty');
    }
    
    if (state.prompt.length > 500) {
      errors.push('Prompt too long (max 500 characters)');
    }
    
    if (state.temperature < 0.1 || state.temperature > 2.0) {
      errors.push('Temperature must be between 0.1 and 2.0');
    }
    
    if (state.topK < 1 || state.topK > 100) {
      errors.push('Top-K must be between 1 and 100');
    }
    
    const tokenCount = state.prompt.split(/\s+/).filter(t => t.length > 0).length;
    if (tokenCount > 100) {
      errors.push('Too many tokens (max 100 for efficiency)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}));