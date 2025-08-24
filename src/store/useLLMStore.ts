/**
 * Zustand store for LLM Sandbox state
 */

import { create } from 'zustand';
import { ForwardArtifacts, Hyperparams } from '../lib/tiny-transformer';

interface LLMState {
  // Input
  prompt: string;
  setPrompt: (prompt: string) => void;
  
  // Controls
  seqLen: number;
  temperature: number;
  topK: number;
  layerView: number;
  headView: number;
  maskIndex: number | null;
  seed: number;
  
  setSeqLen: (seqLen: number) => void;
  setTemperature: (temperature: number) => void;
  setTopK: (topK: number) => void;
  setLayerView: (layerView: number) => void;
  setHeadView: (headView: number) => void;
  setMaskIndex: (maskIndex: number | null) => void;
  setSeed: (seed: number) => void;
  
  // Hyperparameters
  hyper: Hyperparams;
  setHyper: (hyper: Partial<Hyperparams>) => void;
  
  // State
  isRunning: boolean;
  isPlaying: boolean;
  stepIndex: number;
  artifacts: ForwardArtifacts | null;
  error: string | null;
  
  setIsRunning: (isRunning: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setStepIndex: (stepIndex: number) => void;
  setArtifacts: (artifacts: ForwardArtifacts | null) => void;
  setError: (error: string | null) => void;
  
  // Actions
  reset: () => void;
}

export const useLLMStore = create<LLMState>((set, get) => ({
  // Input
  prompt: 'The quick brown fox jumps over the lazy dog.',
  setPrompt: (prompt) => set({ prompt }),
  
  // Controls
  seqLen: 64,
  temperature: 0.7,
  topK: 10,
  layerView: 0,
  headView: 0,
  maskIndex: null,
  seed: 1337,
  
  setSeqLen: (seqLen) => set({ seqLen }),
  setTemperature: (temperature) => set({ temperature }),
  setTopK: (topK) => set({ topK }),
  setLayerView: (layerView) => set({ layerView }),
  setHeadView: (headView) => set({ headView }),
  setMaskIndex: (maskIndex) => set({ maskIndex }),
  setSeed: (seed) => set({ seed }),
  
  // Hyperparameters
  hyper: {
    d_model: 64,
    n_head: 4,
    d_head: 16,
    n_layer: 2,
    seqLen: 64,
    ffn_mult: 2,
  },
  setHyper: (hyper) => set((state) => ({ hyper: { ...state.hyper, ...hyper } })),
  
  // State
  isRunning: false,
  isPlaying: false,
  stepIndex: 0,
  artifacts: null,
  error: null,
  
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setStepIndex: (stepIndex) => set({ stepIndex }),
  setArtifacts: (artifacts) => set({ artifacts }),
  setError: (error) => set({ error }),
  
  // Actions
  reset: () => set({
    isRunning: false,
    isPlaying: false,
    stepIndex: 0,
    artifacts: null,
    error: null,
  }),
}));