/**
 * Web Worker for Transformer forward pass computation
 */

import { forward, initWeights, Hyperparams, ForwardArtifacts } from './tiny-transformer';

export interface ForwardRequest {
  text: string;
  seqLen: number;
  temperature: number;
  topK: number;
  layerView: number;
  headView: number;
  maskIndex?: number | null;
  seed: number;
  hyper: Hyperparams;
}

let cachedWeights: any = null;
let cachedSeed: number = -1;

self.onmessage = function(e: MessageEvent<ForwardRequest>) {
  const request = e.data;
  
  try {
    // Initialize or reuse weights
    if (cachedSeed !== request.seed) {
      cachedWeights = initWeights(request.hyper, request.seed);
      cachedSeed = request.seed;
    }
    
    // Run forward pass
    const artifacts = forward(request.text, request.hyper, cachedWeights, {
      temperature: request.temperature,
      topK: request.topK,
      layerView: request.layerView,
      headView: request.headView,
      maskIndex: request.maskIndex,
    });
    
    self.postMessage(artifacts);
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};